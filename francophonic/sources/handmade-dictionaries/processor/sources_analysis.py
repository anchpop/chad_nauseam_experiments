from pathlib import Path
from os import listdir, environ
from os.path import isfile, join
from collections import Counter
import re
import yaml
from google.cloud import texttospeech
import uuid
import html
import hashlib
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper
import time
from processor.utils import *


# The sentence extraction regex is super hacky. It can be tested at https://regex101.com/r/RTlar9/1/ .
# Here are some test sentences: 
"""
L’asile de vieillards est à Marengo, à quatre-vingts kilomètres d’Alger.

"Je n'ai rien fait de tel," dit-il, "mais j'ai dj trouv un autre vu." "Je n'ai rien fait de tel," dit-il, "mais j'ai dj trouv un autre vu."

"Je n'ai rien fait de tel!" dit-il, "mais j'ai dj trouv un autre vu." Sacré petit bonhomme, gloussa Mr Dursley en quittant la maison.

– Sacré petit bonhomme, gloussa Mr Dursley en quittant la maison.

L’asile de vieillards est à Marengo, à quatre-vingts kilomètres d’Alger. Je prendrai l’autobus à deux heures et j’arriverai dans l’après-midi. J’ai demandé deux jours de congé à mon patron et il ne pouvait pas me les refuser avec une excuse pareille. Mais il n’avait pas l’air content. Je lui ai même dit : « Ce n’est pas de ma faute. » Il n’a pas répondu.


Harry prit une profonde inspiration. "Je n'ai rien fait de tel," dit-il, "mais j'ai déjà trouvé un autre vœu." Harry Potter pivota afin d'observer l'audience, et sa voix se raffermit au fur et à mesure qu'il parlait. "Les gens craignent les traîtres à cause des dommages directs que ceux-ci provoquent, des soldats qu'ils abattent et des secrets qu'ils révèlent. Mais ce n'est qu'une partie du danger. Ce que les gens font parce qu'ils ont peur des traître leur coûte aussi. J'ai utilisé cette stratégie aujourd'hui contre Soleil et contre Dragon. Je n'ai pas dit à mes traîtres de causer autant de dommages que possible. Je leur ai dit d'agir afin de créer le maximum de méfiance et de confusion, et de pousser les généraux à agir de la plus coûteuse des manières possibles dans leurs tentatives de les empêcher de trahir à nouveau. Lorsqu'il n'y a que quelques traîtres et qu'un pays entier leur fait face, il va de soi que ce que ce petit groupe fait est moins dommageable que ce que le pays entier peut faire pour les arrêter, que le remède peut être pire que le symptôme -"


"Oui," dit Harry Potter, "ça a été assez difficile de trouver un vœu qui symbolise le coût de l'unité. Mais le problème d'agir ensemble ne concerne pas que les guerres, c'est quelque chose que nous devons résoudre tout au long de notre vie, tous les jours. Si tout le monde se coordonne en utilisant les même règles et que les règles sont stupides, alors si une personne décide de faire les choses différemment, elle brise les règles. Mais si tout le monde décide de faire les choses différemment, alors un changement peut avoir lieu. C'est exactement le même problème quand tout le monde doit agir ensemble. Pour la première personne qui s'exprime, elle a l'air d'aller à l'encontre du désir de la foule. Et si l'on croit que la seule chose qui importe est que les gens soient toujours unis, alors on ne peut jamais changer les règles du jeu, peu importe à quel point les règles sont stupides. Donc mon vœu, pour symboliser ce qui se passe lorsque les gens s'unissent dans la mauvaise direction, est qu'à Poudlard, on joue au Quidditch sans le Vif d'Or."

"QUOI ?" hurlèrent cent voix dans la foule, et la mâchoire de Draco s'affaissa.

"Je crois," dit lentement Minerva McGonagall, "que je devrais donner tout de suite les lettres d'Albus à M. Potter.
"""
# In big quotes containing many sentences, it often will mess up and include the first or last quote. I address this by checking if there's exactly one quote in the sentence and removing it if so. 
# the ["«A-ZÉÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ] part of the regex is responsible for determining if a character is uppercase. I use this to try and check for starts of sentences. But maybe this is wrong-headed because it also would detect proper nouns. It remains to be seen how much of a problem this is. 

def do_analysis():
    print("Analyzing source files...")
    source_paths = ["../books/hp", "../books/inner_french_podcast", "../books/hprat", "../books/le_petit_prince", '../books/le_petit_nicolas']
    source_files = [Path(join(p, f)) for p in source_paths for f in listdir(p) if isfile(join(p, f))]

    collected_words = {}
    collected_sentences = {}

    for filename in source_files:
        with open(filename, "r", encoding='utf-8') as f:
            source = tuple(filename.parts[-2:])
            for index, line in enumerate(f):
                if retain_only_characters(line).strip() == "": 
                    continue

                line = clean_line(line)
                words = line_to_words_french(line)
                for word in words:
                    collected_words[word] = collected_words.get(word, Counter())
                    collected_words[word][source] += 1
                
                if "»" in line or "»" in line or line == "":
                    # Don't want to deal with these right now
                    pass
                else:                    
                    sentences = re.findall(r'(?:["«A-ZÉÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ]).*?(?:(?:[.?!]["»]?)|-")(?=$| ["«]?[A-ZÉÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ])', line.strip())
                    sentences = [sentence.strip('– ') for sentence in sentences]
                    # sentences = [sentence.strip('"') if sentence.count('"') == 2 and sentence[0] == '"' and sentence[-1] == '"' and sentence[-2] != "-" else sentence for sentence in sentences] # sometimes sentences are wrapped in "s


                    sentence_buildup = "" # sometimes we have false-negatives where sentences end where they shouldn't, mostly in names like M. McGonagall or whatever. This detects those
                    for sentence in sentences:
                        if sentence[-2:] == "M." or sentence[-2:] == "H." or sentence[-3:] == "Dr.":
                            sentence_buildup += sentence + " "
                        else:
                            sentence = sentence_buildup + sentence
                            sentence_buildup = ""

                            sentence = sentence.strip()
                            sentence = sentence.strip('– ')
                            sentence = sentence.replace('"', "").strip() if sentence.count('"') == 1 else sentence
                            sentence = sentence.strip()
                            if sentence != "" and len(sentence.split()) > 1:
                                collected_sentences[sentence] = collected_sentences.get(sentence, {})
                                collected_sentences[sentence][source] = collected_sentences[sentence].get(source, []) + [index]

    return (collected_words, collected_sentences)


def main():
    do_analysis()   
    


if __name__ == '__main__':
    main()
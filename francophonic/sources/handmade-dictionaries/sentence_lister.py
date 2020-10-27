from os import listdir
from os.path import isfile, join
from collections import Counter
import re
import yaml
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper
from utils import *




def main():
    knownwords = get_all_known_french_words()

    allsentences = {}
    with open("work/frenchsentences.txt", encoding='utf-8') as f:
        for line in f:
            v = re.split(r" ::: ", line.strip())
            allsentences[v[0]] = v[1]

    with open("sentencedictionary.yaml", encoding='utf-8') as f:
        previous_translations_dictionary = yaml.load(f, Loader=Loader)
    previous_sentences = set([item for sublist in [[translation['sentence'] for translation in previous_translation['frenchTranslations']] for previous_translation in previous_translations_dictionary] for item in sublist])
    usable_sentences = set()
    for sentence in allsentences.keys():
        if sentence not in previous_sentences:
            words = set(line_to_words_french(sentence))
            if len(words.difference(knownwords)) == 0:
                usable_sentences.add(sentence)
    print(f"You are able to understand {len(usable_sentences) + len(previous_sentences)} sentences out of {len(allsentences)}. You have a vocabulary of {len(knownwords)} words.")
    usable_sentences = {i: allsentences[i] for i in usable_sentences}
    with open("work/usable_sentences.txt", "w", encoding='utf-8') as f:
        f.write("\n".join([f"{sentence.strip()} ::: {source.strip()}" for (sentence, source) in usable_sentences.items()]))


    
if __name__ == "__main__":
    main() 

"""
from collections import namedtuple

import spacy
from spacy import displacy
from processor.utils import *

sentences = get_translations()['french_to_english']
word_dict = get_word_dictionary()
useful_word_dict = make_useful_dictionary(word_dict)

nlp_en = spacy.load("en_core_web_lg")
nlp_fr = spacy.load("fr_core_news_lg")


Sentence = namedtuple('Sentence', ['fr', 'en'])
Words = namedtuple('Words', ['fr', 'en'])

def run():
    firstPair = [(k, v) for k, v in sentences.items() if '"' not in k and '-' not in k][0]
    sent = Sentence(fr=firstPair[0], en=firstPair[1]['google'][0])
    words = Words(fr=line_to_words_french(sent.fr), en=line_to_words_english(sent.en))
    print(f"{len(words.fr)} - {sent.fr} - {' '.join(words.fr)}")
    print(f"{len(words.en)} - {sent.en} - {' '.join(words.en)}")
    print()


    # doc_en = nlp_en(sent.en)
    # displacy.serve(doc_en, style="dep")

    # doc_fr = nlp_fr(sent.fr)
    # displacy.serve(doc_fr, style="dep")


    used_indices = []
    output = []

    for wordf in words.fr:
        break
        translations = [translation for definition in useful_word_dict['french'][wordf]['definitions'] for translation in definition.get('translations', [wordf])]
        print(f"{wordf}: {translations}")
run()
"""

"""
from collections import namedtuple
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper

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

def run(i=0):
    firstPair = [(k, v) for k, v in sentences.items() if True or ('"' not in k and '-' not in k)][i]
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


    print("Tokens (french)")
    doc_fr = nlp_fr(sent.fr)
    for token in doc_fr:
        print(f"{token.text} ({token.norm_}), {token.pos_}, {token.dep_}, {token.idx}, \"{token.whitespace_}\"")
    tokens_fr = [{'text': token.text, 'norm': token.norm_, 'pos': token.pos_, "dep": token.dep_, "idx": token.idx, "trailing_whitespace": token.whitespace_} for token in doc_fr]
    print()

    
    print("Tokens (english)")
    doc_en = nlp_en(sent.en)
    for token in doc_en:
        print(f"{token.text} ({token.norm_}), {token.pos_}, {token.dep_}, {token.idx}, \"{token.whitespace_}\"")
    tokens_en = [{'text': token.text, 'norm': token.norm_, 'pos': token.pos_, "dep": token.dep_, "idx": token.idx, "trailing_whitespace": token.whitespace_} for token in doc_en]
    print()


    yam = {sent.fr: {'tokens_fr': tokens_fr, 'tokens_en': tokens_en}}
    return yam
data = run()
dump = yaml.dump(data, Dumper=Dumper, allow_unicode=True)
print(dump)
"""

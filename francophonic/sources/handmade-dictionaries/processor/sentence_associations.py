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

def run(i=0):
    firstPair = [(k, v) for k, v in sentences.items() if False or ('"' not in k and '-' not in k)][i]
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

    doc = nlp_fr(sent.fr)

    print("Tokens")
    for token in doc:
        print(f"{token.text} ({token.norm_}), {token.pos_}, {token.dep_}, {token.idx}, {[child for child in token.children]}")
    print()

    print("Noun chunks")
    for chunk in doc.noun_chunks:
        print(f"{chunk.text}, {chunk.root.text}, {chunk.root.dep_}, {chunk.root.head.text}")
    print()


    doc = nlp_en("Autonomous cars shift insurance liability toward automobile manufacturers")
    for token in doc:
        print(token.text, token.dep_, token.head.text, token.head.pos_,
                [child for child in token.children])

    for wordf in words.fr:
        break
        translations = [translation for definition in useful_word_dict['french'][wordf]['definitions'] for translation in definition.get('translations', [wordf])]
        print(f"{wordf}: {translations}")
run()
"""

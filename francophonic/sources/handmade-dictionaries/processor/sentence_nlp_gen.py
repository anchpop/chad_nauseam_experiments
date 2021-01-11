from collections import namedtuple
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper

import spacy
from spacy import displacy

import safer

import processor.sources_analysis
from processor.utils import *

sentences = get_translations()['french_to_english']
word_dict = get_word_dictionary()
useful_word_dict = make_useful_dictionary(word_dict)


Sentence = namedtuple('Sentence', ['fr', 'en'])
Words = namedtuple('Words', ['fr', 'en'])


def get_nlp_info(nlp_en, nlp_fr, pair, analysis = None):
    if analysis == None:
        analysis = processor.sources_analysis.do_analysis()

    sent = Sentence(fr=pair[0], en=set([sentence for source, sentences in pair[1].items() for sentence in sentences]))
    words = Words(fr=line_to_words_french(sent.fr), en=[line_to_words_english(sent_en) for sent_en in sent.en])
    # print(f"{len(words.fr)} - {sent.fr} - {' '.join(words.fr)}")
    # print(f"{len(words.en)} - {sent.en} - {' '.join(words.en)}")
    # print()

    # doc_en = nlp_en(sent.en)
    # displacy.serve(doc_en, style="dep")

    # doc_fr = nlp_fr(sent.fr)
    # displacy.serve(doc_fr, style="dep")

    used_indices = []
    output = []

    #print("Tokens (french)")
    doc_fr = nlp_fr(sent.fr)
    for token in doc_fr:
        pass#print(f"{token.text} ({token.norm_}), {token.pos_}, {token.dep_}, {token.idx}, \"{token.whitespace_}\"")
    tokens_fr = [{'text': token.text, 'norm': token.norm_, 'pos': token.pos_, "dep": token.dep_, "idx": token.idx, "trailing_whitespace": token.whitespace_} for token in doc_fr]
    #print()

    #print("Tokens (english)")
    tokens_en = {}
    for sent_en in sent.en:
        doc_en = nlp_en(sent_en)
        for token in doc_en:
            pass#print(f"{token.text} ({token.norm_}), {token.pos_}, {token.dep_}, {token.idx}, \"{token.whitespace_}\"")
        tokens_en[sent_en] = [{'text': token.text, 'norm': token.norm_, 'pos': token.pos_, "dep": token.dep_,
                               "idx": token.idx, "trailing_whitespace": token.whitespace_} for token in doc_en]
    #print()

    yam = {sent.fr: {'tokens_fr': tokens_fr, 'tokens_en': tokens_en}}
    return yam


def main():
    analysis = processor.sources_analysis.do_analysis()

    nlp_en = spacy.load("en_core_web_lg")
    nlp_fr = spacy.load("fr_core_news_lg")

    pairs = [(k, v) for k, v in sentences.items() if True or ('"' not in k and '-' not in k)]

    # pairs.sort(key=lambda sentence: rate_french_sentence_easiness(sentence[0], analysis), reverse=True)
    pairs.sort(key=lambda sentence: rate_french_sentence_reading_level(sentence[0], analysis), reverse=True)

    data = {k: v for pair in pairs[:50] for k, v in get_nlp_info(nlp_en, nlp_fr, pair, analysis).items()}

    dump = yaml.dump(data, Dumper=Dumper, allow_unicode=True)
    with safer.open("work/nlp_sentences.yaml", "w", encoding='utf-8') as f:
        f.write(dump)


if __name__ == "__main__":
    main()

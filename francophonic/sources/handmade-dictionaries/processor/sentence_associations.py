"""
from processor.utils import *

sentences = get_translations()['french_to_english']
word_dict = get_word_dictionary()
useful_word_dict = make_useful_dictionary(word_dict)


def run():
    wordsf, wordse = (lambda x: (line_to_words_french(x[0]), line_to_words_english(x[1]['google'][0])))(list(sentences.items())[0])
    used_indices = []
    output = []
    print(" ".join(wordsf))
    print(" ".join(wordse))
    for wordf in wordsf:
        translations = [translation for definition in useful_word_dict['french'][wordf]['definitions'] for translation in definition.get('translations', [wordf])]
        print(f"{wordf}: {translations}")
"""

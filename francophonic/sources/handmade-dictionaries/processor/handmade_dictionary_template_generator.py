import processor.sources_analysis


from os import listdir
from os.path import isfile, join
from collections import Counter
import re
import yaml
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper
from processor.utils import *

def main(analysis = None):
    if isfile("handmade_dictionary.yaml"):
        print("can't create handmade_dictionary.yaml, it already exists!")
        return

    if analysis == None:
        analysis = processor.sources_analysis.do_analysis()
    (collected_words, collected_sentences) = analysis

    instructions = """
When adding verbs, use the `get_conjugations.py` script to easily generate the YAML required (this is very time-consuming to do by hand).
"""

    known_words = get_all_known_french_words()
    unknown_words = collected_words.keys() - known_words
    unknown_words = sorted(list(unknown_words), key=(lambda w: -sum(collected_words[w].values())))


    with open("handmade_dictionary.yaml", "w", encoding='utf-8') as f:
        template = {word: [{'display': word, 'gender': '', 'pos': '', 'translations': ['']}] for word in unknown_words[:4]}
        data = yaml.dump(template, Dumper=Dumper, allow_unicode=True)
        f.write("# " + "\n# ".join(instructions.split("\n")) + "\n\n")
        f.write(data)

if __name__ == "__main__":
    main() 

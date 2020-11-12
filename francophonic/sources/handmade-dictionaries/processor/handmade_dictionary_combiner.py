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
import uuid

import safer


def main(analysis):
    if not isfile("handmade_dictionary.yaml"):
        print("No 'handmade_dictionary.yaml', so nothing to combine. Run the template generator to create a template then fill it in to add new words to the dictionary. ")
        return True

    current_dictionary = get_word_dictionary()


    with safer.open("handmade_dictionary.yaml", encoding='utf-8') as f:
        new_dictionary = yaml.load(f, Loader=Loader)
        for word, definitions in new_dictionary.items():
            if word in current_dictionary["french"]:
                print(f"the word {word} is already in the dictionary, aborting")
                return
            if definitions == []:
                continue
            for definition in definitions:
                if 'notaword' not in definition:
                    if definition.get('gender', '') == '':
                        definition['gender'] = "NA"
                    if definition.get('gender', '') not in ['masc', 'fem', 'both'] and definition.get('pos', '') == "noun":
                        print(f"in a definition for the noun {word}, you don't have a valid gender (either 'masc', 'fem', 'both')!")
                    if definition.get('display', '') == '':
                        print(f"in a definition for the word {word}, you are missing 'display'!")
                        return
                    if definition.get('abbreviation', '') == '':
                        if definition.get('pos', '') == '':
                            print(f"in a definition for the word {word}, you are missing 'pos'!")
                            return
                        if definition["pos"] == "verb" and definition.get("conjugations_french", '') in ['', []]:
                            print(f"in a definition for the verb {word}, you are missing french conjugations! they're required since the word is a verb")
                            return
                        if definition["pos"] == "verb" and definition.get("conjugations_english", '') in ['', []]:
                            print(f"in a definition for the verb {word}, you are missing english conjugations! they're required since the word is a verb")
                            return
                    if definition.get('translations', '') == '':
                        print(f"in a definition for the word {word}, you are missing 'translations'!")
                        return
                    definition["translations"] = [x.strip() for x in definition["translations"] if x.strip() != '']
                    if definition["translations"] == []:
                        print(f"in a definition for the word {word}, you did not write any translations!")
                        return
                    if definition['pos'] == "verb":
                        if definition.get('modal_in_english', None) is None:
                            definition['modal_in_english'] = input(f"Is the verb '{definition['display']}' modal in english? ").lower()[0] == "y"
                else:
                    break

            current_dictionary["french"][word] = {"definitions": definitions, 'uuid': str(uuid.uuid4())}
            
    with safer.open("worddictionary.yaml", "w", encoding='utf-8') as f:
        data = yaml.dump(current_dictionary, Dumper=Dumper, allow_unicode=True)
        f.write(data)
        numelements = len(current_dictionary["french"])
        print(f"dictionary expanded to have {numelements} elements")

    return True

if __name__ == "__main__":
    main(processor.sources_analysis.do_analysis()) 

from os import listdir
from os.path import isfile, join
from collections import Counter
import re
import yaml
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper




def main():
    if not isfile("handmade_dictionary.yaml"):
        print("No 'handmade_dictionary.yaml', so nothing to combine. Run the template generator to create a template then fill it in to add new words to the dictionary. ")
        return True

    with open("worddictionary.yaml", encoding='utf-8') as f:
        current_dictionary = yaml.load(f, Loader=Loader)

    allwords = {}
    with open("work/frenchwords.txt", encoding='utf-8') as f:
        for line in f:
            v = re.split(r" ::: ", line)
            allwords[v[0]] = int(v[1])

    with open("handmade_dictionary.yaml", encoding='utf-8') as f:
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
                    if definition.get('display', '') == '':
                        print(f"in a definition for the word {word}, you are missing 'display'!")
                        return
                    if definition.get('abbreviation', '') == '':
                        if definition.get('pos', '') == '':
                            print(f"in a definition for the word {word}, you are missing 'pos'!")
                            return
                        if definition["pos"] == "verb" and definition.get("infinitive", '') == '':
                            print(f"in a definition for the word {word}, you are missing an infinitive! It's required since the word is a verb")
                            return
                        if definition["pos"] == "verb" and definition.get("conjugations", '') in ['', []] and definition['infinitive'] != definition['display']:
                            print(f"in a definition for the word {word}, you are missing conjugations! It's required since the word is a verb")
                            return
                    if definition.get('translations', '') == '':
                        print(f"in a definition for the word {word}, you are missing 'translations'!")
                        return
                    definition["translations"] = [x.strip() for x in definition["translations"] if x.strip() != '']
                    if definition["translations"] == []:
                        print(f"in a definition for the word {word}, you did not write any translations!")
                        return
                else:
                    break

            current_dictionary["french"][word] = {"occurrences": allwords.get(word, 0), "definitions": definitions}
            
    with open("worddictionary.yaml", "w", encoding='utf-8') as f:
        data = yaml.dump(current_dictionary, Dumper=Dumper, allow_unicode=True)
        f.write(data)
        numelements = len(current_dictionary["french"])
        print(f"dictionary expanded to have {numelements} elements")

    return True

if __name__ == "__main__":
    main() 

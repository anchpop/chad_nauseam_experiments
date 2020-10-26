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

    instructions = """
When adding verbs, make sure you put in the conjugations for passéSimple, imparfait, présent, passéComposé, all as seperate words. 
And don't forget the plain infinitive!
As an example:
  murmuré:
  - conjugations:
      passéComposé:
      - j'ai
      - tu as
      - il a
      - elle a
      - nous avons
      - vous avez
      - ils ont
      - elles ont
    display: murmuré
    gender: NA
    infinitive: murmurer
    pos: verb
    translations:
      - whisper
  murmurer:
  - display: murmurer
    gender: NA
    infinitive: murmurer
    pos: verb
    translations:
    - to whisper
"""


    with open("worddictionary.yaml", encoding='utf-8') as f:
        current_dictionary = yaml.load(f, Loader=Loader)

    allwords = {}
    with open("work/frenchwords.txt", encoding='utf-8') as f:
        for line in f:
            v = re.split(r" ::: ", line)
            allwords[v[0]] = int(v[1])
    allwords = Counter(allwords)

    if isfile("handmade_dictionary.yaml"):
        print("can't create handmade_dictionary.yaml, it already exists!")
        return

    allunknownWords = {}
    for k, v in allwords.items():
        if k not in current_dictionary['french']:
            allunknownWords[k] = v
    allunknownWords = Counter(allunknownWords)

    with open("handmade_dictionary.yaml", "w", encoding='utf-8') as f:
        template = {word: [{'display': word, 'gender': '', 'pos': '', 'translations': ['']}] for (word, _) in allunknownWords.most_common(4)}
        data = yaml.dump(template, Dumper=Dumper, allow_unicode=True)
        f.write("# " + "\n# ".join(instructions.split("\n")) + "\n\n")
        f.write(data)

if __name__ == "__main__":
    main() 

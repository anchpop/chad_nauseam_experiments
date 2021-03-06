import pprint
import time

import yaml
import requests
from bs4 import BeautifulSoup

from functools import lru_cache
import pyperclip


def get_reverso_url(verb, language):
    return f"https://conjugator.reverso.net/conjugation-{language}-verb-{verb}.html"


def grab_conjugation_soup_french(verbf):
    time.sleep(10)
    urlf = get_reverso_url(verbf, "french")
    print(f"requesting {urlf}")
    rf = requests.get(urlf)
    soup_french = BeautifulSoup(rf.text, 'html.parser')

    return soup_french


@lru_cache(maxsize=None)
def grab_conjugation_soup_english(verbe):
    time.sleep(10)
    urle = get_reverso_url(verbe.split("to")[1].strip(), "english")
    print(f"requesting {urle}")
    re = requests.get(urle)
    soup_english = BeautifulSoup(re.text, 'html.parser')
    return soup_english


@lru_cache(maxsize=None)
def parse_conjugations(soup, verb):
    contents = {}
    result_block = soup.find("div", {"class": "result-block-api"})
    if result_block == None:
        print(f"No result block found in soup for {verb}")
        return (None, None)

    if len(verb.split(" ")) in [3, 4]:
        toAdd = " " + " ".join(verb.split(" ")[2:])
        if input(f"is {toAdd} the appropriate suffix? ").lower()[0] != "y":
            toAdd = input("please enter the appropriate suffix: ").strip().lower()
    else:
        toAdd = ""

    word_wrap_rows = result_block.findAll("div", {"class": "word-wrap-row"})
    for rowIndex, row in enumerate(word_wrap_rows):
        print(f"Analyzing row {rowIndex}")
        for child in row.findAll("div", {}, False):
            if "word-wrap-title" in child['class']:
                current_mode = child.h4.contents[0].strip().lower()
                print(f"    Mood: {current_mode}")
                # print(current_mode)
            elif "wrap-three-col" in child['class']:
                titles = child.findAll("div", {'class': 'word-wrap-title'}, False)
                conjugations = child.findAll("div", {'class': 'blue-box-wrap'}, False)
                if len(titles) == 1:
                    current_mode = titles[0].h4.contents[0].strip().lower()
                    print(f"    Mood: {current_mode}")
                    # print(current_mode)
                if len(conjugations) == 1:
                    info = {}
                    type_of_conjugation = conjugations[0].p.contents[0].strip().lower() if conjugations[0].p else ""
                    cons = conjugations[0].ul.findAll("li")
                    print(f"    current_mode={current_mode}, type_of_conjugation={type_of_conjugation}")
                    for con in cons:
                        i = [i.contents[0].strip().lower() for i in con.findAll("i")]
                        print(f"        len({i}) = {len(i)}")
                        if len(i) == 1 and current_mode == 'infinitif':
                            infinitive = i[0] + toAdd
                        elif len(i) == 1 and current_mode == 'imperative':
                            info[""] = info.get("", i[0]) + toAdd
                        elif len(i) == 2 and current_mode == 'infinitive':
                            infinitive = i[1] + toAdd
                        elif len(i) == 1 and current_mode == 'participle' and type_of_conjugation in ['past', 'present']:
                            info[''] = i[0] + toAdd
                        elif len(i) == 1 and current_mode == 'participe' and type_of_conjugation in ['présent', 'passé']:
                            info[''] = i[0] + toAdd
                        elif len(i) == 1 and current_mode == 'impératif' and type_of_conjugation in ['présent', 'passé']:
                            info[''] = i[0] + toAdd
                        elif len(i) >= 2:
                            info[" - ".join(i[:-1])] = i[-1] + toAdd
                        else:
                            raise Exception(f"Unexpected case - current_mode = {current_mode}, type_of_conjugation = {type_of_conjugation}, conjugation = {con}")

                        # print("    " + type_of_conjugation)
                        if len(info) > 0:
                            contents[current_mode] = {**contents.get(current_mode, {}), type_of_conjugation: info}
                    if current_mode == "imperative":
                        current_mode = "participle"
    return (infinitive, contents)


def get_conjugations(verbf, verbes, trans):
    soupf = grab_conjugation_soup_french(verbf)
    infinitivef, contentsf = parse_conjugations(soupf, verbf)
    english = [(verbe, *parse_conjugations(grab_conjugation_soup_english(verbe), verbe)) for verbe in verbes]

    model = soupf.find("span", {"tooltip": "See more info on the conjugation model and verbs which conjugate the same way."}).a.contents[0].strip()
    auxiliary = soupf.find("span", {"tooltip": "The auxiliary verb used in the conjugation of the compounds forms."}).a.contents[0].strip()
    forms = [form.contents[0].strip() for form in soupf.find("span", {"id": 'ch_lblAutreForm'}).findAll("a")]

    output = {infinitivef: [{'display': infinitivef, 'pos': 'verb', 'conjugations_french': contentsf, 'conjugations_english': {verbe: contentse for verbe,
                                                                                                                               infinitivee, contentse in english}, 'translations': verbes, 'model': model, 'auxiliary': auxiliary, 'other_forms': forms, 'transitive': trans}]}
    return output


def main():
    verb = input("Verb? ")
    eng = [e.strip().lower() for e in input("infinitive english translation? ").split(",")]
    i = input("Transitive? ")
    trans = True if i[0].lower() == "y" else ('both' if i[0].lower() == "b" else False)

    output = get_conjugations(verb, eng, trans)

    pp = pprint.PrettyPrinter(indent=4)
    # pp.pprint(output)
    dump = yaml.dump(output, allow_unicode=True)
    print(dump)
    pyperclip.copy(dump)


if __name__ == "__main__":
    main()

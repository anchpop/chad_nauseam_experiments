import pprint
import yaml

import requests
from bs4 import BeautifulSoup


def get_reverso_url(verb):
    return f"https://conjugator.reverso.net/conjugation-french-verb-{verb}.html"


def grab_conjugation_soup(verb):
    r = requests.get(get_reverso_url(verb))
    soup = BeautifulSoup(r.text, 'html.parser')
    return soup


def main():
    verb = input("Verb? ")

    contents = {}

    current_mode = ""

    """with open("C:/Users/hyper/Desktop/Untitled-1.html", "r", encoding="utf-8") as f:
        text = f.read()
        soup = BeautifulSoup(text, 'html.parser')"""
    
    soup = grab_conjugation_soup(verb)

    result_block = soup.findAll("div", {"class": "result-block-api"})[0]
    word_wrap_rows = result_block.findAll("div", {"class": "word-wrap-row"})
    for row in word_wrap_rows:
        for child in row.findAll("div", {}, False):
            if child['class'] == ["word-wrap-title"]:
                current_mode = child.h4.contents[0].strip().lower()
                # print(current_mode)
            elif child['class'] == ["wrap-three-col"]:
                titles = child.findAll("div", {'class': 'word-wrap-title'}, False)
                conjugations = child.findAll("div", {'class': 'blue-box-wrap'}, False)
                if len(titles) == 1:
                    current_mode = titles[0].h4.contents[0].strip().lower()
                    # print(current_mode)
                if len(conjugations) == 1:
                    info = {}
                    type_of_conjugation = conjugations[0].p.contents[0].strip().lower()
                    cons = conjugations[0].ul.findAll("li")
                    for con in cons:
                        i = [i.contents[0].strip().lower() for i in con.findAll("i")]
                        if len(i) == 1 and current_mode == 'infinitif':
                            infinitive = i[0]
                        elif len(i) >= 2:
                            info[" - ".join(i[:-1])] = i[-1]
                    
                    # print("    " + type_of_conjugation)
                    if len(info) > 0:
                        contents[current_mode] = contents.get(current_mode, {}) | {type_of_conjugation: info}

    model = soup.find("span", {"tooltip": "See more info on the conjugation model and verbs which conjugate the same way."}).a.contents[0].strip()
    auxiliary = soup.find("span", {"tooltip": "The auxiliary verb used in the conjugation of the compounds forms."}).a.contents[0].strip()
    
    pp = pprint.PrettyPrinter(indent=4)

    output = {infinitive: [{'display': infinitive, 'pos': 'verb', 'conjugations': contents, 'translations': [''], 'model': model, 'auxiliary': auxiliary}]}
    print(yaml.dump(output, allow_unicode=True))



main()

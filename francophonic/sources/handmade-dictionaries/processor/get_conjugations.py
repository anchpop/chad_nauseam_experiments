import pprint
import time

import yaml
import requests
from bs4 import BeautifulSoup


def get_reverso_url(verb, language):
    return f"https://conjugator.reverso.net/conjugation-{language}-verb-{verb}.html"


def grab_conjugation_soup(verbf, verbe):
    time.sleep(10)
    rf = requests.get(get_reverso_url(verbf, "french"))
    soup_french = BeautifulSoup(rf.text, 'html.parser')
    
    time.sleep(10)
    re = requests.get(get_reverso_url(verbe[0].split("to")[-1].strip(), "english"))
    soup_english = BeautifulSoup(re.text, 'html.parser')

    return (soup_french, soup_english)

def parse_conjugations(soup):
    contents = {}
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
                    type_of_conjugation = conjugations[0].p.contents[0].strip().lower() if conjugations[0].p else ""
                    cons = conjugations[0].ul.findAll("li")
                    print(f"current_mode={current_mode}, type_of_conjugation={type_of_conjugation}")
                    for con in cons:
                        i = [i.contents[0].strip().lower() for i in con.findAll("i")]
                        if len(i) == 1 and current_mode == 'infinitif' :
                            infinitive = i[0] 
                        elif len(i) == 1 and current_mode == 'imperative':
                            info[""] = info.get("", i[0])
                        elif len(i) == 2 and current_mode == 'infinitive':
                            infinitive = i[1]
                        elif len(i) == 1 and current_mode == 'participle' and type_of_conjugation in ['past', 'present']:
                            info[''] = i[0] 
                        elif len(i) >= 2:
                            info[" - ".join(i[:-1])] = i[-1]
                        else:
                            raise Exception(f"Unexpected case - current_mode = {current_mode}, type_of_conjugation = {type_of_conjugation}, conjugation = {con}")
                        
                        # print("    " + type_of_conjugation)
                        if len(info) > 0:
                            contents[current_mode] = {**contents.get(current_mode, {}), type_of_conjugation: info}
                    if current_mode == "imperative":
                        current_mode = "participle"
    return (infinitive, contents)


def get_conjugations(verbf, verbe, trans):
    current_mode = ""

    """with open("C:/Users/hyper/Desktop/Untitled-1.html", "r", encoding="utf-8") as f:
        text = f.read()
        soup = BeautifulSoup(text, 'html.parser')"""
        
    
    (soupf, soupe) = grab_conjugation_soup(verbf, verbe)

    infinitivef, contentsf = parse_conjugations(soupf)
    infinitivee, contentse = parse_conjugations(soupe)

    model = soup.find("span", {"tooltip": "See more info on the conjugation model and verbs which conjugate the same way."}).a.contents[0].strip()
    auxiliary = soup.find("span", {"tooltip": "The auxiliary verb used in the conjugation of the compounds forms."}).a.contents[0].strip()
    forms = [form.contents[0].strip() for form in soup.find("span", {"id": 'ch_lblAutreForm'}).findAll("a")]
    
    output = {infinitive: [{'display': infinitive, 'pos': 'verb', 'conjugations_french': contentsf, 'conjugations_english': {"to " + infinitivee: contentse}, 'translations': verbe, 'model': model, 'auxiliary': auxiliary, 'other_forms': forms, 'transitive': trans}]}

def main():
    verb = input("Verb? ")
    eng = [e.strip().lower() for e in input("infinitive english translation? ").split(",")]
    trans = input("Transitive? ")[0].lower() == "y"
    
    output = get_conjugations(verb, eng, trans)



    pp = pprint.PrettyPrinter(indent=4)
    #pp.pprint(output)
    print(yaml.dump(output, allow_unicode=True))




if __name__ == "__main__":
    main()

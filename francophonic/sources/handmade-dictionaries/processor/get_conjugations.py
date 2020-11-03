import pprint
import time

import yaml
import requests
from bs4 import BeautifulSoup


def get_reverso_url(verb, language):
    return f"https://conjugator.reverso.net/conjugation-{language}-verb-{verb}.html"


def grab_conjugation_soup(verbf, verbe):
    time.sleep(10)
    urlf = get_reverso_url(verbf, "french")
    print(f"requesting {urlf}")
    rf = requests.get(urlf)
    soup_french = BeautifulSoup(rf.text, 'html.parser')
    
    time.sleep(10)
    urle = get_reverso_url(verbe.split("to")[-1].strip(), "english")
    print(f"requesting {urle}")
    re = requests.get(urle)
    soup_english = BeautifulSoup(re.text, 'html.parser')

    return (soup_french, soup_english)

def parse_conjugations(soup, verb):
    contents = {}
    result_block = soup.find("div", {"class": "result-block-api"})
    if result_block == None:
        print(f"No result block found in soup for {verb}")
        return (None, None)

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
                        elif len(i) == 1 and current_mode == 'participe' and type_of_conjugation == 'présent':
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
        
    
    (soupf, soupe) = grab_conjugation_soup(verbf, verbe[0])

    infinitivef, contentsf = parse_conjugations(soupf, verbf)
    infinitivee, contentse = parse_conjugations(soupe, verbe[0])

    model = soupf.find("span", {"tooltip": "See more info on the conjugation model and verbs which conjugate the same way."}).a.contents[0].strip()
    auxiliary = soupf.find("span", {"tooltip": "The auxiliary verb used in the conjugation of the compounds forms."}).a.contents[0].strip()
    forms = [form.contents[0].strip() for form in soupf.find("span", {"id": 'ch_lblAutreForm'}).findAll("a")]
    
    output = {infinitivef: [{'display': infinitivef, 'pos': 'verb', 'conjugations_french': contentsf, 'conjugations_english': {verbe[0]: contentse if contentse is not None else {}}, 'translations': verbe, 'model': model, 'auxiliary': auxiliary, 'other_forms': forms, 'transitive': trans}]}
    return output

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

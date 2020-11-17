from os import listdir
from os.path import isfile, join
from collections import Counter
import re
import yaml
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper

import safer
import uuid


def line_to_words(line, contractions, whole_word_basis):
    def word_splitter(w):
        word_split = w.strip("'").split("'") if not whole_word_basis else [w]
        if len([part for part in word_split[:-1] if part in frenchContractions]) + 1 == len(word_split):
            new_words = []
            for index, word in enumerate(word_split):
                if word != "-":
                    if word in contractions.keys():
                        new_words.extend(contractions[word][0]) # Just stick with the first contraction for now
                    else: 
                        new_words.append(word)
            return new_words
        return [w]

    words = line.split()
    words = [word_splitter(re.sub('[,!?.0-9()&/:;…«»]', '', word.replace("’", "'")).lower()) for word in words]
    words = [item for sublist in words for item in sublist]
    words = [word for word in words if word not in ['', '–', ' ']]
    return words


def clean_line(line):
    line = line.replace('’', "'")
    line = line.strip()
    #line = line.strip("“–«» ")
    #line = line.strip()
    line = re.sub('\[.*?]', '', line)  # get rid of the timestamps in bits like "[00:00:12] Bonjour à tous ou bonsoir"
    line = " ".join(line.split())
    line = re.sub('^[^ ]*? : ', '', line)
    # line = line.strip("“–«» ")

    # if ":" in line:
    #    return ""
    return line.strip()


def retain_only_characters(line):
    line = line.strip()
    line = re.sub(r"[^A-ZÉÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ a-zàâäèéêëîïôœùûüÿç'-]", "", line.replace('’', "'")).strip()
    return line


def line_to_words_french(line):
    return line_to_words(retain_only_characters(line), frenchContractions, whole_word_basis=False)


def line_to_words_english(line):
    return line_to_words(retain_only_characters(line), 
        englishContractions, whole_word_basis=True)

def get_translations():
    with safer.open("translations.yaml", encoding='utf-8') as f:
        translations = yaml.load(f, Loader=Loader)
    return translations


def get_word_dictionary():
    with safer.open("worddictionary.yaml", encoding='utf-8') as f:
        word_dictionary = yaml.load(f, Loader=Loader)
    return word_dictionary


def get_all_known_french_words():
    word_dictionary = get_word_dictionary()
    words = set([])
    for word, entry in word_dictionary['french'].items():
        words.add(word)
        for definition in entry['definitions']:
            for _, forms in definition.get('conjugations_french', {}).items():
                for form, persons in forms.items():
                    words.update(set(persons.values()))
    return words


def get_sentence_analysis(analysis):
    (_, collected_sentences, _) = analysis
    known_words = get_all_known_french_words()
    understandable_sentences = set()
    ununderstandable_sentences = set()
    for i, sentence in enumerate(collected_sentences):
        if all([word in known_words for word in line_to_words_french(sentence)]):
            understandable_sentences.add(sentence)
        else:
            # if (i < 100): print(line_to_words_french(sentence))
            ununderstandable_sentences.add(sentence)
    return understandable_sentences, ununderstandable_sentences


def get_understandable_sentences(analysis):
    return get_sentence_analysis(analysis)[0]


def flatten(l): return [item for sublist in l for item in sublist]


def flatmap(l, f):
    return flatten([f(e) for e in l])


def flatdmap(d, f):
    flatten([f(k, v) for k, v in d.items])


def french_conj_description_to_english(french_word, french_mode, french_form, french_person, conjugations_english, english_infinitive):
    # print(f"Finding an english conjugation for the word {french_word} ({french_mode} {french_form} {french_person})")
    if french_mode == "infinitif":
        return english_infinitive

    modes = {
        'indicatif': ('indicative', {
            'présent': 'present',
            'imparfait': 'past continous',
            'futur': 'future',  # this is a guess
            'passé simple': 'preterite',
            'passé composé': 'preterite',
            'plus-que-parfait': 'past perfect',
            'passé antérieur': 'past perfect continuous',  # only used in literature, as far as I can tell has no direct analogue in english
            'futur antérieur': 'future perfect continuous',
        }),
        'subjonctif': ('indicative', {  # I don't think english has a subjunctive mood, let's just map these to english as if they were indicative
            'présent': 'present',
            'imparfait': 'past continous',
            'plus-que-parfait': 'past perfect',
            'passé': 'preterite',
            # I also don't think english has a conditional mood, you just put "would" before the verb. That's reflected in the person, we'll have to get that later
        }), 'conditionnel': ('indicative', {
            'présent': 'present',
            'passé première forme': 'present perfect',
            'passé deuxième forme': 'present perfect',  # Only ever used in excessively fancy writing
        }), 'participe': ('participle', {
            'présent': 'present',
            'passé composé': 'past',
            'passé': 'past',
        }), 'impératif': ('imperative', {  # These are easy - english has no imperative tenses
            'présent': '',
            'passé': '',
        }), 'infinitif': ('infinitive', {
            'présent': '',
            'passé': '',
        })}

    persons = {
        'je': 'I',
        'j\'': 'I',
        'tu': 'you',
        'il/elle': 'he/she/it',
        'elle': 'he/she/it',
        'il': 'he/she/it',
        'nous': 'we',
        'vous': 'you',
        'ils/elles': 'they',
        'ils': 'they',
        'elles': 'they',


        'ayant': '',
        'étant': '',

        'aie': '',
        'ayons': '',
        'ayez': '',
        'sois': '',
        'soyons': '',
        'soyez': '',


        'masc.sg.:': '',
        'masc.pl.:': '',
        'fém.sg.:': '',
        'fém.pl.:': '',

        '': '',
    }

    english_mode, tenses = modes[french_mode]
    english_tense = tenses[french_form]
    english_person = None
    for i in french_person:
        if i in persons:
            english_person = persons[i]
            break

    if english_person == None:
        raise Exception(f"For french word '{french_word}', I couldn't find any of '{french_person}' in the dictionary mapping french persons to english person")

    # for error detection
    if conjugations_english.get(english_mode, None) == None:
        raise Exception(f"The english conjugation in the mood {english_mode} for the french word {french_word} was not found in the dictionary {conjugations_english}")
    if conjugations_english[english_mode].get(english_tense, None) == None:
        raise Exception(
            f"The english conjugation in the tense {english_tense} for the french word {french_word} was not found in the dictionary {conjugations_english[english_mode]}")
    #

    possible_persons = {tuple(k.split(' - ')): v for k, v in conjugations_english[english_mode][english_tense].items()}
    if len(possible_persons) == 1:
        return list(possible_persons.values())[0]
    for possible_person in possible_persons:
        if english_person.lower() in list(possible_person):
            return possible_persons[possible_person]
    else:
        raise Exception(
            f"Couldn't find an english conjugation for the word '{french_word}'. {french_mode} ({english_mode}) - {french_form} ({english_tense}) {french_person} ({english_person})). Possible persons were {list(possible_persons.keys())}")


def french_description_to_english_modal(french_word, french_mode, french_form, french_person, conjugations_english, english_infinitive):
    if french_mode == "infinitif":
        return english_infinitive

    if french_form in ['présent']:
        return conjugations_english['present']

    if french_form in ['imparfait', 'passé simple', 'passé composé', 'plus-que-parfait', 'passé antérieur', 'passé première forme', 'passé deuxième forme', 'passé']:
        return conjugations_english['past']

    if french_form in ['futur', 'futur antérieur']:
        return conjugations_english['future']

    raise Exception(f"{french_word}'s {french_form} form wasn't understood ")


def make_useful_dictionary(word_dict):
    output_words = {'french': {}, 'english': {}}

    seen_uuids = set()

    for french_word, entry in word_dict['french'].items():
        if entry['uuid'] in seen_uuids:
            raise Exception(f"UUID for {french_word} already in dictionary!")
        else:
            seen_uuids.add(entry['uuid'])
        for definition in entry.get('definitions', {}):
            if definition.get('pos', None) == 'verb':
                definition['isInfinitive'] = True
            output_words['french'][french_word] = output_words['french'].get(french_word, {'definitions': [], 'occurrences': 0, 'uuid': entry['uuid']})
            output_words['french'][french_word]['definitions'] += [definition]

            if definition.get('pos', '') == 'verb':
                reversed_dict = {}
                for mode, formes in definition['conjugations_french'].items():
                    for forme, persons in formes.items():
                        for person, conjugation in persons.items():
                            reversed_dict[conjugation] = reversed_dict.get(conjugation, {
                                'uuid': uuid.uuid5(uuid.NAMESPACE_DNS, f"{french_word}.{conjugation}."),
                                'definition': {
                                    'display': conjugation,
                                    'pos': 'verb',
                                    'infinitive': french_word,
                                    'isInfinitive': False,
                                    'conjugates_for': [],
                                    'translations': set(),
                                    'gender': 'NA',
                                }
                            })
                            person = person.split(" - ")
                            reversed_dict[conjugation]['definition']['conjugates_for'].append((mode, forme, person))

                            english_infinitive = definition['translations'][0]
                            english_conjugations = definition['conjugations_english'][english_infinitive]

                            english_translation = french_conj_description_to_english(french_word, mode, forme, person, english_conjugations, english_infinitive) if not definition['modal_in_english'] else french_description_to_english_modal(
                                french_word, mode, forme, person, english_conjugations, english_infinitive)

                            reversed_dict[conjugation]['definition']['translations'].add(english_translation)
                for french_word, entry in reversed_dict.items():
                    entry['definition']['translations'] = list(entry['definition']['translations'])
                    entry['definitions'] = [entry['definition']]
                    del entry['definition']
                    for translation in definition.get('translations', []):
                        output_words['english'][translation] = output_words['english'].get(translation, []) + [french_word]

                    output_words['french'][french_word] = output_words['french'].get(french_word, {'definitions': [], 'occurrences': 0, 'uuid': str(entry['uuid'])})
                    output_words['french'][french_word]['definitions'] += entry['definitions']

            else:
                for translation in definition.get('translations', []):
                    output_words['english'][translation] = output_words['english'].get(translation, []) + [french_word]
        # if french_word[0] != 'a': break
    return output_words


frenchContractions = {
    'n':      [['ne'     ]], 
    'l':      [['le'     ]], 
    'lorsqu': [['lorsque']], 
    'j':      [['je'     ]], 
    's':      [['se'     ]], 
    'jusqu':  [['jusque' ]], 
    'quelqu': [['quelque']], 
    'm':      [['me'     ]], 
    'c':      [['ce'     ]], 
    'd':      [['de'     ]], 
    'qu':     [['que'    ]], 
    't':      [['te'     ]], 
    'm':      [['me'     ]],
}
englishContractions = {
    "aren't":    [["are"    , "not"  ]],
    "can't":     [["can"    , "not"  ]],
    "couldn't":  [["could"  , "not"  ]],
    "shouldn't": [["should" , "not"  ]],
    "wouldn't":  [["would"  , "not"  ]],
    "didn't":    [["did"    , "not"  ]],
    "doesn't":   [["does"   , "not"  ]],
    "hadn't":    [["had"    , "not"  ]],
    "hasn't":    [["has"    , "not"  ]],
    "haven't":   [["have"   , "not"  ]],
    "mightn't":  [["might"  , "not"  ]],
    "shan't":    [["shall"  , "not"  ]],
    "weren't":   [["were"   , "not"  ]],
    "won't":     [["will"   , "not"  ]],
    "isn't":     [["is"     , "not"  ]],
    "he'll":     [["he"     , "will" ]],
    "she'll":    [["she"    , "will" ]],
    "you'll":    [["you"    , "will" ]],
    "they'll":   [["they"   , "will" ]],
    "what'll":   [["what"   , "will" ]],
    "who'll":    [["who"    , "will" ]],
    "i'd":       [["i"      , "had"  ]],
    "she'd":     [["she"    , "had"  ]],
    "he'd":      [["he"     , "had"  ]],
    "they'd":    [["they"   , "had"  ]],
    "i'm":       [["I"      , 'am'   ]],
    "i've":      [['I'      , 'had'  ]],
    "we've":     [["we"     , "have" ]],
    "you've":    [["you"    , "have" ]],
    "they've":   [["they"   , "have" ]],
    "let's":     [['let'    , 'us'   ]],
    "that's":    [["that"   , "is"   ]],
    "there's":   [["there"  , "is"   ]],
    "what's":    [["what"   , "is"   ]],
    "he's":      [["he"     , "is"   ]],
    "she's":     [["she"    , "is"   ]],
    "they're":   [["they"   , "are"  ]],
    "you're":    [["you"    , "are"  ]],
    "we're":     [["we"     , "are"  ]],
    "i'd":       [["I"      , "would"], ["I", "had"]],
    "he'd":      [["he"     , "would"], ["he", "had"]],
    "they'd":    [["they"   , "would"], ["they", "had"]],
    "she'd":     [["she"    , "would"], ["she", "had"]],
}

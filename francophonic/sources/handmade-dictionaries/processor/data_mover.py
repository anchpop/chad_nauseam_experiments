import yaml
import json
import uuid

from os import listdir, environ
from os.path import isfile, join
from processor.utils import *
import processor.sources_analysis

import safer


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


def main(analysis=None):
    if analysis == None:
        analysis = processor.sources_analysis.do_analysis()

    translation_dict = get_translations()
    understandable_sentences = get_understandable_sentences(analysis)
    word_dict = get_word_dictionary()
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

    output_translations = {'english': {}, 'french': {sentence: {'english': list(
        set(flatten(translation_dict['french_to_english'][sentence].values())))} for sentence in understandable_sentences if sentence in translation_dict['french_to_english']}}

    output_word_frequencies = {word: {" - ".join(list(book)): counter for book, counter in info.items()} for word, info in analysis[0].items()}
    # output_words_frequency_sorted = sorted([word for word, _ in analysis[0].items()], key=lambda word: sum(analysis[0][word].values()))

    sent = """
export interface EnglishEntry {
  english: Array<String>;
}

export interface FrenchEntry {
  french: Array<String>;
}

export interface Translations {
  french: {[frenchSentence: string]: EnglishEntry};
  english: {[englishSentence: string]: FrenchEntry}
}


const sentences: Translations = """
    sent += json.dumps(output_translations, ensure_ascii=False)
    sent += """
export default sentences
"""
    with safer.open("../../cn_experiments/src/data/sentencedictionary.tsx", "w", encoding='utf8') as f:
        f.write(sent)

    translationsOutput = """export interface NotAWord {
  notaword: true;
  exampleSentences?: Array<{french: String, english: string}>;
}
export interface FrenchNounEntry {
  pos: "noun";
  plural?: true;
  gender: "NA" | "masc" | "fem";
  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
  see?: String;
}
export interface FrenchAdjectiveEntry {
  pos: "adjective" | "demonstrative adjective" | "possessive adjective";
  interrogative?: true;
  plural?: true;
  gender: "NA" | "masc" | "fem";
  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
  see?: String;
}
export interface FrenchAdverbEntry {
  pos: "adverb";
  gender: "NA";
  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
  see?: String;
}
export interface FrenchPropositionEntry {
  pos: "preposition";
  gender: "NA";
  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
  see?: String;
}
export interface FrenchExclamationEntry {
  pos: "exclamation"
  gender: "NA";
  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
  see?: String;
}
export interface FrenchVerbConjugationEntry {
  pos: "verb"
  gender: "NA";
  infinitive: String;
  isInfinitive: false;

  conjugates_for: Array<any>;
  
  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
  see?: String;
}
export interface FrenchVerbInfinitifEntry {
  pos: "verb"
  gender: "NA";
  isInfinitive: true;
  
  conjugations_english: any;
  conjugations_french: any;


  transitive: Boolean;
  auxiliary: String;
  model: String;
  modal_in_english: Boolean;
  other_forms?: Array<String>;

  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
  see?: String;
}
export interface FrenchAbbreviation {
  display: String;
  pos?: "preposition" | "determiner";
  abbreviation: String;
  gender: "NA" | "masc" | "fem";
  translations?: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
  plural?: Boolean;
  see?: String;
}
export interface FrenchDeterminer {
  pos: "determiner";
  gender: "NA";
  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
  see?: String;
}
export interface FrenchConjonction {
  pos: "conjonction";
  display: String;
  gender: "NA";
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
  see?: String;

}
export interface FrenchNumber {
  pos: "number";
  gender: "NA";
  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
  see?: String;
}
export interface FrenchPronoun {
  pos: "pronoun" | "relative pronoun" | "possessive pronoun" | "disjunctive pronoun" | "indirect object pronoun";
  gender: "NA" | "fem" | "masc";
  plural?: true;
  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
  see?: String;
}
export interface FrenchArticle {
  pos: "definite article" | "indefinite article" | "article";
  gender: "NA" | "fem" | "masc";
  plural?: true;
  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
  see?: String;
}

export interface FrenchWordEntry {
  definitions: Array< NotAWord | FrenchNounEntry | FrenchExclamationEntry | FrenchVerbInfinitifEntry | FrenchVerbConjugationEntry | FrenchAdverbEntry | FrenchPropositionEntry | FrenchAbbreviation | FrenchAdjectiveEntry | FrenchDeterminer | FrenchNumber | FrenchConjonction | FrenchPronoun | FrenchArticle >;
  occurrences: Number;
  uuid: String;
}

const words: {french: {[id: string] : FrenchWordEntry}, english: {[id: string] : Array<string>}} = """
    translationsOutput += json.dumps(output_words, ensure_ascii=False)
    translationsOutput += f"""
export const frenchContractions  = {frenchContractions}
export const englishContractions = {englishContractions}
export default words
"""
    with safer.open("../../cn_experiments/src/data/worddictionary.tsx", "w", encoding='utf8') as f:
        print("Writing word dictionary to cn_experiments")
        f.write(translationsOutput)

    translationsOutput = """
const frequencies = """ + json.dumps(output_word_frequencies, ensure_ascii=False) + """
export default frequencies;
"""

    with open("../../cn_experiments/src/data/freqdictionary.tsx", "w", encoding='utf8') as f:
        f.write(translationsOutput)

    vdir = "../../cn_experiments/assets/audio/french/"
    voice_name = "fr-FR-Wavenet-C"
    previous_files = set([f for f in listdir(vdir) if isfile(join(vdir, f))])
    fil = "export default {\n"
    for previous_file in previous_files:
        fil += f"  '{previous_file.split(voice_name)[0]}': require('../../assets/audio/french/{previous_file}'),\n"
    fil += "}"

    with safer.open('../../cn_experiments/src/data/sentenceAudio.tsx', "w") as f:
        print("Writing sentence audio database")
        f.write(fil)


if __name__ == "__main__":
    main()

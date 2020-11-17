from os import listdir
from os.path import isfile, join
from processor.utils import *
import processor.sources_analysis

import yaml
import json

import safer


def main(analysis=None):
    if analysis == None:
        analysis = processor.sources_analysis.do_analysis()

    translation_dict = get_translations()
    understandable_sentences = get_understandable_sentences(analysis)
    word_dict = get_word_dictionary()
    output_words = make_useful_dictionary(word_dict)

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

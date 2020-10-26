import yaml
import json
from os import listdir, environ
from os.path import isfile, join
from utils import *

def main():
  sentence_dict = get_sentence_dictionary()
  word_dict = get_word_dictionary()
  word_dict['english'] = {}

  for french_word, definitions in word_dict['french'].items():
    for definition in definitions.get('definitions', {}):
      for translation in definition.get('translations', []):
        word_dict['english'][translation] = word_dict['english'].get(translation, []) + [french_word]

  sent = """
export interface Sentence {
  sentence: String;
  words: Array<Array<String>>;
  source: String;
}

export interface TranslationSet {
  englishTranslations: Array<Sentence>;
  frenchTranslations: Array<Sentence>;
  handVerified: Boolean;
  uuid: String;
}


const sentences: Array<TranslationSet> = """
  sent += json.dumps(sentence_dict, ensure_ascii=False) 
  sent += """
export default sentences
"""
  with open("../../cn_experiments/src/data/sentencedictionary.tsx", "w", encoding='utf8') as f:
    f.write(sent)

  words = """export interface NotAWord {
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
}
export interface FrenchAdjectiveEntry {
  pos: "adjective" | "demonstrative adjective" | "possessive adjective";
  plural?: true;
  gender: "NA" | "masc" | "fem";
  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
}
export interface FrenchAdverbEntry {
  pos: "adverb";
  gender: "NA";
  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
}
export interface FrenchPropositionEntry {
  pos: "preposition";
  gender: "NA";
  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
}
export interface FrenchExclamationEntry {
  pos: "exclamation"
  gender: "NA";
  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
}
export interface FrenchVerbEntry {
  pos: "verb"
  gender: "NA";
  infinitive: String;
  transitive?: Boolean;
  display: String;
  conjugations?: {présent?: Array<String>, subjonctif?: Array<String>, passéSimple?: Array<String>, imparfait?: Array<String>, passéComposé?: Array<String>, conditionnelPrésent?: Array<String>};
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
}
export interface FrenchAbbreviation {
  display: String;
  pos?: "preposition" | "determiner";
  abbreviation: String;
  gender: "NA" | "masc" | "fem";
  translations?: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
}
export interface FrenchDeterminer {
  pos: "determiner";
  gender: "NA";
  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
}
export interface FrenchConjonction {
  pos: "conjonction";
  display: String;
  gender: "NA";
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;

}
export interface FrenchNumber {
  pos: "number";
  gender: "NA";
  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
}
export interface FrenchPronoun {
  pos: "pronoun" | "relative pronoun" | "possessive pronoun" | "disjunctive pronoun" | "indirect object pronoun";
  gender: "NA" | "fem" | "masc";
  plural?: true;
  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
}
export interface FrenchArticle {
  pos: "definite article" | "indefinite article" | "article";
  gender: "NA" | "fem" | "masc";
  plural?: true;
  display: String;
  translations: Array<String>;
  exampleSentences?: Array<{french: String, english: string}>;
}

export interface FrenchWordEntry {
  definitions: Array< NotAWord | FrenchNounEntry | FrenchExclamationEntry | FrenchVerbEntry | FrenchAdverbEntry | FrenchPropositionEntry | FrenchAbbreviation | FrenchAdjectiveEntry | FrenchDeterminer | FrenchNumber | FrenchConjonction | FrenchPronoun | FrenchArticle >;
  occurrences: Number;
}

const words: {french: {[id: string] : FrenchWordEntry}, english: {[id: string] : Array<string>}} = """
  words += json.dumps(word_dict, ensure_ascii=False) 
  words += f"""
export const frenchContractions  = {frenchContractions}
export const englishContractions = {englishContractions}
export default words
"""
  with open("../../cn_experiments/src/data/worddictionary.tsx", "w", encoding='utf8') as f:
    print("Writing word dictionary to cn_experiments")
    f.write(words)

    
  vdir = "../../cn_experiments/assets/audio/french/"
  voice_name = "fr-FR-Wavenet-C" # C is a good female voice, D is a good male voice. D seem to be a bit slower than C.
  previous_files = set([f for f in listdir(vdir) if isfile(join(vdir, f))])
  fil = "export default {\n"
  for previous_file in previous_files:
    fil += f"  '{previous_file.split(voice_name)[0]}': require('../../assets/audio/french/{previous_file}'),\n"
  fil += "}"
  
  with open('../../cn_experiments/src/data/sentenceAudio.tsx', "w") as f:
    print("Writing sentence audio database")
    f.write(fil)



if __name__ == "__main__":
  main()
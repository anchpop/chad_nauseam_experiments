import yaml
import json
from os import listdir, environ
from os.path import isfile, join
from processor.utils import *
import processor.sources_analysis


def main(analysis = None):
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
            if definition.get('pos', '') == 'verb':
              print(f'skipping verb {french_word}')
            else:
              output_words['french'][french_word] = output_words['french'].get(french_word, {'definitions': [], 'occurrences': 0, 'uuid': entry['uuid']})
              output_words['french'][french_word]['definitions'] += [definition]
              for translation in definition.get('translations', []):
                  output_words['english'][translation] = output_words['english'].get(translation, []) + [french_word]
        # if french_word[0] != 'a': break


    output_translations = {'english': {}, 'french': {sentence: {'english': list(set(flatten(translation_dict['french_to_english'][sentence].values())))} for sentence in understandable_sentences if sentence in translation_dict['french_to_english']}}

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
  transitive: Boolean;
  auxillary: String;
  model: String;
  modal: String;
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
  plural?: Boolean;
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
  uuid: String;
}

const words: {french: {[id: string] : FrenchWordEntry}, english: {[id: string] : Array<string>}} = """
    words += json.dumps(output_words, ensure_ascii=False)
    words += f"""
export const frenchContractions  = {frenchContractions}
export const englishContractions = {englishContractions}
export default words
"""
    with open("../../cn_experiments/src/data/worddictionary.tsx", "w", encoding='utf8') as f:
        print("Writing word dictionary to cn_experiments")
        f.write(words)

    vdir = "../../cn_experiments/assets/audio/french/"
    # C is a good female voice, D is a good male voice. D seem to be a bit slower than C.
    voice_name = "fr-FR-Wavenet-C"
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

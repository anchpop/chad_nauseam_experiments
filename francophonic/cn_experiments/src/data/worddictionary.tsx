export interface NotAWord {
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

const words: {french: {[id: string] : FrenchWordEntry}, english: {[id: string] : Array<string>}} = {"french": {"ah": {"definitions": [{"display": "ah", "gender": "NA", "pos": "exclamation", "translations": ["ah"]}], "occurrences": 0, "uuid": "fecba187-9c9a-4b8a-a273-4b292bf4b999"}, "air": {"definitions": [{"display": "air", "exampleSentences": [{"english": "The air we breathe.", "french": "L’air que l’on respire."}, {"english": "She played a tune on the piano.", "french": "Elle a joué un air au piano."}], "gender": "masc", "pos": "noun", "translations": ["air", "tune"]}], "occurrences": 0, "uuid": "294c916b-27ba-465d-99be-a3c1c408543d"}, "alors": {"definitions": [{"display": "alors", "gender": "NA", "pos": "adverb", "translations": ["then", "at that time"]}], "occurrences": 0, "uuid": "e7536156-3818-440b-b25e-bf472a6f1b1e"}, "année": {"definitions": [{"display": "année", "gender": "fem", "pos": "noun", "translations": ["year"]}], "occurrences": 0, "uuid": "ac801d25-0cba-46cd-a543-92fc66a0b601"}, "ans": {"definitions": [{"display": "ans", "gender": "masc", "plural": true, "pos": "noun", "translations": ["year"]}], "occurrences": 0, "uuid": "fbba17b5-0786-4a76-be32-9ee1ee223cd9"}, "après": {"definitions": [{"display": "après", "gender": "NA", "pos": "preposition", "translations": ["après"]}], "occurrences": 0, "uuid": "90989585-b3e6-4d72-82af-051a284d52b2"}, "assez": {"definitions": [{"display": "assez", "exampleSentences": [{"english": "Is he strong enough?", "french": "Est-il assez fort ?"}, {"english": "He went past quite quickly.", "french": "Il est passé assez vite."}], "gender": "NA", "pos": "adverb", "translations": ["enough", "quite"]}], "occurrences": 0, "uuid": "bc2b374f-2bc2-4a5d-895c-5734f38111e5"}, "au": {"definitions": [{"abbreviation": "à + le", "display": "au", "gender": "masc", "pos": "preposition", "translations": ["in", "to"]}], "occurrences": 0, "uuid": "facb406d-dad8-471c-b7aa-07fb94550d14"}, "aucun": {"definitions": [{"display": "aucun", "exampleSentences": [{"english": "There are no books in the drawer.", "french": "Il n’y a aucun livre dans le tiroir"}], "gender": "NA", "pos": "determiner", "translations": ["no"]}], "occurrences": 0, "uuid": "b00ec35a-3c63-4f1c-bea6-ea2f23f7a4c0"}, "aucune": {"definitions": [{"display": "aucune", "gender": "NA", "pos": "determiner", "translations": ["no"]}], "occurrences": 0, "uuid": "d1ac2001-61e4-42f1-919d-29cb8e2e5d14"}, "aussi": {"definitions": [{"display": "aussi", "gender": "NA", "pos": "adverb", "translations": ["also", "too"]}, {"display": "aussi ... que", "gender": "NA", "pos": "adverb", "translations": ["as ... as"]}], "occurrences": 0, "uuid": "3589202a-0c56-4d73-a71e-2872be29840a"}, "aussitôt": {"definitions": [{"display": "aussitôt", "gender": "NA", "pos": "adverb", "translations": ["straight away", "immediately"]}], "occurrences": 0, "uuid": "7463f997-68f9-4e8b-9ef8-6c0216244797"}, "autour": {"definitions": [{"display": "autour", "gender": "NA", "pos": "adverb", "translations": ["around"]}], "occurrences": 0, "uuid": "83f971a1-f646-4a29-a33c-c9571fe42058"}, "autre": {"definitions": [{"display": "autre", "gender": "NA", "pos": "adjective", "translations": ["other", "different"]}], "occurrences": 0, "uuid": "cdb7b068-183a-4702-b4df-5d06c454cdae"}, "autres": {"definitions": [{"display": "autres", "gender": "NA", "plural": true, "pos": "adjective", "translations": ["other", "different"]}], "occurrences": 0, "uuid": "306ced2b-0125-4a54-a11f-f0d0015f63b8"}, "aux": {"definitions": [{"abbreviation": "à + les", "display": "aux", "gender": "masc", "pos": "preposition", "translations": ["in", "to"]}], "occurrences": 0, "uuid": "c6379466-8f47-40b3-ba2b-81abf82d2479"}, "avant": {"definitions": [{"display": "avant", "gender": "NA", "pos": "preposition", "translations": ["before"]}], "occurrences": 0, "uuid": "ce13a4cd-dc36-42d9-bcea-d4adf933cab6"}, "avec": {"definitions": [{"display": "avec", "gender": "NA", "pos": "preposition", "translations": ["with"]}, {"display": "avec soin", "gender": "NA", "pos": "preposition", "translations": ["carefully"]}, {"display": "avec habileté", "gender": "NA", "pos": "preposition", "translations": ["skilfully"]}, {"display": "avec lenteur", "gender": "NA", "pos": "preposition", "translations": ["slowly"]}], "occurrences": 0, "uuid": "64f7c0b4-2a44-4811-9412-b1ecb01aab8f"}, "baguette": {"definitions": [{"display": "baguette", "gender": "fem", "pos": "noun", "translations": ["stick"]}], "occurrences": 0, "uuid": "95ae4cd5-0e39-484d-8746-c1970456ae63"}}, "english": {"ah": ["ah"], "air": ["air"], "tune": ["air"], "then": ["alors"], "at that time": ["alors"], "year": ["année", "ans"], "après": ["après"], "enough": ["assez"], "quite": ["assez"], "in": ["au", "aux"], "to": ["au", "aux"], "no": ["aucun", "aucune"], "also": ["aussi"], "too": ["aussi"], "as ... as": ["aussi"], "straight away": ["aussitôt"], "immediately": ["aussitôt"], "around": ["autour"], "other": ["autre", "autres"], "different": ["autre", "autres"], "before": ["avant"], "with": ["avec"], "carefully": ["avec"], "skilfully": ["avec"], "slowly": ["avec"], "stick": ["baguette"]}}
export const frenchContractions  = {'n': ['ne'], 'l': ['le'], 'lorsqu': ['lorsque'], 'j': ['je'], 's': ['se'], 'jusqu': ['jusque'], 'quelqu': ['quelque'], 'm': ['me'], 'c': ['ce'], 'd': ['de'], 'qu': ['que'], 't': ['te']}
export const englishContractions = {"aren't": ['are', 'not'], "can't": ['can', 'not'], "couldn't": ['could', 'not'], "shouldn't": ['should', 'not'], "wouldn't": ['would', 'not'], "didn't": ['did', 'not'], "doesn't": ['does', 'not'], "hadn't": ['had', 'not'], "hasn't": ['has', 'not'], "haven't": ['have', 'not'], "mightn't": ['might', 'not'], "shan't": ['shall', 'not'], "weren't": ['were', 'not'], "won't": ['will', 'not'], "isn't": ['is', 'not'], "he'll": ['he', 'will'], "she'll": ['she', 'will'], "you'll": ['you', 'will'], "they'll": ['they', 'will'], "what'll": ['what', 'will'], "who'll": ['who', 'will'], "i'd": ['i', 'had'], "she'd": ['she', 'had'], "he'd": ['he', 'had'], "they'd": ['they', 'had'], "i'm": ['i', 'am'], "i've": ['i', 'had'], "we've": ['we', 'have'], "you've": ['you', 'have'], "they've": ['they', 'have'], "let's": ['let', 'us'], "that's": ['that', 'is'], "there's": ['there', 'is'], "what's": ['what', 'is'], "he's": ['he', 'is'], "she's": ['she', 'is'], "they're": ['they', 'are'], "you're": ['you', 'are'], "we're": ['we', 'are']}
export default words

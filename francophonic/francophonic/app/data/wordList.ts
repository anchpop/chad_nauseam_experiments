export interface Word {
    display: string,
    phonetic: string,
    translations: string[],
    formality: "informal" | "formal" | "vulgar" | "unknown",
    audio: string[],
    examples: [{english: string, french: string}],
}

export interface EnglishArticle extends Word {
    pos: "article"
}
export interface EnglishNoun extends Word {
    pos: "noun", 
    base?: string,  // the singular form
    plural: boolean
}
export interface EnglishPronoun extends Word {
    pos: "pronoun"
}
export interface EnglishVerb extends Word {
    pos: "verb",
    transitivity: "transitive" | "intransitive" | "reflexive" | "impersonal",
    tense: "present" | "imperfect" | "present subjunctive" | "imperfect" | "conditional" | "past historical" | "past participle" | "present participle" | "imperative" | "auxillary"
    mood?: "imperative" | "declarative"
    stem: "je" | "tu" | "il/elle/on" | "nous" | "vous" | "ils/elles"
}
export interface EnglishAdverb extends Word {
    pos: "adverb"
}
export interface EnglishAdjective extends Word {
    pos: "adjective"
}
export interface EnglishConjunction extends Word {
    pos: "conjunction"
}
export interface EnglishPreposition extends Word {
    pos: "preoposition"
}

type EnglishWord = EnglishArticle | EnglishNoun | EnglishPronoun | EnglishVerb | EnglishAdverb | EnglishAdjective | EnglishConjunction | EnglishPreposition
type EnglishEntry = EnglishWord[]

export enum Gender { MALE, FEMALE, NA }

export interface FrenchNom extends Word {
    pos: "nom",
    gender: Gender,
    plural: boolean
}
export interface FrenchPrenom extends Word {
    pos: "prenom",
    gender: Gender
}
export interface FrenchVerbe extends Word {
    pos: "verbe",
    infinitive: string
}
export interface FrenchDéterminant extends Word {
    pos: "déterminant"
    gender: Gender
}
export interface FrenchAdjectif extends Word {
    pos: "adjectif",
    base?: string, // the singular, masculine form
    gender: Gender,
    plural: boolean
}
export interface FrenchAdverbe extends Word {
    pos: "adverbe"
}
export interface FrenchPréposition extends Word {
    pos: "prépositions"
}
export interface FrenchConjonction extends Word {
    pos: "conjonction"
}

type FrenchWord = FrenchNom | FrenchPrenom | FrenchVerbe | FrenchDéterminant | FrenchAdjectif | FrenchAdverbe | FrenchPréposition | FrenchConjonction
type FrenchEntry = FrenchWord[]


export function isEnglishArticle(word: EnglishWord): word is EnglishArticle {
    return (<EnglishArticle>word).pos === "article"
}
export function isEnglishNoun(word: EnglishWord): word is EnglishNoun {
    return (<EnglishNoun>word).pos === "noun"
}
export function isEnglishPronoun(word: EnglishWord): word is EnglishPronoun {
    return (<EnglishPronoun>word).pos === "pronoun"
}
export function isEnglishAdjective(word: EnglishWord): word is EnglishAdjective {
    return (<EnglishAdjective>word).pos === "adjective"
}
export function isEnglishConjunction(word: EnglishWord): word is EnglishConjunction {
    return (<EnglishConjunction>word).pos === "conjunction"
}
export function isEnglishAdverb(word: EnglishWord): word is EnglishAdverb {
    return (<EnglishAdverb>word).pos === "adverb"
}
export function isEnglishPreposition(word: EnglishWord): word is EnglishPreposition {
    return (<EnglishPreposition>word).pos === "preoposition"
}
export function isFrenchNom(word: FrenchWord): word is FrenchNom {
    return (<FrenchNom>word).pos === "nom"
}
export function isFrenchPrenom(word: FrenchWord): word is FrenchPrenom {
    return (<FrenchPrenom>word).pos === "prenom"
}
export function isFrenchVerbe(word: FrenchWord): word is FrenchVerbe {
    return (<FrenchVerbe>word).pos === "verbe"
}
export function isFrenchDéterminant(word: FrenchWord): word is FrenchDéterminant {
    return (<FrenchDéterminant>word).pos === "déterminant"
}
export function isFrenchAdjectif(word: FrenchWord): word is FrenchAdjectif {
    return (<FrenchAdjectif>word).pos === "adjectif"
}
export function isFrenchAdverbe(word: FrenchWord): word is FrenchAdverbe {
    return (<FrenchAdverbe>word).pos === "adverbe"
}
export function isFrenchPréposition(word: FrenchWord): word is FrenchPréposition {
    return (<FrenchPréposition>word).pos === "prépositions"
}
export function isFrenchConjonction(word: FrenchWord): word is FrenchConjonction {
    return (<FrenchConjonction>word).pos === "conjonction"
}


export interface Phrase {
    display: string,
    translations: string[]
}


export interface Wordlist {
    words: {
        french: {
            [index:string]: FrenchEntry
        }
        english: {
            [index:string]: EnglishEntry
        }
    },
    phrases: {
        french: {
            [index:string]: Phrase
        }
        english: {
            [index:string]: Phrase
        }
    }

}



const wordList: Wordlist = {
    "words":
    {
        "french": {
            "je": [
                {
                    "display": "je",
                    "pos": "prenom",
                    "gender": Gender.NA,
                    "translations": ["I"]
                }
            ],
            "etre": [
                {
                    "display": "etre",
                    "pos": "verbe",
                    "infinitive": "etre",
                    "translations": ["to be"]
                }
            ],
            "es": [
                {
                    "display": "es",
                    "pos": "verbe",
                    "infinitive": "etre",
                    "translations": ["are"]
                }
            ],
            "est": [
                {
                    "display": "est",
                    "pos": "verbe",
                    "infinitive": "etre",
                    "translations": ["is"]
                }
            ],
            "suis": [
                {
                    "display": "suis",
                    "pos": "verbe",
                    "infinitive": "etre",
                    "translations": ["am"]
                }
            ],
            "un": [
                {
                    "display": "un",
                    "pos": "déterminant",
                    "gender": Gender.MALE,
                    "translations": ["a", "an"]
                }
            ],
            "une": [
                {
                    "display": "une",
                    "pos": "déterminant",
                    "gender": Gender.FEMALE,
                    "translations": ["a", "an"]
                }
            ],
            "l": [
                {
                    "display": "le",
                    "pos": "déterminant",
                    "gender": Gender.MALE,
                    "translations": ["the"]
                }
            ],
            "le": [
                {
                    "display": "le",
                    "pos": "déterminant",
                    "gender": Gender.MALE,
                    "translations": ["the"]
                }
            ],
            "la": [
                {
                    "display": "la",
                    "pos": "déterminant",
                    "gender": Gender.FEMALE,
                    "translations": ["the"]
                }
            ],
            "garçon": [
                {
                    "display": "garçon",
                    "pos": "nom",
                    "gender": Gender.MALE,
                    "translations": ["boy"]
                }
            ],
            "homme": [
                {
                    "display": "homme",
                    "pos": "nom",
                    "gender": Gender.MALE,
                    "translations": ["man"]
                }
            ],
            "femme": [
                {
                    "display": "femme",
                    "pos": "nom",
                    "gender": Gender.FEMALE,
                    "translations": ["woman"]
                }
            ],
            "pomme": [
                {
                    "display": "pomme",
                    "pos": "nom",
                    "gender": Gender.FEMALE,
                    "translations": ["apple"]
                }
            ]
        },
        "english": {
            "i": [
                {
                    "display": "I",
                    "pos": "pronoun",
                    "translations": ["je"]
                }
            ],
            "you": [
                {
                    "display": "you",
                    "pos": "pronoun",
                    "translations": ["tu"]
                }
            ],
            "be": [
                {
                    "display": "be",
                    "pos": "verb",
                    "translations": ["etre"]
                }
            ],
            "are": [
                {
                    "display": "are",
                    "pos": "verb",
                    "translations": ["es"]
                }
            ],
            "is": [
                {
                    "display": "is",
                    "pos": "verb",
                    "translations": ["est"]
                }
            ],
            "am": [
                {
                    "display": "am",
                    "pos": "verb",
                    "translations": ["suis"]
                }
            ],
            "a": [
                {
                    "display": "a",
                    "pos": "article",
                    "translations": ["un", "une"]
                }
            ],
            "an": [
                {
                    "display": "an",
                    "pos": "article",
                    "translations": ["un", "une"]
                }
            ],
            "the": [
                {
                    "display": "the",
                    "pos": "article",
                    "translations": ["le", "la"]
                }
            ],
            "boy": [
                {
                    "display": "boy",
                    "pos": "noun",
                    "translations": ["garçon"]
                }
            ],
            "man": [
                {
                    "display": "man",
                    "pos": "noun",
                    "translations": ["homme"]
                }
            ],
            "woman": [
                {
                    "display": "woman",
                    "pos": "noun",
                    "translations": ["femme"]
                }
            ],
            "apple": [
                {
                    "display": "apple",
                    "pos": "noun",
                    "translations": ["pomme"]
                }
            ]
            
        }
    },
    "phrases": 
    {
        "french": {
            "il y a": {
                "display": "il y a",
                "translations": ["there is"]
            }
        },
        "english": {
            "there is": {
                "display": "there is",
                "translations": ["il y a"]
            }
        }
    }
}

export default wordList
export interface FrenchSentenceData {
    sentence: string,
    audio: string[],
    translationToolUsed: "original" | "deepl" | "google" | "human" | "user-provided"
}

export interface EnglishSentenceData {
    sentence: string
    translationToolUsed: "original" | "deepl" | "google" | "human" | "user-provided"
}

export interface SentenceListing {
    source: string,
    frenchPreferred: FrenchSentenceData[],
    englishPreferred: EnglishSentenceData[]
}

let sentenceList: SentenceListing[] = [
    {
        source: "Andre Popovitch",
        frenchPreferred: [{sentence: "Il y a un homme.", translationToolUsed: "original", audio: []}], // ", "
        englishPreferred: [{sentence: "There is a man.", translationToolUsed: "human"}]
    }
]

export default sentenceList
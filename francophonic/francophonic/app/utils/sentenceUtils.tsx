import * as _ from "lodash";

import wordList from '../data/wordList'
import permutationRules from '../data/permutationRules'


export interface sentenceDataObject {
    original: string,
    normalized: string,
    normalizedWords: string[],
}

export interface sentenceDataObjectGrading extends sentenceDataObject {
    uniqueWords: string[],
}

export interface questionResults {
    translateFrenchWordsToEnglish?: {word: string, score: number}[],
    translateEnglishWordsToFrench?: {word: string, score: number}[],
    translateFrenchPhrasesToEnglish?: {word: string, score: number}[],
    translateEnglishPhrasesToFrench?: {word: string, score: number}[],
    frenchTranscription?: {word: string, score: number}[],
    frenchConjugation?: {word: string, score: number}[],
    frenchGender?: {word: string, score: number}[],
}

export interface PracticeGrade {
    closestEnglishSentence: string, 
    results: questionResults, 
    perfect: boolean
}

export function consecutive<T>(l: T[], length: number): T[][] {
    let newlist: T[][] = []
    for (let i = 0; i < l.length - length + 1; i++) {
        let currentList: T[] = []
        for (let j = 0; j < length; j++) {
            currentList.push(l[i+j])
        }
        newlist.push(currentList)
    }
    return newlist
}
export function getAllSuffixes<T>(l: T[], start: number): T[][] {
    if (start > l.length) {
        return []
    }
    let ans: T[][] = []
    for (let i = 0; i < l.length-start; i++)
    {
        ans.push(l.slice(start, start+i+1))
    }
    return ans
}
export function getAllSublists<T>(l: T[]): {startingIndex: number, l: T[][]}[] {
    let ans: {startingIndex: number, l: T[][]}[] = []
    for (let i = 0; i < l.length; i++)
    {
        ans.push({startingIndex: i, l: getAllSuffixes(l, i)})
    }
    return ans
}

export function getAllIndexes<T>(arr: T[], val: T): number[] {
    return getAllIndexesBy(arr, val, _.identity);
}
export function getAllIndexesBy<T, V>(arr: T[], val: V, func: (original: T) => V): number[] {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (func(arr[i]) === val)
            indexes.push(i);
    return indexes;
}


export function normalizeEnglishSentence(englishSentence: string): string {
    const lower = englishSentence.toLowerCase()
    const nopunc = lower.replace('.','').replace('!','').replace('?','').replace('\'','')
    let permutated = nopunc
    permutationRules.english.forEach(element => {
        permutated = permutated.replace(element.original, element.permutated)
    });
    
    return permutated
}

export function normalizeFrenchSentence(frenchSentence: string): string {
    const lower = frenchSentence.toLowerCase()
    const nopunc = lower.replace('.','').replace('!','').replace('?','').replace('\'',' ')
    let permutated = nopunc
    permutationRules.french.forEach(element => {
        permutated = permutated.replace(element.original, element.permutated)
    });
    return permutated
}
export function frenchSentenceSplitter(sentence: string): string[] {
    const tokens = sentence.split(/([' .?!])/g)
    let splitSentence: string[] = []
    if (tokens !== null)
    {
        tokens.forEach(element => {
            splitSentence.push(element)
        });
        splitSentence = splitSentence.filter((v) => v !== "" && v !== undefined)
        return splitSentence
    }
    return []
}
export function normalizeSplitFrenchSentence(splitFrenchSentence: string[]): string[] {
    return frenchSentenceSplitter(normalizeFrenchSentence(splitFrenchSentence.join("")))
}


export function frenchSentenceSplitterNormalized(sentence: string): string[] {
    return normalizeFrenchSentence(sentence).split(" ")
}

export function isRealFrenchWord(word: string): boolean {
    return  !(word.includes(" ") || word.includes(".") || word.includes("!") || word.includes("'") || word === '')
}

export interface FrenchWordInfo {frenchWord: string, realWord: boolean, translation: {kind: "word" | "phrase", display: string, englishTranslations: string[]}[]}

export function getDefinitionsInFrench(frenchSentence: string): FrenchWordInfo[] {
    let ans: FrenchWordInfo[] =  []
    const sentenceSplit = frenchSentenceSplitter(frenchSentence)

    let phrases: {rangeFrom: number, rangeTo: number, originalDisplay: string, translations: string[]}[] = []

    getAllSublists(sentenceSplit).forEach(suffix => {
        const index = suffix.startingIndex
        suffix.l.forEach(sublist => {
            const phraseCandidate = normalizeFrenchSentence(sublist.join(""))
            const phraseCandidateEntry = wordList.phrases.french[phraseCandidate]
            if (phraseCandidateEntry)
            {
                phrases.push({rangeFrom: index, rangeTo: index+sublist.length, originalDisplay: phraseCandidateEntry.display, translations: phraseCandidateEntry.translations})
            }
        });
    });

    sentenceSplit.forEach((word, index) => {
        let realWord = isRealFrenchWord(word)
        let wordInfo: FrenchWordInfo = {frenchWord: word, realWord: realWord, translation: []}
        if (realWord) {
            phrases.forEach(phrase => {
                if (phrase.rangeFrom <= index && index < phrase.rangeTo) {
                    wordInfo.translation.push({kind: "phrase", display: phrase.originalDisplay, englishTranslations: phrase.translations})
                }
            });
        
            let entries = wordList.words.french[normalizeFrenchSentence(word)]
            if (entries) {
                entries.forEach(entry => {
                    wordInfo.translation.push({kind: "word", display: entry.display, englishTranslations: entry.translations})
                });
            }
        }
        ans.push(wordInfo)
    });

    return ans
}
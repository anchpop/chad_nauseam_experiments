import * as _ from "lodash";

import wordList from '../data/wordList'
import permutationRules from '../data/permutationRules'
import {sentenceDataObject, normalizeEnglishSentence, PracticeGrade, sentenceDataObjectGrading, } from './sentenceUtils'

const goodValue = 7
const badValue = -7


// We need to grade 7 things
// knowledge of translating french words to english
// knowledge of translating english words to french
// knowledge of translating french phrases to english
// knowledge of translating english phrases to french
// ability to transcribe spoken french
// knowledge of conjugations
// knowledge of gender
// for french to english we can only really do the first and third one
// scores are from -7 to 7, but we'll stay between -5 and 5 unless the user tells us not to 
export function gradeEnglishSentences(frenchSentenceNormalized: string[], englishSentencesCorrect: string[], englishSentenceUser: string): PracticeGrade {
    if (englishSentencesCorrect.length === 0) {
        throw new Error('No correct english sentences found, could not grade');
    }

    const frenchSentenceUnique = _.uniq(frenchSentenceNormalized)

    const englishSentencesCorrectObject: sentenceDataObject[] = englishSentencesCorrect.map((sentence) => ({original: sentence, normalized: normalizeEnglishSentence(sentence), normalizedWords: normalizeEnglishSentence(sentence).split(/\s+/)}))
    const englishSentenceUserObject: sentenceDataObject = {original: englishSentenceUser, normalized: normalizeEnglishSentence(englishSentenceUser), normalizedWords: normalizeEnglishSentence(englishSentenceUser).split(/\s+/)};

    let accociatedEnglishSentence = _.find(englishSentencesCorrectObject, (element) => element.normalized == englishSentenceUserObject.normalized)
    if (accociatedEnglishSentence !== undefined) // all correct! perfect!
    {
        let frenchToEnglishScores = frenchSentenceUnique.map((word) => ({word: word, score: goodValue}))
        let results = {translateFrenchWordsToEnglish: frenchToEnglishScores}
        return {closestEnglishSentence: accociatedEnglishSentence.original, results: results, perfect: true}
    }

    
    let wordsInCorrectButNotInUser: sentenceDataObjectGrading[] = []
    englishSentencesCorrectObject.forEach(element => {
        wordsInCorrectButNotInUser.push({...element, uniqueWords: _.uniq(element.normalizedWords.filter((word) => englishSentenceUserObject.normalizedWords.indexOf(word) === -1))})
    });
    wordsInCorrectButNotInUser.sort(function(a, b){return a.uniqueWords.length - b.uniqueWords.length})
    const closestEnglishSentenceObject = wordsInCorrectButNotInUser[0]

    let frenchWordsBad: string[] = []

    // try to guess which words the user didn't know. 
    // If the french translation of a word they should have written but didn't appears in the french sentence, mark it as a word they didn't know 
    closestEnglishSentenceObject.uniqueWords.forEach(englishWord => {
        let englishWordEntry = wordList.words.english[englishWord]
        if (englishWordEntry) {
            englishWordEntry.forEach(entry => {
                entry.translations.forEach(frenchWord => {
                    let frenchWordUsed = frenchSentenceUnique.indexOf(frenchWord) !== -1
                    if (frenchWordUsed) {
                        frenchWordsBad.push(frenchWord)
                    }
                });
            });
        }
    });
    let frenchWordsGood: string[] = frenchSentenceUnique.filter((word) => frenchWordsBad.indexOf(word) === -1)

    
    let frenchToEnglishScores = frenchWordsBad.map((word) => ({word: word, score: badValue})).concat(frenchWordsGood.map((word) => ({word: word, score: goodValue})))


    let results = {translateFrenchWordsToEnglish: frenchToEnglishScores}
    return {closestEnglishSentence: closestEnglishSentenceObject.original, results: results, perfect: false}
}

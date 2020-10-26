import { createSelector } from 'reselect'
import { sha3_256 } from 'js-sha3'

import sentences, {Sentence} from '../../data/sentencedictionary'
import WordDictionary, { frenchContractions, englishContractions, Definition } from '../../data/worddictionary'
import sentenceAudio from '../../data/sentenceAudio'

const frenchDictionary  = WordDictionary.french 
const englishDictionary = WordDictionary.english

const voice_name = "fr-FR-Wavenet-C"
export const getFirstSentence = (state) => {
  const {englishTranslations, frenchTranslations, uuid} = sentences[0]
  const hash = sha3_256(frenchTranslations[0].sentence.toLowerCase())
  const audio = sentenceAudio[hash]
  return {french: frenchTranslations[0].sentence, englishTranslations, uuid, audio}
}

/*
  Information we track separately:
  - knowledge of a french word from an english one
  - knowledge of an english word from a french one
  
  For each bit of information, we store:
  - lastReview             ->                  -> the last date this information was reviewed
  - daysBetweenReviews     -> default 1        -> the space between the last viewing and when the next one should be (or should have been)
  - difficulty             -> 0-1, default .3 -> how difficult thinks the card is
  - consecutiveRight       -> default 0        -> how many times in a row the user has correctly reviewed this information
  - repetitions            -> default 0        -> the number of times the user has reviewed that information

  To compute how overdue a piece of info is, use this formula:
  
  amountDue = if (performanceRating < .6) 
                     then 1
                     else min(2, days(today()-lastReview)/daysBetweenReviews)

  Then, when reviewing, rate (or ask the user to rate) their performance between 0 and 1, call that performanceRating. 

  repetitions' = repetitions + 1

  consecutiveRight' = if (performanceRating < .6) 
                        then 0
                        else consecutiveRight + 1

  correctnessBonus = if !correct or consecutiveRight' < 3 or amountDue < .8
                       then 1
                       else .80

  correctnessBonus = if !correct or consecutiveRight' < 3 or amountDue < .8
                       then 1
                       else .80

  difficulty' = if repetitions == 0
                  then difficulty 
                  else if repetitions < 3
                         then min(difficulty, newDifficulty)
                         else newDifficulty
    where newDifficulty = correctnessBonus * clamp(0, 1, difficulty + (amountDue * (1/17) (8 - 9 * performanceRating)))


  difficultyWeight = 3 - 1.7 * difficulty

  daysBetweenReviews' = daysBetweenReviews * if (performanceRating < .6) 
                          then 1 / difficulty**2
                          else 1 + (difficultyWeight - 1) * amountDue

  To compute which cards to show, pick some number x as the "upper limit" and some number y as the new cards to review. Sort the cards by which have the highest amountDue and filter those which have amountDue > .8. If there are fewer than x of these cards, pick the y cards that haven't been shown to the user yet and have the highest number of occurrences and add them to the deck to be reviewed. 
*/

export const normalizeEnglish = (sentence: String) => (lineToWordsEnglish(sentence.trim().toLowerCase()))


export const clamp = (num: number, min: number, max: number): number => (num <= min ? min : num >= max ? max : num)
const secondsToDays = (n: number) => n/86400
export const computeLearningData = (currentTime, performanceRating, {lastReview, daysBetweenReviews, difficulty, consecutiveRight, repetitions}) => {
  const repetitionsNew      = repetitions + 1
  const correct             = performanceRating >= .6
  const amountDue           = correct ? 
                                  Math.min(2, secondsToDays(currentTime-lastReview) / daysBetweenReviews) 
                                : 1
  const consecutiveRightNew = correct ? consecutiveRight + 1 : 0
  const correctnessBonus    = (!correct || amountDue < .8 || consecutiveRightNew < 3) ? 
                                  1.0 
                                : 0.9 
  const difficultyTemporary = correctnessBonus * clamp(difficulty + (amountDue * (1/17) * (8 - 9 * performanceRating)), 0, 1)
  const difficultyNew       = repetitions == 0 ? difficulty : (repetitions < 3 ? Math.min(difficulty, difficultyTemporary) : difficultyTemporary)
  const difficultyWeight    = 3 - 1.7 * difficulty
  const daysTillNextReview  = daysBetweenReviews * (correct ? 
                                  1 + (difficultyWeight - 1) * amountDue 
                                : 1 / difficulty ** 2)

  return {lastReview: currentTime, daysBetweenReviews: daysTillNextReview, difficulty: difficultyNew, consecutiveRight: consecutiveRightNew, repetitions: repetitionsNew}
}

export const getAllTranslationsFrench = (word): Array<String> => {
  const definitions: Array<Definition> = (frenchDictionary[word.toLowerCase().replace(/[.?!]/g,"")] || {definitions: []}).definitions
  const translations = definitions.flatMap(deffy => deffy['translations'] || []).flatMap(lineToWordsEnglish).flat()
  return translations
}

export const lineToWordsEnglish = (line: String) => {
  const inputWords = line.toLowerCase().trim().split(" ")
  const outputWords = inputWords.map(w => (englishContractions[w] || [w]))
  return outputWords
}


export const lineToWordsFrench = (line: String): Array<Array<{word: String, part?: String}>> => {
  const inputWords = line.trim().split(" ")
  const outputWords = inputWords.map((w: String) => {
    const expansion = frenchContractions[w.toLowerCase()] 
    if (expansion) 
    {
      const parts = w.split("'")
      let outputParts = []
      let i = 0
      for (var part in parts) {
        outputParts.push([{part, word: expansion[i]}])
        i++
      }
      outputParts.pop()
      return outputParts
    } 
    return [{word: w}]
  })
  return outputWords
}

const arraysShareElement = (a1, a2) => {
  for (var x of a1) {
     if (a2.includes(x)) {
       return true
     }
  }
  return false
}

const traceId = (x) => {console.log(x); return x}

export const computeWordsScoresEnglish = (enteredLine: String, question: String, correctSentences: Array<String>) => {
  const answerWords = lineToWordsEnglish(enteredLine)
  const correctWords = correctSentences.map(normalizeEnglish)
  const questionWords = lineToWordsFrench(question)
  if (correctWords.includes(answerWords))
  {
    return questionWords.map(
      wordGroup => wordGroup.map(
        ({part, word}) => ({part, word, correct: true})
      )
    )
  }
  return questionWords.map(
    wordGroup => wordGroup.map(
      ({part, word}) => ({part, word, correct: arraysShareElement(getAllTranslationsFrench(word), answerWords.flat())})
    )
  )
}
import { consecutive, frenchSentenceSplitterNormalized } from '../utils/sentenceUtils'
import { isFrenchDéterminant, isFrenchNom, isFrenchPrenom, isFrenchAdjectif, Gender }  from './wordList'
import wordList from './wordList'

import * as _ from "lodash";

interface GrammarRule {
    name: string,
    description: string[],
    examples: string[],
    negativeExamples: string[],
    incorrectExamples: string[],
    rarity: number,
    predicate: (frenchString: string) => boolean // determines if a sentence involves the grammar rule
    usedCorrectly?: (frenchString: string) => boolean // determines if a sentence uses the grammar rule incorrectly
}

let genderDeterminantPredicate = (frenchString: string) => {
    const frenchSentence = frenchSentenceSplitterNormalized(frenchString)
    let usesGrammarRule = false
    frenchSentence.forEach(frenchWord => {
        let entries = wordList.words.french[frenchWord]
        if (entries) {
            entries.forEach(entry => {
                if (entry.pos == "déterminant" && ['l', 'le', 'la', 'un', 'une'].indexOf(frenchWord) != -1) {
                    usesGrammarRule = true
                }
            });
        }
    });
    return usesGrammarRule
}

const grammarRules: GrammarRule[] = [
    {
        name: "Genders and Déterminants",
        description: [
`French has two grammatical genders: masculine and feminine. All nouns have a gender that you must memorize.`, 
`Sometimes, the gender can be obvious: <<une femme>> is feminine. Other times, it's not obvious: <<une pomme>> is also feminine.`,
`The "Déterminants" are words like <<Le>>, <<La>>, <<Un>>, and <<Une>>. They refer to nouns. <<Le>> is masculine, <<La>> is feminine. Whichever gender the noun is, the déterminant must match.`],
        examples: ["Je mange une pomme.", "Le garçon est riche."],
        negativeExamples: ["Je danse.", "Elle mange."],
        incorrectExamples: ["Je mange un pomme.", "La garçon est riche."],
        rarity: 0,
        predicate: genderDeterminantPredicate,
        usedCorrectly: (frenchString: string) => {
            if (!genderDeterminantPredicate(frenchString)) return false;
            let consecutives = consecutive(frenchSentenceSplitterNormalized(frenchString), 2)
            let foundError = false 
            consecutives.forEach(pair => {
                let entries = pair.map((v) => wordList.words.french[v])
                if (entries.every(_.identity)) { // if both are real entries
                    let entry1 = entries[0][0]
                    let entry2 = entries[1][0]
                    if (isFrenchDéterminant(entry1) && (isFrenchNom(entry2) ||  isFrenchPrenom(entry2) || isFrenchAdjectif(entry2))) {
                        const mismatchedGenders = (entry1.gender == Gender.FEMALE && entry2.gender == Gender.MALE) ||
                                                  (entry1.gender == Gender.MALE && entry2.gender == Gender.FEMALE)
                        if (mismatchedGenders) foundError = true
                    } 
                }
            });
            return !foundError
        }
    }
]

export default grammarRules 
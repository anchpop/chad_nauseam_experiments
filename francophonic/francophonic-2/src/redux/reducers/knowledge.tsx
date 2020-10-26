import produce from "immer"

export interface Sentence {
  kind: "sentence";
  sentence: String,
  sentenceWords: Array<Array<String>>
}

export interface FrenchSentenceQuestion {
  kind: "frenchSentence";
  sentence: Sentence;
  translations: Array<Sentence>;
}

export interface EnglishSentenceQuestion {
  kind: "englishSentence";
  sentence: Sentence;
  translations: Array<Sentence>;
}


const knowledge = (state = {sentencesViewed: {}}, action) => {
  switch (action.type) {
    case 'VIEW_SENTENCE':
      return produce(state, draftState => {
        draftState.sentencesViewed[action.sentenceViewedUUID] = (state.sentencesViewed[action.sentenceViewedUUID] || []) + [action.viewTime]
      })
    default:
      return state
  }
}

export default knowledge
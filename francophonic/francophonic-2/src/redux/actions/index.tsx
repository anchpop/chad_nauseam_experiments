export const SET_THEME = (t) => {
    return {
        type: "SET_THEME",
        themeToSet: SET_THEME
    }
}
export const EDIT_TEXT = (text) => {
    return {
        type: "EDIT_TEXT",
        newText: text
    }
}

export const VIEW_SENTENCE = (sentenceViewedUUID, viewTime) => {
    return {
        type: "VIEW_SENTENCE",
        sentenceViewedUUID,
        viewTime
    }
}

export const SUBMIT = (initialModifiers) => {
    return {
        type: "SUBMIT",
        initialModifiers
    }
}

export const NEXT = () => {
    return {
        type: "NEXT"
    }
}

export const MODIFY_PERFORMANCE = (performanceModifiers) => {
    return {
        type: "MODIFY_PERFORMANCE",
        performanceModifiers
    }
}
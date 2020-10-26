interface PermutationRules {
    english: {
        original: string,
        permutated: string,
    }[],
    french: {
        original: string,
        permutated: string,
    }[],
}

const permutationRules: PermutationRules = {
    "english": [
        {"original": "youre", "permutated": "you are"},
        {"original": "hes", "permutated": "he is"},
        {"original": "shes", "permutated": "she is"},
        {"original": "dont", "permutated": "do not"},
        {"original": "isnt", "permutated": "is not"},
        {"original": "it is", "permutated": "its"},
    ],
    "french": [
    ]
}


export default permutationRules
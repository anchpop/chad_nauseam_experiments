import grammarRules from "../app/data/grammarRules"

grammarRules.forEach(rule => {
    // test predicate
    rule.examples.forEach(example => {
        it(`classifies "${example}" as ${rule.name} `, () => {
            expect(rule.predicate(example)).toBeTruthy();
        });
    });

    rule.incorrectExamples.forEach(example => {
        it(`classifies "${example}" as not being ${rule.name} `, () => {
            expect(rule.predicate(example)).toBeTruthy();
        });
    }); 
    
    rule.negativeExamples.forEach(example => {
        it(`classifies "${example}" as not being ${rule.name} `, () => {
            expect(rule.predicate(example)).toBeFalsy();
        });
    }); 

    // test usedCorrectly
    rule.examples.forEach(example => {
        it(`classifies "${example}" as using ${rule.name} correctly`, () => {
            if (rule.usedCorrectly === undefined) return
            expect(rule.usedCorrectly(example)).toBeTruthy();
        });
    });
    
    rule.incorrectExamples.forEach(example => {
        it(`classifies "${example}" as not using ${rule.name} correctly`, () => {
            if (rule.usedCorrectly === undefined) return
            expect(rule.usedCorrectly(example)).toBeFalsy();
        });
    });

    rule.negativeExamples.forEach(example => {
        it(`classifies "${example}" as not using ${rule.name} correctly`, () => {
            if (rule.usedCorrectly === undefined) return
            expect(rule.usedCorrectly(example)).toBeFalsy();
        });
    });
});
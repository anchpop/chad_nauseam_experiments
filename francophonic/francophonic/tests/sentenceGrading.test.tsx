import { getAllSuffixes, consecutive } from "../app/utils/sentenceUtils"


it('correctly generates consecutives', () => {
    const test = {inputList: [1,2,3,4,5], inputValue: 2, outputList: [[1,2], [2,3], [3,4], [4,5]]} 
    expect(consecutive(test.inputList, test.inputValue)).toEqual(test.outputList);

    
    const test2 = {inputList: [1,2,3,4,5], inputValue: 5, outputList: [[1,2,3,4,5]]} 
    expect(consecutive(test2.inputList, test2.inputValue)).toEqual(test2.outputList);
});
  
it('won\'t generate consecutives if the length is too high', () => {
    const test = {inputList: [1,2,3,4,5], inputValue: 6, outputList: []} 
    expect(consecutive(test.inputList, test.inputValue)).toEqual(test.outputList);
});



it('correctly generates suffixes', () => {
    const test = {inputList: [1,2,3,4,5], inputValue: 2, outputList: [[3], [3,4], [3,4,5]]} 
    expect(getAllSuffixes(test.inputList, test.inputValue)).toEqual(test.outputList);

    
    const test2 = {inputList: [1,2,3,4,5], inputValue: 0, outputList: [[1], [1,2], [1,2,3], [1,2,3,4], [1,2,3,4,5]]} 
    expect(getAllSuffixes(test2.inputList, test2.inputValue)).toEqual(test2.outputList);
});
  
it('won\'t generate suffixes if the length is too high', () => {
    const test = {inputList: [1,2,3,4,5], inputValue: 6, outputList: []} 
    expect(getAllSuffixes(test.inputList, test.inputValue)).toEqual(test.outputList);
});
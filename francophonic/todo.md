1. Separate occurrences from word dictionary (separate concerns belong in separate files)

    1. In fact, why do we store the sentences and word occurrences on disk, in ./work? we should just compute them. We should get rid of how we currently use ./work, and instead in it should go the handmade dictionary and anything else we want the user to work on. Then add ./data where we store the dictionary and translation pairs. 

    2. Goals for storing translation pairs: I want it to be easy to check if google or deepl or a human already translated something. So I'm going to have a "translations" file with a structure like `{french_to_english: {<sentence>: {google: translation, deepl: translation, user1: translation, ...}}}`. 

    3. Then, just for the user's sake (since this won't change it should just be calculated each run), there should be a fourth file containing french word info. This is a list of words as well as how often they appear in each source. In addition, there should be a file containing each sentence and in which sources it appears. This should keep all the different concerns nicely separate.


2. Process word-dictionary into a format more useful to the react app before copying (some research will be needed to figure this out)

3. Add spaced-repetition flashcards for individual french words. I want to make the user type the correct answer, to really force them to recall it.

4. Sort flashcards by usage frequency. Start by prioritizing the words in that simple french short stories book, then move on to le petit nicolas, then le petit prince, then alcatraz, then harry potter, or something like that. 

5. Display what % of the way through you are to getting to 98% of whatever book you're on. 

6. Add deepl translation source for sentences.

7. Show sentence prompts. These should probably be for learning grammar, not for learning words. So try to only show sentences where the user already knows all the words well. 

8. Show nags to remind users to keep studying

9. Add accounts and cross-device syncing. 

10. Make it so you can follow your friends and compare your progress to them.
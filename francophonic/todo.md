1. Separate occurrences from word dictionary (separate concerns belong in separate files)

    1. In fact, why do we store the sentences and word occurrences on disk, in ./work? we should just compute them. We should get rid of how we currently use ./work, and instead in it should go the handmade dictionary and anything else we want the user to work on. Then add ./data where we store the dictionary and translation pairs. 

    2. Here's what I'm thinking for translation pairs. I had the right idea in how I did the tts. I should do the same thing with the translations. I should have a list of sentences, some in French and some in English. This is where I store all the metadata about each sentence - where I got it from and that type of thing. Then I should have a separate list of ordered sentence pairs representing translations. Then each pair can then be "testified by" one or more sources - user input, google translate, deepl, etc. It probably makes sense to keep the ordered sentence pairs together with the testifications.

    3. Then there should be a fourth file containing french word info. This is a list of words as well as how often they appear in each source. This should keep all the different concerns nicely separate.

    This is more of a description of what I think would be a nice way to keep this information together in memory than what would be useful to have in a file. Although having it available to be viewed in a file would be useful also. 

2. Process word-dictionary into a format more useful to the react app before copying (some research will be needed to figure this out)

3. Add spaced-repetition flashcards for individual french words. I want to make the user type the correct answer, to really force them to recall it.

4. Sort flashcards by usage frequency. Start by prioritizing the words in that simple french short stories book, then move on to le petit nicolas, then le petit prince, then alcatraz, then harry potter, or something like that. 

5. Display what % of the way through you are to getting to 98% of whatever book you're on. 

6. Add deepl translation source for sentences.

7. Show sentence prompts. These should probably be for learning grammar, not for learning words. So try to only show sentences where the user already knows all the words well. 

8. Show nags to remind users to keep studying

9. Add accounts and cross-device syncing. 

10. Make it so you can follow your friends and compare your progress to them.
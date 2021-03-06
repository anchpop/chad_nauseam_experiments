1. ✔️ Separate occurrences from word dictionary (separate concerns belong in separate files)

   1. ✔️ In fact, why do we store the sentences and word occurrences on disk, in ./work? we should just compute them. We should get rid of how we currently use ./work, and instead in it should go the handmade dictionary and anything else we want the user to work on. Then add ./data where we store the dictionary and translation pairs.

   2. ✔️ Goals for storing translation pairs: I want it to be easy to check if google or deepl or a human already translated something. So I'm going to have a "translations" file with a structure like `{french_to_english: {<sentence>: {google: translation, deepl: translation, user1: translation, ...}}}`.

   3. ✔️ Then, just for the user's sake (since this won't change it should just be calculated each run), there should be a fourth file containing french word info. This is a list of words as well as how often they appear in each source. In addition, there should be a file containing each sentence and in which sources it appears. This should keep all the different concerns nicely separate.

1.5: ✔️ I need to also redo all the verbs, except this time I need to be sure to put in english translations of the different conjugations somehow. I didn't think this would be important but in hindsight it totally is. I'm going to do this by scraping the reverso page for the english versions and then figuring out how to automatically correlated them. Right now I scrape everything properly except the past/present participles which need to each be added somehow

1.75. ✔ Figure out a way to add [plaire](https://conjugator.reverso.net/conjugation-french-verb-plaire.html) to the dictionary. The verb table is very strange.

2. ✔️ Process word-dictionary into a format more useful to the react app before copying (some research will be needed to figure this out)

3. Add spaced-repetition flashcards for individual french words. I want to make the user type the correct answer, to really force them to recall it.

   1. Okay, some things I want to do better this time:
   
      1. Before giving putting them in the actual french app, run the english translations through [this](https://pypi.org/project/pycontractions/). Why? Because *some contractions are ambiguous*, particularly "I'd" (I would or I had?). With the expanded translation, recreating the contracted ones is easy. The only reason I'm not doing this yet is because it requires java which I don't feel like downloading lol.
   
   
      2. I'm going to write a function like:

      "You're very pretty." -> [[("You", "you"), ("'re", "are")], [("very", "very")], [("pretty", "pretty")], [(".", "")]]

      Except not that because that ignores that some words have multiple outputs "I'd -> I would/had", so I need to figure out that too.

      And I'm going to take care to make it as simple as humanly possible so it can be written in python and javascript and it won't be a maintenance burden to keep both in sync. Ideally I'll have all the data in both be fed from some external source like a couple json files and a regex that can be interpreted by python and js, so small changes are automatically updated on both sides. This way there's no weird bugs caused by them being different on each side.

      4. Then I need a robust to figure out which words in the english translation correspond to which words in the french translation.

4. Sort flashcards by usage frequency. Start by prioritizing the words in that simple french short stories book, then move on to le petit nicolas, then le petit prince, then alcatraz, then harry potter, or something like that.

5. Display what % of the way through you are to getting to 98% of whatever book you're on.

6. Add deepl translation source for sentences.

7. Show sentence prompts. These should probably be for learning grammar, not for learning words. So try to only show sentences where the user already knows all the words well.

8. Show nags to remind users to keep studying

9. Add accounts and cross-device syncing.

10. Make it so you can follow your friends and compare your progress to them.

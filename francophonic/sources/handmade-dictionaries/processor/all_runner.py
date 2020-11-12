import processor.sources_analysis
import processor.handmade_dictionary_combiner 
import processor.auto_sentence_translator 
import processor.tts_generator
import processor.handmade_dictionary_template_generator
import processor.data_mover
import processor.utils
from os.path import isfile, join
import os

from collections import Counter

def print_stats(analysis):
  word_dictionary = processor.utils.get_word_dictionary()['french']
  known_words = processor.utils.get_all_known_french_words()
  understandable, ununderstanadable = processor.utils.get_sentence_analysis(analysis)
  
  print(f"The dictionary contains {len(word_dictionary)} entries ({len(known_words)} words), enough to understand {round((len(understandable)/len(ununderstanadable)) * 100, 1)}% of sentences. ({len(understandable)}/{len(ununderstanadable)})")


  total_words = Counter()
  understood_words = Counter()

  for word, info in analysis[0].items():
    total_words += info
    if word in known_words:
      understood_words += info

  print(f"Your current reading comprehension level is {round((sum(understood_words.values())/sum(total_words.values())) * 100, 1)}%.")
  
  for (source, comprehension) in sorted([(" - ".join(list(source)).rjust(15), round(100 * understood_words[source] / total_words[source], 1)) for source in understood_words], key=lambda x: x[1]):
    print(f"    {source}: {comprehension}")

  total_words_combined = {k: sum(v.values()) for k, v in analysis[0].items()}
  total_words = sum(total_words_combined.values())
  current_words = 0
  words_added = {75: 0, 80: 0, 85: 0, 90: 0, 95: 0, 98: 0} 
  for _, v in total_words_combined.items():
    current_words += v
    for goal_comprehension, required in words_added.items():
      if goal_comprehension > (100 * current_words/total_words):
        words_added[goal_comprehension] += 1

  for goal_comprehension, required in words_added.items():
    print(f"You'll need to know at least {str(required).ljust(max([len(str(w)) for w in words_added.values()]))} words to reach {goal_comprehension}% comprehension")

  pass


def main():
  analysis = processor.sources_analysis.do_analysis()

  print_stats(analysis)
    
  
  if processor.handmade_dictionary_combiner.main(analysis) != True:
    return

  processor.auto_sentence_translator.main(analysis)
  processor.tts_generator.main()
  if isfile("handmade_dictionary.yaml"):
    i = input("would you like to delete `handmade_dictionary.yaml` and generate a new template? (yes/no) ")
    if i.strip() == "yes":
      os.remove("handmade_dictionary.yaml")
      processor.handmade_dictionary_template_generator.main(analysis)
  else:
    processor.handmade_dictionary_template_generator.main(analysis)

  processor.data_mover.main(analysis)

if __name__ == "__main__":
  main()
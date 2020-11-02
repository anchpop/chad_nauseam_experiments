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
  
  for source in understood_words:
    r = str(source).rjust(15)
    # print(f"    {r}: {round(100 * understood_words[source] / total_words[source], 1)}")

  pass


def main():
  analysis = processor.sources_analysis.do_analysis()

  
  if processor.handmade_dictionary_combiner.main(analysis) != True:
    return

  print_stats(analysis)
    
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
import processor.handmade_dictionary_combiner 
import processor.sentence_lister 
import processor.auto_sentence_translator 
import processor.tts_generator
import processor.handmade_dictionary_template_generator
import processor.data_mover
from os.path import isfile, join
import os


def main():
  if processor.handmade_dictionary_combiner.main() != True:
    return
  processor.sentence_lister.main()
  processor.auto_sentence_translator.main()
  processor.tts_generator.main()
  if isfile("handmade_dictionary.yaml"):
    i = input("would you like to delete `handmade_dictionary.yaml` and generate a new template? (yes/no) ")
    if i.strip() == "yes":
      os.remove("handmade_dictionary.yaml")
      processor.handmade_dictionary_template_generator.main() 
  else:
    processor.handmade_dictionary_template_generator.main() 
  processor.data_mover.main()

if __name__ == "__main__":
  main()
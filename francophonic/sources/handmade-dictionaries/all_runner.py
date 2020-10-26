import handmade_dictionary_combiner 
import sentence_lister 
import auto_sentence_translator 
import tts_generator
import handmade_dictionary_template_generator
import data_mover
from os.path import isfile, join
import os


def main():
  
  if handmade_dictionary_combiner.main() != True:
    return
  sentence_lister.main()
  auto_sentence_translator.main()
  tts_generator.main()
  if isfile("handmade_dictionary.yaml"):
    i = input("would you like to delete `handmade_dictionary.yaml` and generate a new template? (yes/no) ")
    if i.strip() == "yes":
      os.remove("handmade_dictionary.yaml")
      handmade_dictionary_template_generator.main() 
  else:
    handmade_dictionary_template_generator.main() 
  data_mover.main()

if __name__ == "__main__":
  main()
import processor.sources_analysis
import processor.handmade_dictionary_combiner
import processor.auto_sentence_translator
import processor.tts_generator
import processor.handmade_dictionary_template_generator
import processor.data_mover
import processor.utils
import processor.print_stats
from os.path import isfile, join
import os


def main():
    analysis = processor.sources_analysis.do_analysis()

    nodelete = False
    if processor.handmade_dictionary_combiner.main(analysis) != True:
        nodelete = True
        if input("Continue without adding words? ").lower().strip()[0] != "y":
            return

    processor.print_stats.print_stats(analysis)

    processor.auto_sentence_translator.main(analysis)
    processor.tts_generator.main()
    if isfile("handmade_dictionary.yaml") and not nodelete:
        i = input("would you like to delete `handmade_dictionary.yaml` and generate a new template? (yes/no) ")
        if i.strip() == "yes":
            os.remove("handmade_dictionary.yaml")
            processor.handmade_dictionary_template_generator.main(analysis)
    else:
        processor.handmade_dictionary_template_generator.main(analysis)

    processor.data_mover.main(analysis)


if __name__ == "__main__":
    main()

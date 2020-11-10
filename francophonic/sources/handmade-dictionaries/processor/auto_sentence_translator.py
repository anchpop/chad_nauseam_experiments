import processor.sources_analysis

from os import listdir, environ
from os.path import isfile, join
from collections import Counter
import re
import yaml
from google.cloud import translate
import uuid
import html
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper
from processor.utils import *

import safer

def main(analysis = None):
    if analysis == None:
        analysis = processor.sources_analysis.do_analysis()
    project_id = "francophonic-1565560815749"
    credential_path = "K:/private/anchpop/privatekeys/Francophonic-f72c700469aa.json"
    environ['GOOGLE_APPLICATION_CREDENTIALS'] = credential_path

    current_dictionary = get_word_dictionary()

    (collected_words, collected_sentences, source_info) = analysis
    understandable_sentences = get_understandable_sentences(analysis)

    translations = get_traslations()

    sentences_to_translate = understandable_sentences - translations['french_to_english'].keys()

    print(f"{len(sentences_to_translate)} sentences to translate")
    
    if len(sentences_to_translate) > 0:
        characters = sum([len(s) for s in sentences_to_translate])
        while True:
            inp = input(
                f"To translate these {len(sentences_to_translate)} sentences would cost around ${characters / 1000000 * 20}, continue? (yes/no/view) ")
            if inp == "view":
                for sentence in sentences_to_translate:
                    print(sentence)
            elif inp == "yes":
                client = translate.TranslationServiceClient()
                location = "global"
                parent = f"projects/{project_id}/locations/{location}"
                for sentence in sentences_to_translate:
                    if (sentence != sentence.strip()):
                        raise Exception(f"sentence \"{sentence}\" is unstripped!")

                    response = client.translate_text(
                        request={
                            "parent": parent,
                            "contents": [sentence],
                            "mime_type": "text/plain",  # mime types: text/plain, text/html
                            "source_language_code": "fr",
                            "target_language_code": "en-US",
                        }
                    )
                    
                    translations['french_to_english'][sentence] = {'google': [translation.translated_text for translation in response.translations]}
                
                translations['english_to_french'] = translations.get('english_to_french', [])
                data = yaml.dump(translations,
                                Dumper=Dumper, allow_unicode=True)
                with safer.open("translations.yaml", "w", encoding='utf-8') as f:
                    f.write(data)
                break
            else:
                break



if __name__ == "__main__":
    main()

from os import listdir, environ
from os.path import isfile, join
from collections import Counter
import re
import yaml
from google.cloud import translate_v3beta1 as translate
import uuid
import html
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper
from utils import *


def main():

    project_id = "francophonic-1565560815749"
    credential_path = "K:/private/anchpop/privatekeys/Francophonic-f72c700469aa.json"
    environ['GOOGLE_APPLICATION_CREDENTIALS'] = credential_path

    current_dictionary = get_word_dictionary()

    allwords = {}
    with open("work/frenchwords.txt", encoding='utf-8') as f:
        for line in f:
            v = re.split(r" ::: ", line)
            allwords[v[0]] = int(v[1])
    allwords = Counter(allwords)

    allsentences = {}
    with open("work/frenchsentences.txt", encoding='utf-8') as f:
        for line in f:
            v = re.split(r" ::: ", line)
            allsentences[v[0]] = v[1].split()

    previous_translations_dictionary = get_sentence_dictionary()
    previous_translations = set(flatten([[translation['sentence'] for translation in previous_translation['frenchTranslations']]
                                         for previous_translation in previous_translations_dictionary]))

    sentencesToTranslate = set()
    with open("work/usable_sentences.txt", encoding="utf-8") as f:
        for sentence in f:
            sentence = sentence.split(" ::: ")[0].strip()
            if "«" in sentence or "»" in sentence:
                continue
            if sentence in previous_translations:
                print(f"'{sentence} already has a translation, so skipping")
                continue
            else:
                sentencesToTranslate.add(sentence)

    autosentences = []

    if len(sentencesToTranslate) > 0:
        characters = sum([len(s) for s in sentencesToTranslate])
        while True:
            inp = input(
                f"To translate these {len(sentencesToTranslate)} sentences would cost around ${characters / 1000000 * 20}, continue? (yes/no/view) ")
            if inp == "view":
                for sentence in sentencesToTranslate:
                    print(sentence)
            elif inp == "yes":
                client = translate.TranslationServiceClient()
                location = "global"
                parent = f"projects/{project_id}/locations/{location}"
                for sentence in sentencesToTranslate:
                    sentence = sentence.strip()
                    translation = client.translate_text(request={
                        'parent': parent,
                        'contents': [sentence],
                        'mime_type': 'text/plain',
                        'source_language_code': "fr",
                        'target_language_code': "en-US"})
                    previous_translations_dictionary.append({'frenchTranslations': [{'sentence': sentence, 'source': allsentences[sentence]}], 'englishTranslations': [
                                                            {'source': 'google', 'sentence': html.unescape(t.translated_text)} for t in translation.translations], 'uuid': str(uuid.uuid4()), 'handVerified': False})

                    data = yaml.dump(previous_translations_dictionary,
                                    Dumper=Dumper, allow_unicode=True)
                    with open("sentencedictionary.yaml", "w", encoding='utf-8') as f:
                        f.write(data)
                break
            else:
                break


if __name__ == "__main__":
    main()

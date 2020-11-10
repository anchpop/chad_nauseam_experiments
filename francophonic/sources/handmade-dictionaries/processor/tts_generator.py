from os import listdir, environ
from os.path import isfile, join
from collections import Counter
import re
import yaml
from google.cloud import texttospeech
import uuid
import html
import hashlib
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper
import time
from processor.utils import *

import safer


def main():
    credential_path = "K:/private/anchpop/privatekeys/Francophonic-f72c700469aa.json"
    environ['GOOGLE_APPLICATION_CREDENTIALS'] = credential_path

    client = texttospeech.TextToSpeechClient()

    dir = "../../cn_experiments/assets/audio/french/"
    # C is a good female voice, D is a good male voice. D seem to be a bit slower than C.
    voice_name = "fr-FR-Wavenet-C"

    sentences = set(get_traslations()['french_to_english'].keys())

    current_dictionary = get_word_dictionary()
    words = get_all_known_french_words()
    # let's not generate phrases for now - there's a ton of theview and it's not very fun
    phrases = [(context.replace(" - ", " ") + " ").replace("' ", "'").replace("il/elle", "il").replace("ils/elles", "ils")  + conjugation
        for word, entry in current_dictionary['french'].items() 
            for definition in entry['definitions'] 
                for _, forms in definition.get('conjugations_french', {}).items() 
                    for _, conjugations in forms.items() 
                        for context, conjugation in conjugations.items()
        ] if False else []

    tts_candidates = sentences.union(words).union(phrases)
    tts_candidates = set([w.lower().strip() for w in tts_candidates])

    previous_files = set([f.split(".")[0]
                          for f in listdir(dir) if isfile(join(dir, f))])

    candidates_to_tts = set()
    for candidate in tts_candidates:
        hash_object = hashlib.sha3_256((candidate).encode('utf-8'))
        hashd = hash_object.hexdigest() + voice_name
        if hashd not in previous_files:
            candidates_to_tts.add((candidate, hashd))

    characters = sum([len(s[0]) for s in candidates_to_tts])
    if len(candidates_to_tts) > 0:
        while True:
            inp = input(
                f"To synthesize speech for these {len(candidates_to_tts)} sentences would cost around ${characters / 1000000 * 20}, continue? (yes/no/view) ")
            if inp == "view":
                for candidate in candidates_to_tts:
                    print(candidate)
            elif inp == "yes":
                print("Sleeping for 10 minutes to avoid quota")
                time.sleep(600)
                for sentence, hashd in candidates_to_tts:
                    if len(sentence) >= 5000:
                        print("{sentence}\nis way too long!")
                        break
                    synthesis_input = texttospeech.SynthesisInput(text=sentence)
                    voice = texttospeech.VoiceSelectionParams(
                        language_code='fr',
                        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL,
                        name=voice_name)

                    # Select the type of audio file you want returned
                    audio_config = texttospeech.AudioConfig(
                        audio_encoding=texttospeech.AudioEncoding.MP3)


                    print(f"sentence '{sentence}' ", end='',  flush=True)

                    # Perform the text-to-speech request on the text input with the selected
                    # voice parameters and audio file type
                    response = client.synthesize_speech(
                        input=synthesis_input, voice=voice, audio_config=audio_config)

                    # The response's audio_content is binary.
                    with safer.open(f'{dir}{hashd}.mp3', 'wb') as out:
                        # Write the response to the output file.
                        out.write(response.audio_content)
                        print(f"written as {dir}{hashd}.mp3")
                    time.sleep(3)
                break
            else:
                break


if __name__ == "__main__":
    main()

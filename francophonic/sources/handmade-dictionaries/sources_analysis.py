from pathlib import Path
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
from utils import *


def main():
    source_paths = ["../books/hp", "../books/inner_french_podcast"]
    source_files = [Path(join(p, f)) for p in source_paths for f in listdir(p) if isfile(join(p, f))]

    collected_words = {}
    collected_sentences = {}

    
    for filename in source_files:
        with open(filename, "r", encoding='utf-8') as f:
            source = tuple(filename.parts[-2:])
            for line in f:
                line = clean_line(line)
                words = line_to_words_french(line)
                for word in words:
                    collected_words[word] = collected_words.get(word, {source: 0})
                    collected_words[word][source] += 1

                
                sentenceChunks = re.split('([.?!])', line)
                sentenceChunks = [sentenceChunk for sentenceChunk in sentenceChunks if sentenceChunk != ""]
                sentences = []
                for i in range(0, len(sentenceChunks) - 1, 2):
                    sentence = (sentenceChunks[i] + sentenceChunks[i + 1]).strip()
                    sentence = clean_line(sentence)
                    sentences.append(sentence)
                for sentence in sentences:
                    if sentence != "" and len(sentence.split()) > 3:
                        pass# allsentences[sentence] = filename.split("/")[-1].split('\\')[0]


if __name__ == '__main__':
    main()
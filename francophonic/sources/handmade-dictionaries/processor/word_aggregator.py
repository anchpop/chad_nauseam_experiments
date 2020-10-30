from os import listdir
from os.path import isfile, join
from collections import Counter
import re
import yaml
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper
from processor.utils import * 

def main():
    mypaths = ["../books/hp", "../books/inner_french_podcast"]
    onlyfiles = [join(mypath, f) for mypath in mypaths for f in listdir(mypath) if isfile(join(mypath, f))]

    allwords = Counter()
    allsentences = {}

    for filename in onlyfiles:
        with open(filename, "r", encoding='utf-8') as f:
            for line in f:
                line = clean_line(line)
                words = line_to_words_french(line)
                for word in words:
                    allwords[word] += 1
                
                sentenceChunks = re.split('([.?!])', line)
                sentenceChunks = [sentenceChunk for sentenceChunk in sentenceChunks if sentenceChunk != ""]
                sentences = []
                for i in range(0, len(sentenceChunks) - 1, 2):
                    sentence = (sentenceChunks[i] + sentenceChunks[i + 1]).strip()
                    sentence = clean_line(sentence)
                    sentences.append(sentence)
                for sentence in sentences:
                    if sentence != "" and len(sentence.split()) > 3:
                        allsentences[sentence] = filename.split("/")[-1].split('\\')[0]


    with open("work/frenchwords.txt", "w", encoding='utf-8') as d:
        d.write("\n".join([f"{k} ::: {v}" for k, v in allwords.items()]))
    with open("work/frenchsentences.txt", "w", encoding='utf-8') as d:
        d.write("\n".join([f"{k} ::: {v}" for k, v in allsentences.items()]))
    for i in range(7, 14):
        n = 2**i
        with open(f"work/frenchwords{n}.txt", "w", encoding='utf-8') as d:
            d.write("\n".join([f"{k}" for k, v in allwords.most_common(n)]))
        with open(f"work/frenchsentences{n}.txt", "w", encoding='utf-8') as d:
            topw = set([t[0] for t in allwords.most_common(n)])
            sentences = []
            for k, v in allsentences.items():
                words = k.split()
                words = [re.sub('[,!?.0-9()&-/:;…]', '', word).lower() for word in words]
                words = [word for word in words if word not in ['', '–', ' ']]
                words = [word in topw for word in words]
                if len([word for word in words if not word]) <= 0:
                    sentences.append(k)
            d.write("\n".join(sentences))

if __name__ == '__main__':
    main()
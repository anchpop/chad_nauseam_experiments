import processor.sources_analysis

from os import listdir
from os.path import isfile, join
from collections import Counter
import re
import yaml
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper

def line_to_words(line, contractions, whole_word_basis):
    def word_splitter(w):
        word_split = w.strip("'").split("'") if not whole_word_basis else [w]
        new_words = []
        for index, word in enumerate(word_split):
            if word in contractions.keys():
                new_words.extend(contractions[word])
            else: 
                new_words.append(word)
        return new_words
    words = line.split()
    words = [word_splitter(re.sub('[,!?.0-9()&/:;…«»]', '', word.replace("’", "'")).lower()) for word in words]
    words = [item for sublist in words for item in sublist]
    words = [word for word in words if word not in ['', '–', ' ']]
    return words

def clean_line(line):
    line = line.strip()
    #line = line.strip("“–«» ")
    #line = line.strip()
    line = re.sub('\[.*?]', '', line) # get rid of the timestamps in bits like "[00:00:12] Bonjour à tous ou bonsoir"
    line = " ".join(line.split())
    # line = re.sub('^.*?:', '', line)
    # line = line.strip("“–«» ")
    
    #if ":" in line:
    #    return ""
    return line.strip()

def retain_only_characters(line):
    line = line.strip()
    line = re.sub(r"[^A-ZÉÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ a-zàâäèéêëîïôœùûüÿç']", "", line).strip()
    return line


def line_to_words_french(line):
    return line_to_words(retain_only_characters(line), frenchContractions, whole_word_basis=False)

def line_to_words_english(line):
    return line_to_words(line, 
        englishContractions, whole_word_basis=True)

def get_sentence_dictionary():
    with open("sentencedictionary.yaml", encoding='utf-8') as f:
        sentence_dictionary = yaml.load(f, Loader=Loader)
    return sentence_dictionary


def get_word_dictionary():
    with open("worddictionary.yaml", encoding='utf-8') as f:
        word_dictionary = yaml.load(f, Loader=Loader)
    return word_dictionary

def get_all_known_french_words():
    word_dictionary = get_word_dictionary()
    words = set([])
    for word, entry in word_dictionary['french'].items():
        words.add(word)
        for definition in entry['definitions']:
            for _, forms in definition.get('conjugations', {}).items():
                for form, conjugations in forms.items():
                    words.update(set(conjugations.values()))
    return words
            
def get_understandable_sentences(analysis = None):
    if analysis == None:
        analysis = processor.sources_analysis.do_analysis()
    (_, collected_sentences) = analysis
    known_words = get_all_known_french_words()
    understandable_sentences = set()
    for sentence in collected_sentences:
        if all([word in known_words for word in line_to_words_french(sentence)]):
            understandable_sentences.add(sentence)
    return understandable_sentences


flatten = lambda l: [item for sublist in l for item in sublist]
def flatmap(l, f):
    return flatten([f(e) for e in l])
def flatdmap(d, f):
    flatten([f(k, v) for k, v in d.items])


frenchContractions = {
    'n': ['ne'], 
    'l': ['le'], 
    'lorsqu': ['lorsque'], 
    'j': ['je'], 
    's': ['se'], 
    'jusqu': ['jusque'], 
    'quelqu': ['quelque'], 
    'm': ['me'], 
    'c': ['ce'], 
    'd': ['de'], 
    'qu': ['que'], 
    't': ['te'], 
    'm': ['me']
}
englishContractions = {
    "aren't":    ["are"    , "not"  ],
    "can't":     ["can"    , "not"  ],
    "couldn't":  ["could"  , "not"  ],
    "shouldn't": ["should" , "not"  ],
    "wouldn't":  ["would"  , "not"  ],
    "didn't":    ["did"    , "not"  ],
    "doesn't":   ["does"   , "not"  ],
    "hadn't":    ["had"    , "not"  ],
    "hasn't":    ["has"    , "not"  ],
    "haven't":   ["have"   , "not"  ],
    "mightn't":  ["might"  , "not"  ],
    "shan't":    ["shall"  , "not"  ],
    "weren't":   ["were"   , "not"  ],
    "won't":     ["will"   , "not"  ],
    "isn't":     ["is"     , "not"  ],
    "he'll":     ["he"     , "will" ],
    "she'll":    ["she"    , "will" ],
    "you'll":    ["you"    , "will" ],
    "they'll":   ["they"   , "will" ],
    "what'll":   ["what"   , "will" ],
    "who'll":    ["who"    , "will" ],
    "i'd":       ["i"      , "had"  ],
    "she'd":     ["she"    , "had"  ],
    "he'd":      ["he"     , "had"  ],
    "they'd":    ["they"   , "had"  ],
    "i'm":       ["i"      , 'am'   ],
    "i've":      ['i'      , 'had'  ],
    "we've":     ["we"     , "have" ],
    "you've":    ["you"    , "have" ],
    "they've":   ["they"   , "have" ],
    "let's":     ['let'    , 'us'   ],
    "that's":    ["that"   , "is"   ],
    "there's":   ["there"  , "is"   ],
    "what's":    ["what"   , "is"   ],
    "he's":      ["he"     , "is"   ],
    "she's":     ["she"    , "is"   ],
    "they're":   ["they"   , "are"  ],
    "you're":    ["you"    , "are"  ],
    "we're":     ["we"     , "are"  ],
}




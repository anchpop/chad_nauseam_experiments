export interface ParseRoot {
  french: number[];
  english: { [key: string]: number[] };
  subTree: ParseNodes;
}

export interface ParseNode {
  element: string;
  info: { [key: string]: ParseRoot };
}

export type ParseNodes = ParseNode[];

export interface Token {
  dep: string;
  idx: number;
  norm: string;
  pos: string;
  text: string;
  trailing_whitespace: string;
}

export interface SentenceTokens {
  tokens_en: { [key: string]: Token[] };
  tokens_fr: Token[];
}

export interface AssociationInfo {
  parseTrees: {
    [key: string]: { tokens: SentenceTokens; parse: ParseNodes };
  };
}

const associationInfo: AssociationInfo = {
  parseTrees: {
    "\"Beaucoup de gens m'ont demandé ça, mais je ne pense pas que le professeur Quirrell aurait voulu que j'en parle.\"": {
      parse: [
        {
          element: "Quote",
          info: {
            root: {
              french: [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
              ],
              english: {
                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  7,
                  8,
                  9,
                  10,
                  11,
                  12,
                  13,
                  14,
                  15,
                  16,
                  17,
                  18,
                  19,
                  20,
                  21,
                  22,
                  23,
                  24,
                  25,
                ],
              },
              subTree: [
                {
                  element: "Conjunction",
                  info: {
                    root: {
                      french: [9],
                      english: {
                        '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                          10,
                        ],
                      },
                      subTree: [],
                    },
                    part1: {
                      french: [1, 2, 3, 4, 6, 7, 5, 8],
                      english: {
                        '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                          9,
                          8,
                          7,
                          5,
                          6,
                          4,
                          3,
                          2,
                          1,
                        ],
                      },
                      subTree: [
                        {
                          element: "TransitiveVerb",
                          info: {
                            root: {
                              french: [6],
                              english: {
                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                  6,
                                ],
                              },
                              subTree: [],
                            },
                            subject: {
                              french: [1, 2, 3],
                              english: {
                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                  4,
                                  3,
                                  1,
                                  2,
                                ],
                              },
                              subTree: [
                                {
                                  element: "Noun",
                                  info: {
                                    root: {
                                      french: [3],
                                      english: {
                                        '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                          4,
                                        ],
                                      },
                                      subTree: [],
                                    },
                                    article: {
                                      french: [],
                                      english: {
                                        '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [],
                                      },
                                      subTree: [],
                                    },
                                    modification: {
                                      french: [1, 2],
                                      english: {
                                        '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                          3,
                                          2,
                                          1,
                                        ],
                                      },
                                      subTree: [],
                                    },
                                  },
                                },
                              ],
                            },
                            directObject: {
                              french: [4],
                              english: {
                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                  7,
                                ],
                              },
                              subTree: [],
                            },
                            indirectObject: {
                              french: [7],
                              english: {
                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                  8,
                                ],
                              },
                              subTree: [],
                            },
                            auxiliary: {
                              french: [5],
                              english: {
                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                  5,
                                ],
                              },
                              subTree: [],
                            },
                            modification: {
                              french: [],
                              english: {
                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [],
                              },
                              subTree: [],
                            },
                          },
                        },
                        {
                          element: "Punctuation",
                          info: {
                            root: {
                              french: [8],
                              english: {
                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                  9,
                                ],
                              },
                              subTree: [],
                            },
                          },
                        },
                      ],
                    },
                    part2: {
                      french: [
                        10,
                        11,
                        12,
                        13,
                        14,
                        15,
                        16,
                        17,
                        18,
                        19,
                        20,
                        21,
                        22,
                        23,
                      ],
                      english: {
                        '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                          11,
                          12,
                          13,
                          14,
                          15,
                          16,
                          17,
                          18,
                          19,
                          20,
                          21,
                          22,
                          23,
                          24,
                        ],
                      },
                      subTree: [
                        {
                          element: "TransitiveVerb",
                          info: {
                            root: {
                              french: [12, 14],
                              english: {
                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                  14,
                                ],
                              },
                              subTree: [],
                            },
                            subject: {
                              french: [10],
                              english: {
                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                  11,
                                ],
                              },
                              subTree: [],
                            },
                            directObject: {
                              french: [15, 16, 17, 18, 19, 20, 21, 22, 23],
                              english: {
                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                  15,
                                  16,
                                  17,
                                  18,
                                  19,
                                  20,
                                  21,
                                  22,
                                  23,
                                  24,
                                ],
                              },
                              subTree: [
                                {
                                  element: "TransitiveVerb",
                                  info: {
                                    root: {
                                      french: [19, 20],
                                      english: {
                                        '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                          19,
                                        ],
                                      },
                                      subTree: [],
                                    },
                                    subject: {
                                      french: [15, 16, 17],
                                      english: {
                                        '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                          15,
                                          16,
                                        ],
                                      },
                                      subTree: [
                                        {
                                          element: "Noun",
                                          info: {
                                            root: {
                                              french: [17],
                                              english: {
                                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                                  16,
                                                ],
                                              },
                                              subTree: [],
                                            },
                                            article: {
                                              french: [15],
                                              english: {
                                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [],
                                              },
                                              subTree: [],
                                            },
                                            modification: {
                                              french: [16],
                                              english: {
                                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                                  15,
                                                ],
                                              },
                                              subTree: [
                                                {
                                                  element: "Adjective",
                                                  info: {
                                                    root: {
                                                      french: [],
                                                      english: {
                                                        '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [],
                                                      },
                                                      subTree: [],
                                                    },
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        },
                                      ],
                                    },
                                    directObject: {
                                      french: [23, 22, 21],
                                      english: {
                                        '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                          20,
                                          21,
                                          22,
                                          23,
                                          24,
                                        ],
                                      },
                                      subTree: [
                                        {
                                          element: "TransitiveVerb",
                                          info: {
                                            root: {
                                              french: [23],
                                              english: {
                                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                                  22,
                                                ],
                                              },
                                              subTree: [],
                                            },
                                            subject: {
                                              french: [21],
                                              english: {
                                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                                  20,
                                                  21,
                                                ],
                                              },
                                              subTree: [],
                                            },
                                            directObject: {
                                              french: [22],
                                              english: {
                                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                                  23,
                                                  24,
                                                ],
                                              },
                                              subTree: [],
                                            },
                                            indirectObject: {
                                              french: [],
                                              english: {
                                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [],
                                              },
                                              subTree: [],
                                            },
                                            auxiliary: {
                                              french: [],
                                              english: {
                                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [],
                                              },
                                              subTree: [],
                                            },
                                            modification: {
                                              french: [],
                                              english: {
                                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [],
                                              },
                                              subTree: [],
                                            },
                                          },
                                        },
                                      ],
                                    },
                                    indirectObject: {
                                      french: [],
                                      english: {
                                        '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [],
                                      },
                                      subTree: [],
                                    },
                                    auxiliary: {
                                      french: [18],
                                      english: {
                                        '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                          18,
                                          17,
                                        ],
                                      },
                                      subTree: [],
                                    },
                                    modification: {
                                      french: [],
                                      english: {
                                        '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [],
                                      },
                                      subTree: [],
                                    },
                                  },
                                },
                              ],
                            },
                            indirectObject: {
                              french: [],
                              english: {
                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [],
                              },
                              subTree: [],
                            },
                            auxiliary: {
                              french: [],
                              english: {
                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [],
                              },
                              subTree: [],
                            },
                            modification: {
                              french: [11, 13],
                              english: {
                                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                                  12,
                                  13,
                                ],
                              },
                              subTree: [],
                            },
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  element: "Punctuation",
                  info: {
                    root: {
                      french: [24],
                      english: {
                        '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                          25,
                        ],
                      },
                      subTree: [],
                    },
                  },
                },
              ],
            },
            startQuote: {
              french: [0],
              english: {
                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                  0,
                ],
              },
              subTree: [],
            },
            endQuote: {
              french: [25],
              english: {
                '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
                  26,
                ],
              },
              subTree: [],
            },
          },
        },
      ],
      tokens: {
        tokens_en: {
          '"A lot of people have asked me this, but I don\'t think Professor Quirrell would have wanted me to talk about it."': [
            {
              dep: "punct",
              idx: 0,
              norm: '"',
              pos: "PUNCT",
              text: '"',
              trailing_whitespace: "",
            },
            {
              dep: "det",
              idx: 1,
              norm: "a",
              pos: "DET",
              text: "A",
              trailing_whitespace: " ",
            },
            {
              dep: "nsubj",
              idx: 3,
              norm: "lot",
              pos: "NOUN",
              text: "lot",
              trailing_whitespace: " ",
            },
            {
              dep: "prep",
              idx: 7,
              norm: "of",
              pos: "ADP",
              text: "of",
              trailing_whitespace: " ",
            },
            {
              dep: "pobj",
              idx: 10,
              norm: "people",
              pos: "NOUN",
              text: "people",
              trailing_whitespace: " ",
            },
            {
              dep: "aux",
              idx: 17,
              norm: "have",
              pos: "AUX",
              text: "have",
              trailing_whitespace: " ",
            },
            {
              dep: "ROOT",
              idx: 22,
              norm: "asked",
              pos: "VERB",
              text: "asked",
              trailing_whitespace: " ",
            },
            {
              dep: "dative",
              idx: 28,
              norm: "me",
              pos: "PRON",
              text: "me",
              trailing_whitespace: " ",
            },
            {
              dep: "dobj",
              idx: 31,
              norm: "this",
              pos: "DET",
              text: "this",
              trailing_whitespace: "",
            },
            {
              dep: "punct",
              idx: 35,
              norm: ",",
              pos: "PUNCT",
              text: ",",
              trailing_whitespace: " ",
            },
            {
              dep: "cc",
              idx: 37,
              norm: "but",
              pos: "CCONJ",
              text: "but",
              trailing_whitespace: " ",
            },
            {
              dep: "nsubj",
              idx: 41,
              norm: "i",
              pos: "PRON",
              text: "I",
              trailing_whitespace: " ",
            },
            {
              dep: "aux",
              idx: 43,
              norm: "do",
              pos: "AUX",
              text: "do",
              trailing_whitespace: "",
            },
            {
              dep: "neg",
              idx: 45,
              norm: "not",
              pos: "PART",
              text: "n't",
              trailing_whitespace: " ",
            },
            {
              dep: "conj",
              idx: 49,
              norm: "think",
              pos: "VERB",
              text: "think",
              trailing_whitespace: " ",
            },
            {
              dep: "compound",
              idx: 55,
              norm: "professor",
              pos: "PROPN",
              text: "Professor",
              trailing_whitespace: " ",
            },
            {
              dep: "nsubj",
              idx: 65,
              norm: "quirrell",
              pos: "PROPN",
              text: "Quirrell",
              trailing_whitespace: " ",
            },
            {
              dep: "aux",
              idx: 74,
              norm: "would",
              pos: "AUX",
              text: "would",
              trailing_whitespace: " ",
            },
            {
              dep: "aux",
              idx: 80,
              norm: "have",
              pos: "AUX",
              text: "have",
              trailing_whitespace: " ",
            },
            {
              dep: "ccomp",
              idx: 85,
              norm: "wanted",
              pos: "VERB",
              text: "wanted",
              trailing_whitespace: " ",
            },
            {
              dep: "nsubj",
              idx: 92,
              norm: "me",
              pos: "PRON",
              text: "me",
              trailing_whitespace: " ",
            },
            {
              dep: "aux",
              idx: 95,
              norm: "to",
              pos: "PART",
              text: "to",
              trailing_whitespace: " ",
            },
            {
              dep: "ccomp",
              idx: 98,
              norm: "talk",
              pos: "VERB",
              text: "talk",
              trailing_whitespace: " ",
            },
            {
              dep: "prep",
              idx: 103,
              norm: "about",
              pos: "ADP",
              text: "about",
              trailing_whitespace: " ",
            },
            {
              dep: "pobj",
              idx: 109,
              norm: "it",
              pos: "PRON",
              text: "it",
              trailing_whitespace: "",
            },
            {
              dep: "punct",
              idx: 111,
              norm: ".",
              pos: "PUNCT",
              text: ".",
              trailing_whitespace: "",
            },
            {
              dep: "punct",
              idx: 112,
              norm: '"',
              pos: "PUNCT",
              text: '"',
              trailing_whitespace: "",
            },
          ],
        },
        tokens_fr: [
          {
            dep: "punct",
            idx: 0,
            norm: '"',
            pos: "PUNCT",
            text: '"',
            trailing_whitespace: "",
          },
          {
            dep: "nsubj",
            idx: 1,
            norm: "beaucoup",
            pos: "PRON",
            text: "Beaucoup",
            trailing_whitespace: " ",
          },
          {
            dep: "case",
            idx: 10,
            norm: "de",
            pos: "ADP",
            text: "de",
            trailing_whitespace: " ",
          },
          {
            dep: "nmod",
            idx: 13,
            norm: "gens",
            pos: "NOUN",
            text: "gens",
            trailing_whitespace: " ",
          },
          {
            dep: "iobj",
            idx: 18,
            norm: "m'",
            pos: "PRON",
            text: "m'",
            trailing_whitespace: "",
          },
          {
            dep: "aux:tense",
            idx: 20,
            norm: "ont",
            pos: "AUX",
            text: "ont",
            trailing_whitespace: " ",
          },
          {
            dep: "ROOT",
            idx: 24,
            norm: "demandé",
            pos: "VERB",
            text: "demandé",
            trailing_whitespace: " ",
          },
          {
            dep: "obj",
            idx: 32,
            norm: "ça",
            pos: "PRON",
            text: "ça",
            trailing_whitespace: "",
          },
          {
            dep: "punct",
            idx: 34,
            norm: ",",
            pos: "PUNCT",
            text: ",",
            trailing_whitespace: " ",
          },
          {
            dep: "cc",
            idx: 36,
            norm: "mais",
            pos: "CCONJ",
            text: "mais",
            trailing_whitespace: " ",
          },
          {
            dep: "nsubj",
            idx: 41,
            norm: "je",
            pos: "PRON",
            text: "je",
            trailing_whitespace: " ",
          },
          {
            dep: "advmod",
            idx: 44,
            norm: "ne",
            pos: "ADV",
            text: "ne",
            trailing_whitespace: " ",
          },
          {
            dep: "conj",
            idx: 47,
            norm: "pense",
            pos: "VERB",
            text: "pense",
            trailing_whitespace: " ",
          },
          {
            dep: "advmod",
            idx: 53,
            norm: "pas",
            pos: "ADV",
            text: "pas",
            trailing_whitespace: " ",
          },
          {
            dep: "mark",
            idx: 57,
            norm: "que",
            pos: "SCONJ",
            text: "que",
            trailing_whitespace: " ",
          },
          {
            dep: "det",
            idx: 61,
            norm: "le",
            pos: "DET",
            text: "le",
            trailing_whitespace: " ",
          },
          {
            dep: "nsubj",
            idx: 64,
            norm: "professeur",
            pos: "NOUN",
            text: "professeur",
            trailing_whitespace: " ",
          },
          {
            dep: "flat:name",
            idx: 75,
            norm: "quirrell",
            pos: "PROPN",
            text: "Quirrell",
            trailing_whitespace: " ",
          },
          {
            dep: "aux:tense",
            idx: 84,
            norm: "aurait",
            pos: "AUX",
            text: "aurait",
            trailing_whitespace: " ",
          },
          {
            dep: "ccomp",
            idx: 91,
            norm: "voulu",
            pos: "VERB",
            text: "voulu",
            trailing_whitespace: " ",
          },
          {
            dep: "mark",
            idx: 97,
            norm: "que",
            pos: "SCONJ",
            text: "que",
            trailing_whitespace: " ",
          },
          {
            dep: "nsubj",
            idx: 101,
            norm: "j'",
            pos: "PRON",
            text: "j'",
            trailing_whitespace: "",
          },
          {
            dep: "iobj",
            idx: 103,
            norm: "en",
            pos: "PRON",
            text: "en",
            trailing_whitespace: " ",
          },
          {
            dep: "ccomp",
            idx: 106,
            norm: "parle",
            pos: "VERB",
            text: "parle",
            trailing_whitespace: "",
          },
          {
            dep: "punct",
            idx: 111,
            norm: ".",
            pos: "PUNCT",
            text: ".",
            trailing_whitespace: "",
          },
          {
            dep: "ROOT",
            idx: 112,
            norm: '"',
            pos: "PUNCT",
            text: '"',
            trailing_whitespace: "",
          },
        ],
      },
    },
  },
};

export default associationInfo;

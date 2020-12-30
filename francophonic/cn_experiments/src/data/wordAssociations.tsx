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
    '"3 pour 1 pour 2."': {
      parse: [
        {
          element: "Quote",
          info: {
            root: {
              french: [1, 2, 3, 4, 5, 6],
              english: {
                '"3 for 1 for 2."': [1, 2, 3, 4, 5, 6],
              },
              subTree: [
                {
                  element: "Number",
                  info: {
                    root: {
                      french: [1],
                      english: {
                        '"3 for 1 for 2."': [1],
                      },
                      subTree: [],
                    },
                  },
                },
                {
                  element: "Preposition",
                  info: {
                    root: {
                      french: [2],
                      english: {
                        '"3 for 1 for 2."': [2],
                      },
                      subTree: [],
                    },
                    relation: {
                      french: [],
                      english: {
                        '"3 for 1 for 2."': [],
                      },
                      subTree: [],
                    },
                  },
                },
                {
                  element: "Number",
                  info: {
                    root: {
                      french: [3],
                      english: {
                        '"3 for 1 for 2."': [3],
                      },
                      subTree: [],
                    },
                  },
                },
                {
                  element: "Preposition",
                  info: {
                    root: {
                      french: [4],
                      english: {
                        '"3 for 1 for 2."': [4],
                      },
                      subTree: [],
                    },
                    relation: {
                      french: [],
                      english: {
                        '"3 for 1 for 2."': [],
                      },
                      subTree: [],
                    },
                  },
                },
                {
                  element: "Number",
                  info: {
                    root: {
                      french: [5],
                      english: {
                        '"3 for 1 for 2."': [5],
                      },
                      subTree: [],
                    },
                  },
                },
                {
                  element: "Punctuation",
                  info: {
                    root: {
                      french: [6],
                      english: {
                        '"3 for 1 for 2."': [6],
                      },
                      subTree: [],
                    },
                  },
                },
              ],
            },
            startQuote: {
              french: [0],
              english: { '"3 for 1 for 2."': [0] },
              subTree: [],
            },
            endQuote: {
              french: [7],
              english: { '"3 for 1 for 2."': [7] },
              subTree: [],
            },
          },
        },
      ],
      tokens: {
        tokens_en: {
          '"3 for 1 for 2."': [
            {
              dep: "punct",
              idx: 0,
              norm: '"',
              pos: "PUNCT",
              text: '"',
              trailing_whitespace: "",
            },
            {
              dep: "ROOT",
              idx: 1,
              norm: "3",
              pos: "NUM",
              text: "3",
              trailing_whitespace: " ",
            },
            {
              dep: "prep",
              idx: 3,
              norm: "for",
              pos: "ADP",
              text: "for",
              trailing_whitespace: " ",
            },
            {
              dep: "pobj",
              idx: 7,
              norm: "1",
              pos: "NUM",
              text: "1",
              trailing_whitespace: " ",
            },
            {
              dep: "prep",
              idx: 9,
              norm: "for",
              pos: "ADP",
              text: "for",
              trailing_whitespace: " ",
            },
            {
              dep: "pobj",
              idx: 13,
              norm: "2",
              pos: "NUM",
              text: "2",
              trailing_whitespace: "",
            },
            {
              dep: "punct",
              idx: 14,
              norm: ".",
              pos: "PUNCT",
              text: ".",
              trailing_whitespace: "",
            },
            {
              dep: "punct",
              idx: 15,
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
            dep: "ROOT",
            idx: 1,
            norm: "3",
            pos: "NUM",
            text: "3",
            trailing_whitespace: " ",
          },
          {
            dep: "case",
            idx: 3,
            norm: "pour",
            pos: "ADP",
            text: "pour",
            trailing_whitespace: " ",
          },
          {
            dep: "nmod",
            idx: 8,
            norm: "1",
            pos: "PRON",
            text: "1",
            trailing_whitespace: " ",
          },
          {
            dep: "case",
            idx: 10,
            norm: "pour",
            pos: "ADP",
            text: "pour",
            trailing_whitespace: " ",
          },
          {
            dep: "nmod",
            idx: 15,
            norm: "2",
            pos: "PRON",
            text: "2",
            trailing_whitespace: "",
          },
          {
            dep: "punct",
            idx: 16,
            norm: ".",
            pos: "PUNCT",
            text: ".",
            trailing_whitespace: "",
          },
          {
            dep: "ROOT",
            idx: 17,
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

import { promises } from "fs";
import * as React from "react";
import produce, { current, enableMapSet } from "immer";
import * as _ from "lodash";

import "./sakura-vader.css";
import "./App.css";
import { DRAFT_STATE, objectTraps } from "immer/dist/internal";

const yaml = require("js-yaml");
let classNames = require("classnames");

enableMapSet();

type Indices = number[];

interface SentenceRangeNode {
  french: Indices;
  english: { [key: string]: Indices };
  subTree: ParseTree;
}

type SentenceRange = SentenceRangeNode;

type PathItem =
  | "root"
  | "subject"
  | "directObject"
  | "indirectObject"
  | "auxiliary"
  | "modification"
  | "relation"
  | "article"
  | "part1"
  | "part2"
  | "startQuote"
  | "endQuote";
type ParsePath = [number, PathItem][];

type ParseItem = {
  element: ParseItemType;
  info: { [K in PathItem]?: SentenceRange };
};

type ParseTree = ParseItem[];

type ParseItemType =
  | "Number"
  | "Quote"
  | "TransitiveVerb"
  | "IntransitiveVerb"
  | "Preposition"
  | "Adverb"
  | "Adjective"
  | "Article"
  | "Pronoun"
  | "Noun"
  | "NounPhrase"
  | "Conjunction"
  | "Interjection"
  | "Punctuation"
  | "Unknown";
const allParseItemTypes: ParseItemType[] = [
  "Number",
  "Quote",
  "TransitiveVerb",
  "IntransitiveVerb",
  "Preposition",
  "Adverb",
  "Adjective",
  "Article",
  "Pronoun",
  "Noun",
  "NounPhrase",
  "Conjunction",
  "Interjection",
  "Unknown",
];

const structureDescription: Record<
  ParseItemType,
  { [K in PathItem]?: boolean }
> = {
  Number: { root: true },
  Punctuation: { root: true },
  Quote: {
    root: true,
    startQuote: false,
    endQuote: false,
  },
  TransitiveVerb: {
    root: true,
    subject: false,
    directObject: false,
    indirectObject: false,
    auxiliary: false,
    modification: false,
  },
  IntransitiveVerb: {
    root: true,
    subject: false,
    auxiliary: false,
    modification: false,
  },
  Preposition: {
    root: true,
    relation: false,
  },
  Adverb: {
    root: true,
  },
  Adjective: {
    root: true,
  },
  Article: {
    root: true,
  },
  Pronoun: {
    root: true,
  },
  Noun: {
    root: true,
    article: false,
    modification: false,
  },
  NounPhrase: {
    root: true,
  },
  Conjunction: {
    root: true,
    part1: true,
    part2: true,
  },
  Interjection: {
    root: true,
  },
  Unknown: {
    root: true,
  },
};

const traversePathItem = (
  tree: ParseTree,
  [index, item]: [number, PathItem]
): SentenceRange => {
  const elem = tree[index];
  return elem.info[item]!;
};

const parseIndex = (tree: ParseTree, parsePath: ParsePath): ParseTree => {
  if (parsePath.length === 0) {
    return tree;
  }
  return parseIndex(
    traversePathItem(tree, parsePath[0]).subTree,
    _.tail(parsePath)
  );
};
const parseIndexParent = (tree: ParseTree, parsePath: ParsePath): ParseItem => {
  console.assert(parsePath.length !== 0);
  const last = _.last(parsePath)!;
  return parseIndex(tree, _.initial(parsePath))[last[0]];
};

interface File {
  text: () => string;
}
interface FileHandle {
  getFile: () => Promise<File>;
}

declare global {
  interface Window {
    showOpenFilePicker: () => Promise<FileHandle[]>;
  }
}

interface Token {
  text: string;
  whitespace: string;
  pos: string;
}

interface SentenceInfo {
  tokens_fr: Token[];
  tokens_en: {
    [key: string]: Token[];
  };
}

interface Sentences {
  [key: string]: SentenceInfo;
}

interface AppStateLoaded {
  nlpFileLoaded: true;
  nlpFileHandle: FileHandle;
  sentencesToAssociate: Sentences;
  currentSentenceString: string;
  parseTrees: { [key: string]: ParseTree };
  selectedParseNode: ParsePath;
}

interface AppStateUnloaded {
  nlpFileLoaded: false;
}

type AppState = AppStateLoaded | AppStateUnloaded;

const startingAppState: AppStateUnloaded = { nlpFileLoaded: false };

const saveFile = async (appState: AppStateLoaded) => {
  const options = {
    types: [
      {
        description: "Text Files",
        accept: {
          "text/plain": [".yaml"],
        },
      },
    ],
  };
  const handle = await (window as any).showSaveFilePicker(options);
  const writable = await handle.createWritable();
  await writable.write(
    yaml.safeDump({
      parseTrees: appState.parseTrees,
    })
  );
  await writable.close();
};

const range = (from: number, to: number) => {
  const [start, end] = [from, to].sort();
  const arr = Array.from(new Array(end - start), (x, i) => start + i);
  if (from > to) {
    return arr.reverse();
  }
  return arr;
};

const initializeParseTree = (
  sentence: string,
  { tokens_fr, tokens_en }: SentenceInfo
): { [key: string]: ParseTree } =>
  tokens_fr.filter(({ text }) => text === '"').length === 2 &&
  tokens_fr[0].text === '"' &&
  _.last(tokens_fr)!.text === '"'
    ? {
        [sentence]: [
          {
            element: "Quote",
            info: {
              root: {
                french: range(1, tokens_fr.length - 1),
                english: Object.fromEntries(
                  Object.entries(tokens_en).map(([sentence, tokens]) => [
                    sentence,
                    range(1, tokens.length - 1),
                  ])
                ),
                subTree: [],
              },
              startQuote: {
                french: [0],
                english: Object.fromEntries(
                  Object.entries(tokens_en).map(([sentence, tokens]) => [
                    sentence,
                    [0],
                  ])
                ),
                subTree: [],
              },
              endQuote: {
                french: [tokens_fr.length - 1],
                english: Object.fromEntries(
                  Object.entries(tokens_en).map(([sentence, tokens]) => [
                    sentence,
                    [tokens.length - 1],
                  ])
                ),
                subTree: [],
              },
            },
          },
        ],
      }
    : { [sentence]: [] };

const analyzeNlpFile = async (
  appState: AppState,
  setAppState: React.Dispatch<React.SetStateAction<AppState>>
) => {
  const [nlpFileHandle] = await window.showOpenFilePicker();
  const file = await nlpFileHandle.getFile();
  const contents = await file.text();
  const sentencesToAssociate: Sentences = yaml.safeLoad(contents);

  const currentSentenceString: string = Object.keys(sentencesToAssociate)[0];

  const selectedTokens = {
    english: Object.fromEntries(
      Object.keys(
        sentencesToAssociate[currentSentenceString].tokens_en
      ).map((k) => [k, [] as number[]])
    ),
    french: [] as number[],
  };

  const currentSentenceTokensFr =
    sentencesToAssociate[currentSentenceString].tokens_fr;
  const currentSentenceTokensEn =
    sentencesToAssociate[currentSentenceString].tokens_en;

  const parseTrees: { [key: string]: ParseTree } = Object.entries(
    sentencesToAssociate
  )
    .map(([sentence, info]) => initializeParseTree(sentence, info))
    .reduce((x, acc) => ({ ...x, ...acc }));

  const selectedParseNode: ParsePath = [];

  let newState: AppStateLoaded = {
    ...appState,
    nlpFileLoaded: true,
    nlpFileHandle,
    sentencesToAssociate,
    currentSentenceString,
    parseTrees,
    selectedParseNode,
  };

  setAppState(newState);
};

const toggleTokens = (index: number, shift: boolean, tokens: number[]) => {
  const tokensToSelect =
    shift && tokens.length > 0
      ? range(tokens[tokens.length - 1] + 1, index + 1)
      : [index];

  tokensToSelect.forEach((currentIndex) => {
    if (tokens.includes(currentIndex)) {
      tokens = tokens.filter((i) => i !== currentIndex);
    } else {
      tokens.push(currentIndex);
    }
  });
  return tokens;
};

// toggleSelectFrenchToken and toggleSelectEnglishToken both need to change to not just change the root
const toggleSelectFrenchToken = (
  index: number,
  shift: boolean,
  appState: AppStateLoaded,
  setAppState: React.Dispatch<React.SetStateAction<AppState>>
) => {
  setAppState(
    produce(appState, (draftState: AppStateLoaded) => {
      const parent: ParseItem = parseIndexParent(
        draftState.parseTrees[draftState.currentSentenceString],
        draftState.selectedParseNode
      );
      const branch = _.last(draftState.selectedParseNode)![1];
      parent.info[branch]!.french = toggleTokens(
        index,
        shift,
        parent.info[branch]!.french
      );
    })
  );
};

const toggleSelectEnglishToken = (
  sentence: string,
  index: number,
  shift: boolean,
  appState: AppStateLoaded,
  setAppState: React.Dispatch<React.SetStateAction<AppState>>
) => {
  setAppState(
    produce(appState, (draftState: AppStateLoaded) => {
      const parent: ParseItem = parseIndexParent(
        draftState.parseTrees[draftState.currentSentenceString],
        draftState.selectedParseNode
      );
      const branch = _.last(draftState.selectedParseNode)![1];
      parent.info[branch]!.english[sentence] = toggleTokens(
        index,
        shift,
        parent.info[branch]!.english[sentence]
      );
    })
  );
};

const TokenButtons = ({
  sentenceTokens,
  selectedTokens,
  toggleSelect,
  buttonIsDisabled,
}: {
  sentenceTokens: Token[];
  selectedTokens: number[];
  toggleSelect: (index: number, shift: boolean) => void;
  buttonIsDisabled: (index: number) => boolean;
}): JSX.Element => (
  <div>
    <p>
      {sentenceTokens.map(({ text, pos }, index) => (
        <button
          key={index}
          className={classNames("french", pos.toLocaleLowerCase(), "token", {
            selected: selectedTokens.includes(index),
          })}
          onClick={(e) => toggleSelect(index, e.shiftKey)}
          disabled={buttonIsDisabled(index)}
        >
          {text}
        </button>
      ))}
    </p>
  </div>
);

const ViewParseTree = ({
  sentence,
  parseTree,
  selectedNode,
  setSelectedNode,
  deleteNode,
}: {
  sentence: SentenceInfo;
  parseTree: ParseTree;
  selectedNode: ParsePath;
  setSelectedNode: (parsePath: ParsePath) => void;
  deleteNode: (parsePath: ParsePath, index: number) => void;
}): JSX.Element => {
  const SubParse = ({
    node,
    currentPath,
  }: {
    node: SentenceRangeNode;
    currentPath: ParsePath;
  }): JSX.Element => {
    console.assert(node !== undefined);
    console.assert(node.subTree !== undefined, node);
    console.assert(currentPath !== undefined);
    return (
      <span
        className={classNames("Subparse", {
          Selected: _.isEqual(selectedNode, currentPath),
        })}
        onClick={(e) => {
          setSelectedNode(currentPath);
          e.stopPropagation();
        }}
      >
        {currentPath.length > 0 && _.last(currentPath)![1] !== "root" ? (
          <span>{_.last(currentPath)![1]}</span>
        ) : (
          <></>
        )}
        {node.subTree.length === 0 ? (
          <div className="Parse-token-area">
            <div className="Parse-token-group">
              {[...node.french].sort().map((index) => (
                <div key={index} className="Parse-token french">
                  {sentence.tokens_fr[index].text}{" "}
                </div>
              ))}
            </div>
            {Object.entries(node.english).map(
              ([englishSentence, indices], englishSentenceIndex) => (
                <div className="Parse-token-group" key={englishSentenceIndex}>
                  {[...indices].sort().map((index) => (
                    <div key={index} className="Parse-token french">
                      {sentence.tokens_en[englishSentence][index].text}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        ) : (
          <ContinueParseTree tree={node.subTree} currentPath={currentPath} />
        )}
      </span>
    );
  };

  const ContinueParseTree = ({
    tree,
    currentPath,
  }: {
    tree: ParseTree;
    currentPath: ParsePath;
  }) => (
    <>
      {tree.map((parseItem, index) => {
        const desc = structureDescription[parseItem.element];
        return (
          <div key={index} className="Continueparse">
            <button onClick={() => deleteNode(currentPath, index)}>x</button>
            <div className="Label">{parseItem.element}: </div>
            {Object.entries(desc).map(([pathItem, required], index_) => (
              <SubParse
                key={index_}
                node={parseItem.info[pathItem as PathItem]!}
                currentPath={currentPath.concat([
                  [index, pathItem as PathItem],
                ])}
              />
            ))}
          </div>
        );
      })}
    </>
  );

  return (
    <div className="Parse-area">
      <div
        className={classNames("Subparse", {
          Selected: selectedNode.length === 0,
        })}
        onClick={(e) => {
          setSelectedNode([]);
          e.stopPropagation();
        }}
      >
        <div className="Label">Master: </div>
        <ContinueParseTree tree={parseTree} currentPath={[]} />
      </div>
    </div>
  );
};

const getTokensAvailable = (
  sentenceInfo: SentenceInfo,
  selectedParseNode: ParsePath,
  parseTree: ParseTree
): { french: Indices; english: { [key: string]: Indices } } => {
  const tokensGivenToChildren = (
    node: ParseItem,
    branch: PathItem
  ): { french: Indices; english: { [key: string]: Indices } } => {
    if (node.element === "Quote") {
      const token_indices_fr = node.info.root!.french;
      const tokens_fr = sentenceInfo.tokens_fr;
      if (
        token_indices_fr.filter((i) => tokens_fr[i].text === '"').length ===
          2 &&
        tokens_fr[0].text === '"' &&
        _.last(tokens_fr)!.text === '"'
      ) {
        return {
          english: Object.fromEntries(
            Object.entries(
              node.info.root!.english
            ).map(([sentence, tokens]) => [
              sentence,
              _.tail(_.initial([...tokens].sort())),
            ])
          ),
          french: _.tail(_.initial([...node.info.root!.french].sort())),
        };
      }
    }
    return {
      english: node.info[branch]!.english,
      french: node.info[branch]!.french,
    };
  };

  if (selectedParseNode.length === 0) {
    return {
      french: [],
      english: Object.fromEntries(
        Object.entries(sentenceInfo.tokens_en).map(([sentence, _]) => [
          sentence,
          [],
        ])
      ),
    };
  }
  if (selectedParseNode.length === 1) {
    return {
      french: range(0, sentenceInfo.tokens_fr.length),
      english: Object.fromEntries(
        Object.entries(sentenceInfo.tokens_en).map(([sentence, tokens]) => [
          sentence,
          range(0, tokens.length),
        ])
      ),
    };
  }

  const node = parseIndexParent(parseTree, _.initial(selectedParseNode));
  return tokensGivenToChildren(node, _.last(selectedParseNode)![1]);
};

const getTokensSelected = (
  sentenceInfo: SentenceInfo,
  selectedParseNode: ParsePath,
  parseTree: ParseTree
): { french: Indices; english: { [key: string]: Indices } } => {
  if (selectedParseNode.length === 0) {
    return {
      french: [],
      english: Object.fromEntries(
        Object.entries(sentenceInfo.tokens_en).map(([sentence, _]) => [
          sentence,
          [],
        ])
      ),
    };
  }
  const last = _.last(selectedParseNode)!;
  const node = traversePathItem(
    parseIndex(parseTree, _.initial(selectedParseNode)),
    last
  );
  return {
    french: node.french,
    english: Object.fromEntries(
      Object.entries(sentenceInfo.tokens_en).map(([sentence, _]) => [
        sentence,
        node.english[sentence],
      ])
    ),
  };
};

const addNode = (
  sentenceInfo: SentenceInfo,
  parseTree: ParseTree,
  parsePath: ParsePath,
  toAdd: ParseItemType
) =>
  produce(parseTree, (tree) => {
    const toAddTo = parseIndex(tree, parsePath);
    const emptyRoot = {
      french: [],
      english: Object.fromEntries(
        Object.entries(sentenceInfo.tokens_en).map(([sentence, _]) => [
          sentence,
          [],
        ])
      ),
      subTree: [],
    };

    const newNode = {
      element: toAdd,
      info: Object.fromEntries(
        Object.entries(structureDescription[toAdd]).map(([pathItem, _]) => [
          pathItem,
          emptyRoot,
        ])
      ),
    };

    toAddTo.push(newNode);
  });

const Options = ({
  appState,
  setParseTree,
}: {
  appState: AppStateLoaded;
  setParseTree: (parseItemType: ParseItemType) => void;
}): JSX.Element => {
  return (
    <div className="Options-box">
      <span>Add: </span>
      {allParseItemTypes.map((nodeType) => (
        <button key={nodeType} onClick={() => setParseTree(nodeType)}>
          {nodeType}
        </button>
      ))}
    </div>
  );
};

const LoadedApp = ({
  appState,
  setAppState,
}: {
  appState: AppStateLoaded;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}): JSX.Element => {
  const tokensAvailable = getTokensAvailable(
    appState.sentencesToAssociate[appState.currentSentenceString],
    appState.selectedParseNode,
    appState.parseTrees[appState.currentSentenceString]
  );
  const tokensSelected = getTokensSelected(
    appState.sentencesToAssociate[appState.currentSentenceString],
    appState.selectedParseNode,
    appState.parseTrees[appState.currentSentenceString]
  );
  const updateParseTree = (f: (parseTree: ParseTree) => ParseTree) => {
    const parseTree: ParseTree =
      appState.parseTrees[appState.currentSentenceString];
    setAppState(
      produce(appState, (draftState) => {
        draftState.parseTrees[draftState.currentSentenceString] = f(parseTree);
      })
    );
  };

  return (
    <>
      <Options
        appState={appState}
        setParseTree={(parseItemType) =>
          updateParseTree((prevTree: ParseTree) =>
            addNode(
              appState.sentencesToAssociate[appState.currentSentenceString],
              prevTree,
              appState.selectedParseNode,
              parseItemType
            )
          )
        }
      />
      <TokenButtons
        toggleSelect={(index, shift) =>
          toggleSelectFrenchToken(index, shift, appState, setAppState)
        }
        sentenceTokens={
          appState.sentencesToAssociate[appState.currentSentenceString]
            .tokens_fr
        }
        selectedTokens={tokensSelected.french}
        buttonIsDisabled={(index) => !tokensAvailable.french.includes(index)}
      />

      {Object.entries(
        appState.sentencesToAssociate[appState.currentSentenceString].tokens_en
      ).map(([sentence, tokens]) => (
        <TokenButtons
          toggleSelect={(index, shift) =>
            toggleSelectEnglishToken(
              sentence,
              index,
              shift,
              appState,
              setAppState
            )
          }
          key={sentence}
          sentenceTokens={tokens}
          selectedTokens={tokensSelected.english[sentence]}
          buttonIsDisabled={(index) =>
            !tokensAvailable.english[sentence].includes(index)
          }
        />
      ))}

      <ViewParseTree
        sentence={appState.sentencesToAssociate[appState.currentSentenceString]}
        parseTree={appState.parseTrees[appState.currentSentenceString]}
        selectedNode={appState.selectedParseNode}
        setSelectedNode={(path) => {
          setAppState({ ...appState, selectedParseNode: path });
        }}
        deleteNode={(parsePath, index) =>
          updateParseTree(
            produce((draftTree) => {
              const toDeleteParent = parseIndex(
                appState.parseTrees[appState.currentSentenceString], // replace with drafttree
                parsePath
              );
              toDeleteParent.splice(index);
            })
          )
        }
      />

      {Object.entries(appState.sentencesToAssociate).map(
        ([frenchSentence, info]) => (
          <button
            disabled={frenchSentence == appState.currentSentenceString}
            onClick={() =>
              setAppState({
                ...appState,
                currentSentenceString: frenchSentence,
              })
            }
          >
            <p key={frenchSentence}>{frenchSentence}</p>
          </button>
        )
      )}
    </>
  );
};

const App = () => {
  const [appState, setAppState] = React.useState<AppState>(startingAppState);

  return (
    <div className="App">
      <div className="Main-container">
        <div>
          <button
            onClick={async () => await analyzeNlpFile(appState, setAppState)}
            id="But-get-nlp"
          >
            {appState.nlpFileLoaded ? "NLP File Loaded" : "Load NLP File"}
          </button>

          {appState.nlpFileLoaded ? (
            <button
              onClick={async () => await saveFile(appState)}
              id="But-get-nlp"
            >
              Write info
            </button>
          ) : (
            <></>
          )}
        </div>

        {appState.nlpFileLoaded ? (
          <LoadedApp appState={appState} setAppState={setAppState} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default App;

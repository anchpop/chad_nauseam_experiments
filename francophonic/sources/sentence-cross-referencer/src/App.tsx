import { promises } from "fs";
import * as React from "react";
import produce, { current, enableMapSet } from "immer";
import * as _ from "lodash";

import "./sakura-vader.css";
import "./App.css";
import { objectTraps } from "immer/dist/internal";

const yaml = require("js-yaml");
var classNames = require("classnames");

enableMapSet();

type Indices = number[];

interface SentenceRangeNode {
  french: Indices;
  english: { [key: string]: Indices };
  subTree: ParseTree;
}

type SentenceRange = SentenceRangeNode;

interface Quote {
  element: "quote";
  root: SentenceRange;
}

interface Number {
  element: "number";
  root: SentenceRange;
}

interface TransitiveVerb {
  element: "transitive verb";
  root: SentenceRange;
  subject: SentenceRange;
  directObject: SentenceRange;
  indirectObject?: SentenceRange;
  auxiliary: SentenceRange;
  modification: SentenceRange;
}

interface IntransitiveVerb {
  element: "intransitive verb";
  root: SentenceRange;
  subject: SentenceRange;
  auxiliary?: SentenceRange;
  modification?: SentenceRange;
}

interface Preposition {
  element: "preposition";
  root: SentenceRange;
  relation?: SentenceRange;
}

interface Adverb {
  element: "adverb";
  root: SentenceRange;
}

interface Article {
  element: "article";
  root: SentenceRange;
}

interface Pronoun {
  element: "pronoun";
  root: SentenceRange;
}

interface Noun {
  element: "noun";
  root: SentenceRange;
  article?: SentenceRange;
  modification?: SentenceRange;
}

interface Adjective {
  element: "adjective";
  root: SentenceRange;
}

interface NounPhrase {
  element: "noun phrase";
  root: SentenceRange;
}

interface Conjunction {
  element: "conjunction";
  root: SentenceRange;
  part1: SentenceRange;
  part2: SentenceRange;
}

interface Interjection {
  element: "interjection";
  root: SentenceRange;
}

interface Unknown {
  element: "unknown";
  root: SentenceRange
}

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
  | "part2";
type ParsePath = [number, PathItem][];

type ParseItem =
  | Number
  | Quote
  | TransitiveVerb
  | IntransitiveVerb
  | Preposition
  | Adverb
  | Adjective
  | Article
  | Pronoun
  | Noun
  | NounPhrase
  | Conjunction
  | Interjection
  | Unknown;

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
  | "Unknown";

const structureDescription: [ParseItemType, {[K in PathItem]?: boolean}][] = [
  ["Number", {"root": true}],
  ["Quote", {"root": true}],
] 

const traversePathItem = (
  tree: ParseTree,
  [index, item]: [number, PathItem]
): SentenceRange => {
  const elem = tree[index];
  return (elem as any)[item];
};

const parseIndex = (tree: ParseTree, parsePath: ParsePath): ParseTree => {
  if (parsePath.length === 0) {
    return tree;
  }
  return parseIndex(traversePathItem(tree, parsePath[0]).subTree, _.tail(parsePath));
};
const parseIndexParent = (tree: ParseTree, parsePath: ParsePath): ParseItem => {
  console.assert(parsePath.length !== 0) 
  const last = _.last(parsePath)!
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

const saveFile = async () => {
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
  return handle;
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
          element: "quote",
          root: {
            french: range(0, tokens_fr.length),
            english: Object.fromEntries(
              Object.entries(tokens_en).map(([sentence, tokens]) => [
                sentence,
                range(0, tokens.length),
              ])
            ),
            subTree: [],
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

  // Initialize the parse tree to be a quote if it seems like that's what this is
  const parseTrees: { [key: string]: ParseTree } = Object.entries(
    sentencesToAssociate
  )
    .map(([sentence, info]) => initializeParseTree(sentence, info))
    .reduce((x, acc) => ({ ...x, ...acc }));

  const selectedParseNode: ParsePath = [];

  var newState: AppStateLoaded = {
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

const toggleSelectFrenchToken = (
  index: number,
  shift: boolean,
  appState: AppStateLoaded,
  setAppState: React.Dispatch<React.SetStateAction<AppState>>
) => {
  setAppState(
    produce(appState, (draftState: AppStateLoaded) => {
      const parent: ParseItem = parseIndexParent(draftState.parseTrees[draftState.currentSentenceString], draftState.selectedParseNode);
      parent.root.french = toggleTokens(
        index,
        shift,
        parent.root.french)
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
      const parent: ParseItem = parseIndexParent(draftState.parseTrees[draftState.currentSentenceString], draftState.selectedParseNode);
      parent.root.english[sentence] = toggleTokens(
        index,
        shift,
        parent.root.english[sentence])
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
}: {
  sentence: SentenceInfo;
  parseTree: ParseTree;
  selectedNode: ParsePath;
  setSelectedNode: (parsePath: ParsePath) => void;
}): JSX.Element => {
  const SubParse = ({
    node,
    currentPath,
  }: {
    node: SentenceRangeNode;
    currentPath: ParsePath;
  }): JSX.Element => (
    <span
      className={classNames("Subparse", {
        Selected: _.isEqual(selectedNode, currentPath),
      })}
      onClick={(e) => {
        setSelectedNode(currentPath);
        e.stopPropagation();
      }}
    >
      {node.subTree.length === 0 ? (
        <div className="Parse-token-area">
          <div className="Parse-token-group">
            {
              [...node.french].sort().map((index) => (
                <div key={index} className="Parse-token french">{sentence.tokens_fr[index].text} </div>
              ))
            }
          </div>
          {
            Object.entries(node.english).map(([englishSentence, indices], englishSentenceIndex) => 
              <div className="Parse-token-group" key={englishSentenceIndex}>
                {
                  [...indices].sort().map(
                    (index) => 
                      <div key={index} className="Parse-token french">
                        {
                          sentence.tokens_en[englishSentence][index].text
                        }
                      </div>
                    )
                }
              </div>
            )
          }
        </div>
      ) : (
          <ContinueParseTree tree={node.subTree} currentPath={currentPath} />
        )}
    </span>
  );

  const ContinueParseTree = ({
    tree,
    currentPath,
  }: {
    tree: ParseTree;
    currentPath: ParsePath;
  }) => (
    <>
      {tree.map((parseItem, index) => {
        if (parseItem.element === "quote") {
          const { root } = parseItem;
          return (
            <div key={index} className="Continueparse">
              <div className="Label">Quote: </div>
              <SubParse
                node={root}
                currentPath={currentPath.concat([[index, "root"]] as ParsePath)}
              />
            </div>
          );
        }
        else if (parseItem.element === "number") {
          const { root } = parseItem;
          return (
            <div key={index} className="Continueparse">
              <div className="Label">Number: </div>
              <SubParse
                node={root}
                currentPath={currentPath.concat([[index, "root"]] as ParsePath)}
              />
            </div>
          );
        }
        else {
          throw "Not supported yet in ContinueParseTree"
        }
        return <></>;
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

const getTokensAvailable = (sentenceInfo: SentenceInfo, selectedParseNode: ParsePath, parseTree: ParseTree): { french: Indices, english: { [key: string]: Indices } } => {
  const tokensGivenToChildren = (node: ParseItem): { french: Indices, english: { [key: string]: Indices } } => {
    if (node.element === "quote") {
      const token_indices_fr = node.root.french;
      const tokens_fr = sentenceInfo.tokens_fr
      if (token_indices_fr.filter((i) => tokens_fr[i].text === '"').length === 2 &&
        tokens_fr[0].text === '"' &&
        _.last(tokens_fr)!.text === '"') {
        return { english: Object.fromEntries(Object.entries(node.root.english).map(([sentence, tokens]) => [sentence, _.tail(_.initial(tokens))])), french: _.tail(_.initial(node.root.french)) }
      }
    }
    else {
      throw "not supported in getTokensAvailable"
    }
    return { english: node.root.english, french: node.root.french }
  }

  if (selectedParseNode.length === 0) {
    return { french: [], english: Object.fromEntries(Object.entries(sentenceInfo.tokens_en).map(([sentence, _]) => [sentence, []])) }
  }
  if (selectedParseNode.length === 1) {
    return { french: range(0, sentenceInfo.tokens_fr.length), english: Object.fromEntries(Object.entries(sentenceInfo.tokens_en).map(([sentence, tokens]) => [sentence, range(0, tokens.length)])) }
  }

  const node = parseIndexParent(parseTree, _.initial(selectedParseNode))
  return tokensGivenToChildren(node)
}

const getTokensSelected = (sentenceInfo: SentenceInfo, selectedParseNode: ParsePath, parseTree: ParseTree): { french: Indices, english: { [key: string]: Indices } } => {
  if (selectedParseNode.length === 0) {
    return {french: [], english: Object.fromEntries(Object.entries(sentenceInfo.tokens_en).map(([sentence, _]) => [sentence, []]))}
  }
  const last = _.last(selectedParseNode)!
  const node = traversePathItem(parseIndex(parseTree, _.initial(selectedParseNode)), last)
  return {french: node.french, english: Object.fromEntries(Object.entries(sentenceInfo.tokens_en).map(([sentence, _]) => [sentence, node.english[sentence]]))}
}

const addNode = (sentenceInfo: SentenceInfo, parseTree: ParseTree, parsePath: ParsePath, toAdd: ParseItemType) => 
  produce(parseTree, (tree) => {
    const toAddTo = parseIndex(tree, parsePath)
    const emptyRoot =  {french: [], english: Object.fromEntries(Object.entries(sentenceInfo.tokens_en).map(([sentence, _]) => [sentence, []])), subTree: []};
    if (toAdd === "Quote")
    {
      toAddTo.push({element: "quote", root: emptyRoot}) 
    }
    else if (toAdd === "Number")
    {
      toAddTo.push({element: "number", root: emptyRoot}) 

    }
    else {
      throw "not supported in addNode yet"
    }
  })


const Options = ({appState, setAppState}: { appState: AppStateLoaded, setAppState: React.Dispatch<React.SetStateAction<AppState>> }): JSX.Element => {
  const ops: ParseItemType[] = ["Quote", "Number"]
  return (
    <div className="Options-box">
      <span>Add: </span>
      {ops.map(nodeType => <button key={nodeType} onClick={() => {
        setAppState(produce(appState, (draftAppState) => {
          const currentSentenceString = draftAppState.currentSentenceString
          const currentParseTree = draftAppState.parseTrees[currentSentenceString]
          draftAppState.parseTrees[currentSentenceString] = addNode(draftAppState.sentencesToAssociate[currentSentenceString], currentParseTree, draftAppState.selectedParseNode, nodeType)
        }))
      }}>{nodeType}</button>)}
      
    </div>
  )
}

const LoadedApp = ({ appState, setAppState }: { appState: AppStateLoaded, setAppState: React.Dispatch<React.SetStateAction<AppState>> }): JSX.Element => {
  const tokensAvailable = getTokensAvailable(appState.sentencesToAssociate[appState.currentSentenceString], appState.selectedParseNode, appState.parseTrees[appState.currentSentenceString])
  const tokensSelected = getTokensSelected(appState.sentencesToAssociate[appState.currentSentenceString], appState.selectedParseNode, appState.parseTrees[appState.currentSentenceString])
  return (<>
    <Options appState={appState} setAppState={setAppState} />
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
      appState.sentencesToAssociate[appState.currentSentenceString]
        .tokens_en
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
        buttonIsDisabled={(index) => !tokensAvailable.english[sentence].includes(index)}
      />
    ))}

    <ViewParseTree
      sentence={
        appState.sentencesToAssociate[appState.currentSentenceString]
      }
      parseTree={appState.parseTrees[appState.currentSentenceString]}
      selectedNode={appState.selectedParseNode}
      setSelectedNode={(path) => {
        setAppState({ ...appState, selectedParseNode: path });
      }}
    />
  </>)
}

const App = () => {
  const [appState, setAppState] = React.useState<AppState>(startingAppState);

  if (appState.nlpFileLoaded) {
    console.log(appState.parseTrees);
  }

  return (
    <div className="App">
      <div className="Main-container">
        <button
          onClick={async () => await analyzeNlpFile(appState, setAppState)}
          id="But-get-nlp"
        >
          {appState.nlpFileLoaded ? "NLP File Loaded" : "Load NLP File"}
        </button>

        {appState.nlpFileLoaded ? (
          <LoadedApp appState={appState} setAppState={setAppState} />
        ) : (
            <></>
          )}
      </div>
      {
        appState.nlpFileLoaded === true ? (
          Object.entries(appState.sentencesToAssociate).map(
            ([frenchSentence, info]) => (
              <p key={frenchSentence}>
                {info.tokens_fr.map(({ text }, index) => (
                  <span
                    key={frenchSentence + index}
                    className={classNames("french", "token")}
                  >
                    {text}
                  </span>
                ))}
              </p>
            )
          )
        ) : (
            <></>
          )
      }
    </div >
  );
};

export default App;

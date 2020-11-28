import { promises } from "fs";
import * as React from "react";
import produce, { enableMapSet } from "immer";

import "./sakura-vader.css";
import "./App.css";

const yaml = require("js-yaml");
var classNames = require("classnames");

enableMapSet();

type Indices = number[];

interface SentenceRangeNode {
  french: [Indices, ParseTree[]];
  english: { [key: string]: [Indices, ParseTree[]] };
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
  auxiliary?: SentenceRange;
  modification?: SentenceRange;
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
  | Interjection;

type ParseTree = ParseItem[];

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
  selectedTokens: {
    english: {
      [k: string]: number[];
    };
    french: number[];
  };
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
  tokens_fr[tokens_fr.length - 1].text === '"'
    ? {
        [sentence]: [
          {
            element: "quote",
            root: {
              french: [range(0, tokens_fr.length), []],
              english: Object.fromEntries(
                Object.entries(tokens_en).map(([sentence, tokens]) => [
                  sentence,
                  [range(0, tokens.length), []],
                ])
              ),
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

  var newState: AppStateLoaded = {
    ...appState,
    nlpFileLoaded: true,
    nlpFileHandle,
    sentencesToAssociate,
    currentSentenceString,
    selectedTokens,
    parseTrees,
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
      draftState.selectedTokens.french = toggleTokens(
        index,
        shift,
        draftState.selectedTokens.french
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
      draftState.selectedTokens.english[sentence] = toggleTokens(
        index,
        shift,
        draftState.selectedTokens.english[sentence]
      );
    })
  );
};

const frenchButtons = (
  appState: AppStateLoaded,
  setAppState: React.Dispatch<React.SetStateAction<AppState>>
) =>
  appState.sentencesToAssociate[appState.currentSentenceString].tokens_fr.map(
    ({ text, pos }, index) => (
      <button
        key={appState.currentSentenceString + index}
        className={classNames("french", pos.toLocaleLowerCase(), "token", {
          selected: appState.selectedTokens.french.includes(index),
        })}
        onClick={(e) =>
          toggleSelectFrenchToken(index, e.shiftKey, appState, setAppState)
        }
      >
        {text}
      </button>
    )
  );

const englishButtons = (
  appState: AppStateLoaded,
  setAppState: React.Dispatch<React.SetStateAction<AppState>>
) =>
  Object.entries(
    appState.sentencesToAssociate[appState.currentSentenceString].tokens_en
  ).map(([englishSentence, info]) => (
    <div key={englishSentence}>
      {info.map(({ text, pos }, index) => (
        <button
          key={englishSentence + index}
          className={classNames("english", pos.toLocaleLowerCase(), "token", {
            selected: appState.selectedTokens.english[englishSentence].includes(
              index
            ),
          })}
          onClick={(e) =>
            toggleSelectEnglishToken(
              englishSentence,
              index,
              e.shiftKey,
              appState,
              setAppState
            )
          }
        >
          {text}
        </button>
      ))}
    </div>
  ));

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
          <>
            <div>
              <p>{frenchButtons(appState, setAppState)}</p>
            </div>
            <div>{englishButtons(appState, setAppState)}</div>
            <div>
              {appState.parseTrees[appState.currentSentenceString].map(
                (tree, index) => (
                  <div key={index}>{"" + tree}</div>
                )
              )}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      {appState.nlpFileLoaded === true ? (
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
      )}
    </div>
  );
};

export default App;

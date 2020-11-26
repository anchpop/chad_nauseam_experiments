import { promises } from "fs";
import * as React from "react";
import produce, { enableMapSet } from "immer";

import "./sakura-vader.css";
import "./App.css";

const yaml = require("js-yaml");
var classNames = require("classnames");

enableMapSet();

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
}

interface Sentences {
  [key: string]: {
    tokens_fr: Token[];
    tokens_en: { [key: string]: Token[] };
  };
}

interface AppStateLoaded {
  nlpFileLoaded: true;
  nlpFileHandle: FileHandle;
  sentencesToAssociate: Sentences;
  currentSentenceString: string;
  selectedTokens: {
    english: {
      [k: string]: Set<number>;
    };
    french: Set<number>;
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

const analyzeNlpFile = async (
  appState: AppState,
  setAppState: React.Dispatch<React.SetStateAction<AppState>>
) => {
  const [nlpFileHandle] = await window.showOpenFilePicker();
  const file = await nlpFileHandle.getFile();
  const contents = await file.text();
  const sentencesToAssociate: Sentences = yaml.safeLoad(contents);

  const currentSentenceString = Object.entries(sentencesToAssociate)[0][0];

  const selectedTokens = {
    english: Object.fromEntries(
      Object.keys(
        sentencesToAssociate[currentSentenceString].tokens_en
      ).map((k) => [k, new Set() as Set<number>])
    ),
    french: new Set() as Set<number>,
  };

  var newState: AppStateLoaded = {
    ...appState,
    nlpFileLoaded: true,
    nlpFileHandle,
    sentencesToAssociate,
    currentSentenceString,
    selectedTokens,
  };

  setAppState(newState);
};

const toggleSelectFrenchToken = (
  index: number,
  appState: AppStateLoaded,
  setAppState: React.Dispatch<React.SetStateAction<AppState>>
) => {
  setAppState(
    produce(appState, (draftState: AppStateLoaded) => {
      if (draftState.selectedTokens.french.has(index)) {
        draftState.selectedTokens.french.delete(index);
      } else {
        draftState.selectedTokens.french.add(index);
      }
    })
  );
};

const toggleSelectEnglishToken = (
  sentence: string,
  index: number,
  appState: AppStateLoaded,
  setAppState: React.Dispatch<React.SetStateAction<AppState>>
) => {
  setAppState(
    produce(appState, (draftState: AppStateLoaded) => {
      if (draftState.selectedTokens.english[sentence].has(index)) {
        draftState.selectedTokens.english[sentence].delete(index);
      } else {
        draftState.selectedTokens.english[sentence].add(index);
      }
    })
  );
};

const App = () => {
  const [appState, setAppState] = React.useState<AppState>(startingAppState);

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
              <p>
                {appState.sentencesToAssociate[
                  appState.currentSentenceString
                ].tokens_fr.map((word, index) => (
                  <button
                    key={appState.currentSentenceString + index}
                    className={classNames("french", "token", {
                      selected: appState.selectedTokens.french.has(index),
                    })}
                    onClick={() =>
                      toggleSelectFrenchToken(index, appState, setAppState)
                    }
                  >
                    {word.text}
                  </button>
                ))}
              </p>
            </div>
            <div>
              {Object.entries(
                appState.sentencesToAssociate[appState.currentSentenceString]
                  .tokens_en
              ).map(([englishSentence, info]) =>
                info.map((word, index) => (
                  <button
                    key={englishSentence + index}
                    className={classNames("english", "token", {
                      selected: appState.selectedTokens.english[
                        englishSentence
                      ].has(index),
                    })}
                    onClick={() =>
                      toggleSelectEnglishToken(
                        englishSentence,
                        index,
                        appState,
                        setAppState
                      )
                    }
                  >
                    {word.text}
                  </button>
                ))
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

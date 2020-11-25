import { promises } from "fs";
import * as React from "react";

import "./sakura-vader.css";
import "./App.css";

const yaml = require("js-yaml");

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
  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.text();
  const sentences: Sentences = yaml.safeLoad(contents);

  var newState: AppStateLoaded = {
    ...appState,
    nlpFileLoaded: true,
    nlpFileHandle: fileHandle,
    sentencesToAssociate: sentences,
    currentSentenceString: Object.entries(sentences)[0][0],
  };

  setAppState(newState);
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
                ].tokens_fr.map((word) => (
                  <span className="french token">{word.text}</span>
                ))}
              </p>
            </div>
            <div>
              {Object.entries(
                appState.sentencesToAssociate[appState.currentSentenceString]
                  .tokens_en
              ).map(([englishSentence, info]) =>
                info.map((word) => (
                  <span className="french token">{word.text}</span>
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
            <p>
              {info.tokens_fr.map(({ text }) => (
                <span className="french token">{text}</span>
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

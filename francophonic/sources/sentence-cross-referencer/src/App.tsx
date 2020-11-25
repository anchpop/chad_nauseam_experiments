import { promises } from "fs";
import * as React from "react";

import './sakura-vader.css'
import "./App.css";

const yaml = require("js-yaml");

interface File { text: () => string };
interface FileHandle { getFile: () => Promise<File> };

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




const analyzeNlpFile = async (setSentencesToAssociate: React.Dispatch<React.SetStateAction<Sentences>>, setNlpFileHandle: React.Dispatch<React.SetStateAction<FileHandle | null>>) => {
  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.text();

  setNlpFileHandle(fileHandle)
  setSentencesToAssociate(yaml.safeLoad(contents))
}

const App = () => {
  const [sentencesToAssociate, setSentencesToAssociate] = React.useState(
    {} as Sentences
  );
  const [nlpFileHandle, setNlpFileHandle] = React.useState(
    null as FileHandle | null
  );
  return (
    <div className="App">

      <div className="Main-container">
        <button
          onClick={async () => await analyzeNlpFile(setSentencesToAssociate, setNlpFileHandle)}
          id="But-get-nlp"
        >
          {nlpFileHandle !== null ? "NLP File Loaded" : "Load NLP File"}
        </button>
      </div>
      {Object.entries(sentencesToAssociate).map(([frenchSentence, info]) => (
        <p>
          {info.tokens_fr.map(({ text }) => (
            <span className="french token">{text}</span>
          ))}
        </p>
      ))}
    </div>
  );
};

export default App;

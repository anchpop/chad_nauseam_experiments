import React, { useState } from "react";

import logo from "./logo.svg";
import "./App.css";

const yaml = require("js-yaml");

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

const getFile = async () => {
  const [fileHandle] = await (window as any).showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.text();
  return contents;
};

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

const App = () => {
  const [sentencesToAssociate, setSentencesToAssociate] = useState<Sentences>(
    {}
  );
  return (
    <div className="App">
      <header className="App-header">
        <button
          onClick={async () =>
            setSentencesToAssociate(yaml.safeLoad(await getFile()))
          }
        >
          Activate Lasers
        </button>
      </header>
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

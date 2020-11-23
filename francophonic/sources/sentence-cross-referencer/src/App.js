import React, { useState } from 'react';

import logo from './logo.svg';
import './App.css';

const yaml = require('js-yaml');


const getFile = async () => {
  const [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.text();
  return contents
}

const saveFile = async () => {
  const options = {
    types: [
      {
        description: 'Text Files',
        accept: {
          'text/plain': ['.yaml'],
        },
      },
    ],
  };
  const handle = await window.showSaveFilePicker(options);
  return handle;
}


const App = () => {
  const [sentencesToAssociate, setSentencesToAssociate] = useState({})
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={async () => setSentencesToAssociate(yaml.safeLoad(await getFile()))}>
          Activate Lasers
        </button>
      </header>
      {
        Object.entries(sentencesToAssociate).map(([frenchSentence, englishSentences]) => <p>{frenchSentence}</p>)
      }
    </div >
  );
}

export default App;

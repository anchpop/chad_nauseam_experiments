import * as React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  RecyclerViewBackedScrollViewBase,
} from "react-native";
import produce from "immer";

import * as _ from "lodash";
import itiriri from "itiriri"; // helper for iterating over maps

import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

import Container from "./components/Container";
import Button from "./components/Button";

import useStyle from "./styles";

import wordAssociations, {
  Token,
  ParseRoot,
  ParseNode,
  AssociationInfo,
  SentenceTokens,
  ParseNodes,
} from "./data/wordAssociations";
import { frenchContractions } from "./data/worddictionary";
import associationInfo from "./data/wordAssociations";

var shuffleSeed = require("shuffle-seed");

interface ReviewState {
  enteredCharacters: Map<number[], string>;
}

const initialReviewState: () => ReviewState = () => ({
  enteredCharacters: new Map(),
});

const playSound = async () => {
  const soundObject = new Audio.Sound();
  await soundObject.loadAsync(
    require("../assets/audio/french/0a4b44e806c056eb8769a97e5bdf560ee01fb821e93c5196910a0c944207f1ecfr-FR-Wavenet-C.mp3")
  );
  await soundObject.playAsync();
};

const Question = ({
  sentenceTokens,
  lfromChunk,
}: {
  sentenceTokens: SentenceTokens;
  lfromChunk: number[];
}) => {
  const { reviewPageStyles } = useStyle();
  return (
    <View style={reviewPageStyles.questionContainer}>
      <View style={{ paddingRight: 7 }}>
        <TouchableOpacity onPress={playSound}>
          <Ionicons name="md-volume-high" size={32} color="black" />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={reviewPageStyles.questionText}>
          {sentenceTokens.tokens_fr.map(
            ({ text, trailing_whitespace }, index) => (
              <Text key={index}>
                <Text
                  style={
                    lfromChunk.includes(index)
                      ? reviewPageStyles.questionTextHighlight
                      : {}
                  }
                >
                  {text}
                </Text>
                {trailing_whitespace}
              </Text>
            )
          )}
        </Text>
      </View>
    </View>
  );
};

const AnswerView = ({
  enteredCharacters,
  tokensCorrectlyEntered,
}: {
  enteredCharacters: { enteredCharacters: string; goal: string }[];
  tokensCorrectlyEntered: number;
}) => {
  const { reviewPageStyles } = useStyle();
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {enteredCharacters.map(({ enteredCharacters, goal }, index) => (
        <View key={index}>
          <Text
            style={[
              reviewPageStyles.answerBox,
              tokensCorrectlyEntered === index
                ? reviewPageStyles.answerBoxHighlight
                : {},
            ]}
          >
            <Text style={reviewPageStyles.answerText}>{enteredCharacters}</Text>
            <Text style={reviewPageStyles.answerTextInvis}>
              {goal.substring(enteredCharacters.length, goal.length)}
            </Text>
          </Text>
        </View>
      ))}
    </View>
  );
};

const Buttons = ({
  letters,
}: {
  letters: { text: string; onPress: () => void }[];
}) => {
  const { reviewPageStyles } = useStyle();
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {letters.map(({ text, onPress }, index) => (
        <TouchableOpacity key={index} onPress={onPress}>
          <View style={reviewPageStyles.buttonBox}>
            <Text style={reviewPageStyles.buttonText}>{text}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const findNodesAssociations = (
  frenchIndex: number,
  parseNodesRoot: ParseNodes
): { french: number[][]; english: { [key: string]: number[][] } } => {
  const findNode = (
    node: ParseNode
  ): { french: number[][]; english: { [key: string]: number[][] } } => {
    const parts = Object.entries(node.info)
      .map(([_, p]) => {
        if (p.french.includes(frenchIndex)) {
          const cont = findNodes(p.subTree);
          return {
            french: cont.french.concat([p.french]),
            english: Object.fromEntries(
              Object.entries(p.english).map(([k, v]) => [
                k,
                (cont.english[k] || []).concat([v]),
              ])
            ),
          };
        } else {
          return { french: [], english: {} };
        }
      })
      .filter(({ french }) => french.length > 0);
    console.assert(parts.length <= 1);
    if (parts.length == 0) {
      return { french: [], english: {} };
    } else {
      return parts[0];
    }
  };

  const findNodes = (
    nodes: ParseNodes
  ): { french: number[][]; english: { [key: string]: number[][] } } => {
    const out = nodes.map(findNode);
    const found = out.filter(({ french }) => french.length);
    console.assert(found.length <= 1);
    if (found.length == 0) {
      return { french: [], english: {} };
    } else {
      return found[0];
    }
  };

  return findNodes(parseNodesRoot);
};

const getAllAssociations = (
  tokensFr: Token[],
  parseNodes: ParseNodes
): Map<
  number[], // french indices
  {
    french: number[][];
    english: {
      [key: string]: number[][];
    };
  }
> => {
  let indicesRemaining = _.range(tokensFr.length);
  let outputMap = new Map();
  while (indicesRemaining.length > 0) {
    const index = indicesRemaining[0];
    const associations = findNodesAssociations(index, parseNodes);
    const deepestAssocationIndicesFrench = associations.french[0];
    outputMap.set(deepestAssocationIndicesFrench, associations);
    indicesRemaining = indicesRemaining.filter(
      (i) => !deepestAssocationIndicesFrench.includes(i)
    );
  }
  return outputMap;
};

// I want to refactor this to use "lfrom" and "lto" instead of "french" and "english" as much as possible so it's easier to refactor parts of it into being language agnostic
const ReviewScreen = () => {
  const { reviewPageStyles } = useStyle();

  // Eventually we'll get this dynamically instead of hard-coding it, but
  // since we actually only have one sentence association so far I don't
  // think it makes a big difference for now
  const [_s, sentenceInfo] = Object.entries(wordAssociations.parseTrees)[0];

  const [appState, setAppState] = React.useState(initialReviewState());

  const ltoSentences = Object.entries(sentenceInfo.tokens.tokens_en);

  const allAssociations = getAllAssociations(
    sentenceInfo.tokens.tokens_fr,
    sentenceInfo.parse
  );

  const ltoInfoUnlimited: {
    enteredCharacters: string;
    goal: string;
    lfromChunk: number[];
  }[][] = ltoSentences.flatMap(([ltoSentence, ltoSentenceTokens]) => {
    const associations = ltoSentenceTokens.map((token, index) => ({
      association: itiriri(allAssociations.values())
        .filter(({ english }) => english[ltoSentence][0].includes(index))
        .first()!,
      token: token,
    }));

    const toEnter = associations.map(({ association, token }) => ({
      enteredCharacters:
        appState.enteredCharacters.get(association.french[0]) || "",
      goal: token.text,
      lfromChunk: association.french[0],
    }));

    if (
      toEnter.every(({ enteredCharacters, goal }) =>
        goal.startsWith(enteredCharacters)
      )
    ) {
      return [toEnter];
    }
    return [];
  });

  const findTokensCorrectlyEntered = (
    ltoAnswer: {
      enteredCharacters: string;
      goal: string;
    }[]
  ) =>
    _.takeWhile(
      ltoAnswer,
      ({ enteredCharacters, goal }) => enteredCharacters == goal
    ).length;

  const tokensCorrectlyEntered = _.max(
    ltoInfoUnlimited.map((ltoAnswer) => findTokensCorrectlyEntered(ltoAnswer))
  )!;

  const ltoInfo = ltoInfoUnlimited.filter(
    (ltoAnswer) =>
      findTokensCorrectlyEntered(ltoAnswer) === tokensCorrectlyEntered
  );

  if (
    ltoInfo.some((ltoAnswer) => tokensCorrectlyEntered === ltoAnswer.length)
  ) {
    return <Text>no code for this part yet :3</Text>;
  }

  const possibleNextTokens = ltoInfo.map(
    (ltoAnswer) => ltoAnswer[tokensCorrectlyEntered]
  );

  // I *think* all the `lfromChunk`s should be equal but I'm not totally sure this is the case
  // This should check to make sure I didn't mess it up
  console.assert(
    possibleNextTokens.every(({ lfromChunk }) =>
      _.isEqual(lfromChunk, possibleNextTokens[0].lfromChunk)
    )
  );

  const lfromChunk = possibleNextTokens[0].lfromChunk;

  const possibleNextCharacters = _.uniq(
    possibleNextTokens.map(
      ({ enteredCharacters, goal }) =>
        goal.substring(enteredCharacters.length)[0]!
    )
  );

  const ltoAnswer = ltoInfo[0]!;

  const letters = shuffleSeed.shuffle(
    possibleNextCharacters
      .map((letter) => ({
        text: letter,
        onPress: () => {
          setAppState(
            produce(appState, (draftState) => {
              const previous =
                draftState.enteredCharacters.get(lfromChunk) || "";
              draftState.enteredCharacters.set(lfromChunk, previous + letter);
            })
          );
        },
      }))
      .concat(
        _.range(4).map((_i) => ({
          text: ":",
          onPress: () => {},
        }))
      ),
    _.toString(
      tokensCorrectlyEntered +
        100 * ltoAnswer[tokensCorrectlyEntered].enteredCharacters.length
    )
  );

  return (
    <Container
      imageLight={require("../assets/images/france/franceLight.jpg")}
      imageDark={require("../assets/images/france/franceDark.jpg")}
    >
      <Question sentenceTokens={sentenceInfo.tokens} lfromChunk={lfromChunk} />
      <AnswerView
        enteredCharacters={ltoAnswer}
        tokensCorrectlyEntered={tokensCorrectlyEntered}
      />
      <Buttons letters={letters} />
    </Container>
  );
};

export default ReviewScreen;

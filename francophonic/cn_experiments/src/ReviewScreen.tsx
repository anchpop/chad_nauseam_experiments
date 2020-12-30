import * as React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import produce from "immer";

import * as _ from "lodash";

import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

import Container from "./components/Container";
import Button from "./components/Button";

import useStyle from "./styles";

import wordAssociations, {
  ParseRoot,
  ParseNode,
  AssociationInfo,
  SentenceTokens,
  ParseNodes,
} from "./data/wordAssociations";
import { frenchContractions } from "./data/worddictionary";

interface ReviewState {
  enteredCharacters: { [key: number]: string };
}

const initialReviewState: () => ReviewState = () => ({
  enteredCharacters: {},
});

const playSound = async () => {
  const soundObject = new Audio.Sound();
  await soundObject.loadAsync(
    require("../assets/audio/french/0a4b44e806c056eb8769a97e5bdf560ee01fb821e93c5196910a0c944207f1ecfr-FR-Wavenet-C.mp3")
  );
  await soundObject.playAsync();
};

const Question = ({ sentenceTokens }: { sentenceTokens: SentenceTokens }) => {
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
                <Text>{text}</Text>
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
}: {
  enteredCharacters: { entered: string; goal: string }[];
}) => {
  const { reviewPageStyles } = useStyle();
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {enteredCharacters.map(({ entered, goal }, index) => (
        <View key={index}>
          <Text style={reviewPageStyles.answerBox}>
            <Text style={reviewPageStyles.answerText}>{entered}</Text>
            <Text style={reviewPageStyles.invisAnswerText}>
              {goal.substring(entered.length, goal.length)}
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
    <View style={{ flex: 1, flexDirection: "row" }}>
      {letters.map(({ text, onPress }, index) => (
        <TouchableOpacity key={index} onPress={onPress}>
          <View style={reviewPageStyles.answerBox}>
            <Text style={reviewPageStyles.answerText}>{text}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const findNodesAssociations = (
  index: number,
  parseNodesRoot: ParseNodes
): { french: number[][]; english: { [key: string]: number[][] } } => {
  const findNode = (
    node: ParseNode
  ): { french: number[][]; english: { [key: string]: number[][] } } => {
    const parts = Object.entries(node.info)
      .map(([_, p]) => {
        if (p.french.includes(index)) {
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

const ReviewScreen = () => {
  const { reviewPageStyles } = useStyle();

  const [_s, sentenceInfo] = Object.entries(wordAssociations.parseTrees)[0];

  const [appState, setAppState] = React.useState(initialReviewState());

  const engSentenceSelected: string = Object.entries(
    sentenceInfo.tokens.tokens_en
  )[0][0];

  const possump = findNodesAssociations(1, sentenceInfo.parse);

  const allAssociations = _.range(
    sentenceInfo.tokens.tokens_fr.length
  ).map((i) => findNodesAssociations(i, sentenceInfo.parse));

  const enteredCharactersObj = allAssociations
    .map((possum, frenchIndex) => {
      const englishIndex = possum.english[engSentenceSelected][0][0];
      console.log(sentenceInfo.tokens.tokens_en[engSentenceSelected]);
      return {
        [englishIndex]: {
          entered: appState.enteredCharacters[frenchIndex] || "",
          goal:
            sentenceInfo.tokens.tokens_en[engSentenceSelected][englishIndex]
              .text,
        },
      };
    })
    .reduce((x, acc) => ({ ...x, ...acc }));
  const enteredCharacters = _.range(
    Object.keys(enteredCharactersObj).length
  ).map((i) => enteredCharactersObj[i]);

  return (
    <Container
      imageLight={require("../assets/images/france/franceLight.jpg")}
      imageDark={require("../assets/images/france/franceDark.jpg")}
    >
      <Question sentenceTokens={sentenceInfo.tokens} />
      <AnswerView enteredCharacters={enteredCharacters} />
      <Buttons
        letters={[
          {
            text: '"',
            onPress: () => {
              setAppState(
                produce(appState, (draftState) => {
                  draftState.enteredCharacters[0] =
                    (draftState.enteredCharacters[0] || "") + '"';
                })
              );
            },
          },
        ]}
      />
    </Container>
  );
};

export default ReviewScreen;

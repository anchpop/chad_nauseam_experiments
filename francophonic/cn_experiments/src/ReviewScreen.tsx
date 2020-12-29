import * as React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

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
  letters: { text: string; correct: boolean }[];
}) => {
  const { reviewPageStyles } = useStyle();
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {letters.map(({ text, correct }, index) => (
        <TouchableOpacity key={index}>
          <View style={reviewPageStyles.answerBox}>
            <Text style={reviewPageStyles.answerText}>{text}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const ReviewScreen = () => {
  const [currentInput, setCurrentInput] = React.useState("");
  const { reviewPageStyles } = useStyle();

  const [_, sentenceInfo] = Object.entries(wordAssociations.parseTrees)[0];

  const [enteredCharacters, setEnteredCharacters] = React.useState<
    { entered: string; goal: string }[]
  >(
    Object.entries(sentenceInfo.tokens.tokens_en)[0][1].map(({ text }) => ({
      entered: "",
      goal: text,
    }))
  );

  const [
    currentFocusedFrenchWord,
    setCurrentFocusedFrenchWord,
  ] = React.useState(0);

  return (
    <Container
      imageLight={require("../assets/images/france/franceLight.jpg")}
      imageDark={require("../assets/images/france/franceDark.jpg")}
    >
      <Question sentenceTokens={sentenceInfo.tokens} />
      <AnswerView enteredCharacters={enteredCharacters} />
      <Buttons letters={[{ text: '"', correct: true }]} />
    </Container>
  );
};

export default ReviewScreen;

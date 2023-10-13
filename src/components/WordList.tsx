import React from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { Card, Text } from "native-base";

/**
 * WordList component.
 *
 * A touchable card that displays a single word. The width of the card is
 * dynamically determined based on the screen width, ensuring that three
 * cards fit per row with adequate spacing. Words that are too long will
 * be truncated with an ellipsis.
 *
 * @param props - Contains the word to be displayed and all other standard TouchableOpacity properties.
 */
export function WordList({ word, ...rest }: Props): JSX.Element {
  // Calculate the column width based on screen size to fit three items per row
  const screenWidth = Dimensions.get("window").width;
  const columnWidth = screenWidth / 3 - 20;

  return (
    <TouchableOpacity {...rest}>
      <Card style={[styles.card, { width: columnWidth }]} bg="gray.500">
        <Text
          color="white"
          numberOfLines={1}
          ellipsizeMode="tail"
          fontSize="md"
        >
          {word}
        </Text>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 6, // Adequate spacing for the cards
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

type Props = TouchableOpacityProps & {
  word: string;
  isLoading?: boolean;
};

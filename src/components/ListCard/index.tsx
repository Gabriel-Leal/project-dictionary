import { HStack, Heading, Icon, Text } from "native-base";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { HistoryDTO } from "@dtos/HistoryDTO";

type Props = {
  content: string; // Either 'history' or another value to determine the right side of the card.
  data: HistoryDTO; // Data representing the history item.
  onPress?: () => void; // Optional press handler.
};

/**
 * ListCard component.
 *
 * This component displays a word from the user's history or favorites. It shows
 * the word on the left side, and on the right side it either displays the time
 * the word was added to the history, or a star icon if the word is a favorite.
 *
 * @param content - Determines the content on the right side of the card.
 * @param data - Data representing the history item.
 * @param onPress - Optional press handler.
 *
 */
export function ListCard({
  content,
  data,
  onPress,
  ...rest
}: Props): JSX.Element {
  /**
   * Convert the given datetime string to a formatted time string.
   *
   * @param dateTime - The datetime string in format "YYYY-MM-DD HH:MM:SS".
   *
   * @returns string - Formatted time string in format "HH:MM".
   */
  function convertToDesiredFormat(dateTime: string): string {
    const [, time] = dateTime.split(" ");
    const [hour, minute] = time.split(":");
    return `${hour}:${minute}`;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      {...rest}
      activeOpacity={content === "history" ? 1 : 0}
    >
      <HStack
        w="full"
        px={5}
        py={4}
        mb={3}
        bg="gray.600"
        rounded="md"
        alignItems="center"
        justifyContent="space-between"
        mr={5}
      >
        <Heading
          flex={1}
          color="white"
          fontSize="md"
          fontFamily="heading"
          textTransform="capitalize"
          numberOfLines={1}
        >
          {data.word}
        </Heading>
        <Text color="gray.300" fontSize="md">
          {content === "history" ? (
            convertToDesiredFormat(data.created_at)
          ) : (
            <Icon as={AntDesign} name="star" color="yellow.500" size={6} />
          )}
        </Text>
      </HStack>
    </TouchableOpacity>
  );
}

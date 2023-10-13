// Import necessary libraries and components
import { useCallback, useEffect, useState } from "react";
import {
  Heading,
  VStack,
  SectionList,
  ScrollView,
  Text,
  useToast,
  View,
  Center,
  Flex,
} from "native-base";
import { ScreenHeader } from "@components/ScreenHeader";
import { ListCard } from "@components/ListCard";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Loading } from "@components/Loading";
import { HistoryByDayDTO, Word, Section } from "@dtos/HistoryByDayDTO";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { Dimensions } from "react-native";
import { useAuth } from "@hooks/useAuth";
import { transformData } from "@utils/transformData"; // Importing the transformData function

// Define the props type for the component
type Props = {
  data: HistoryByDayDTO;
};

// Define the interface for route parameters
interface WordRouteParams {
  selectedWord: string;
  hideButtonWhenIsFavorite: boolean;
}

// Declaration of the Favorite component
export function Favorite({ data }: Props) {
  // State to control loading
  const [isLoading, setIsLoading] = useState(true);
  // State to store favorite words in sections
  const [words, setWords] = useState<Section[]>([]); // Changing the type to Section[]
  // Toast is a component for displaying messages on the screen
  const toast = useToast();
  // Hook to get information about the authenticated user
  const { user } = useAuth();
  // Navigation hook
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  // Function to fetch the history of favorite words
  async function fetchHistory() {
    try {
      // Set loading to true
      setIsLoading(true);
      // Make an API call to get the user's favorite words
      const response = await api.getFavorites({ user_id: user.id });

      // Use the transformData function to format the response data
      const transformedWords = transformData(response);

      // Set the formatted words in the state
      setWords(transformedWords);
    } catch (error) {
      // Error handling in case of API call failure
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Unable to load favorites.";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      // Set loading to false
      setIsLoading(false);
    }
  }

  // Function to open the word details screen
  const handleOpenWordDetails = (word: string) => {
    const params: WordRouteParams = {
      selectedWord: word,
      hideButtonWhenIsFavorite: true,
    };
    navigation.navigate("word", params);
  };

  // Function to register a word in the history and open details
  async function handleWordHistoryRegister(word: string) {
    try {
      // Make an API call to register the word in the history
      await api.sendHistory({
        word,
        user_id: Number(user.id),
      });
      // Open the word details screen
      handleOpenWordDetails(word);
    } catch (error) {
      const isAppError = error instanceof AppError;
      // Error handling, if necessary
    }
  }

  // UseFocusEffect hook to fetch history when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  // Empty useEffect for observation purposes
  useEffect(() => {}, [words]);

  // Get the window's height
  const { height } = Dimensions.get("window");
  // Define the percentage of top margin
  const marginTopPercentage = 0.3;
  // Calculate the value of top margin based on the window's height
  const marginTop = height * marginTopPercentage;

  // Render the component
  return (
    <VStack flex={1}>
      {/* Header component of the screen */}
      <ScreenHeader title="Favorite words" />
      {isLoading ? (
        // Display a loading component if isLoading is true
        <Loading />
      ) : (
        // Render the list of sections of favorite words
        <SectionList
          sections={words} // Using the words variable directly
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            // Render a favorite word card component
            <ListCard
              content="favorite"
              data={item}
              onPress={() => handleWordHistoryRegister(item.word)}
            />
          )}
          renderSectionHeader={({ section }) => (
            // Render a section header with date title
            <Heading
              color="gray.200"
              fontSize="md"
              fontFamily="heading"
              mt={8}
              mb={3}
            >
              {section.title}
            </Heading>
          )}
          px={8}
          // Empty list component when there are no favorite words
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: marginTop,
              }}
            >
              <Text color="gray.100" textAlign="center">
                There are no words in the favorites. {"\n"} Search for words on
                the main page.
              </Text>
            </View>
          )}
        />
      )}
    </VStack>
  );
}

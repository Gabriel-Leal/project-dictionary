import React, { useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { VStack, Text, HStack, Heading, FlatList, Spinner } from "native-base";
import { HomeHeader } from "@components/HomeHeader";
import { WordList } from "@components/WordList";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { usePagination } from "./../../hooks/usePagination";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { AuthContext } from "@contexts/AuthContext";
import { useAuth } from "@hooks/useAuth";

interface WordRouteParams {
  selectedWord: string;
}

export function Home() {
  // Access the authenticated user from the AuthContext using useAuth
  const { user } = useAuth();

  // State to store the word list and loading status
  const [wordList, setWordList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Navigation instance
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  // Access the fetchWords function from the AuthContext
  const { fetchWords } = useContext(AuthContext);

  // Pagination setup
  const { visibleData, loadingMore, handleLoadMoreData, setScrollOffset } =
    usePagination<string>(wordList);

  // Function to open the details of a word
  const handleOpenWordDetails = (word: string) => {
    const params: WordRouteParams = {
      selectedWord: word,
    };
    navigation.navigate("word", params);
    setIsLoading(false);
  };

  // Function to handle registering a word in the user's history
  async function handleWordHistoryRegister(word: string) {
    setIsLoading(true);
    try {
      // Send a history request to the API
      const response = await api.sendHistory({
        word,
        user_id: Number(user.id),
      });

      // Open the details of the word after successfully registering
      handleOpenWordDetails(word);
    } catch (error) {
      const isAppError = error instanceof AppError;
      // Handle errors here if needed
    } finally {
      setIsLoading(false);
    }
  }

  // Function to load words from the user's data
  async function loadWords() {
    try {
      // Fetch words using the fetchWords function from AuthContext
      const response = await fetchWords();

      // Extract and set the words from the response
      const words = response.map((item: { word: string }) => item.word);
      setWordList(words);
    } catch (error) {
      console.error("Houve um erro ao buscar as palavras:", error);
    }
  }

  // Fetch words when the component mounts
  useEffect(() => {
    loadWords();
  }, []);

  return (
    <VStack flex={1}>
      <HomeHeader />

      <VStack px={8} pt={4} mb={5}>
        <HStack justifyContent="space-between">
          <Heading color="gray.200" fontSize="md" fontFamily="heading">
            Words
          </Heading>

          {/* Display the count of words in the list */}
          <Text color="gray.200" fontSize="sm">
            {wordList.length}
          </Text>
        </HStack>
      </VStack>

      {/* FlatList to display words */}
      <FlatList
        data={visibleData}
        keyExtractor={(item: string) => item}
        renderItem={({ item }) => (
          <WordList
            word={item}
            onPress={() => handleWordHistoryRegister(item)}
            isLoading={isLoading}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
        onEndReached={handleLoadMoreData}
        onEndReachedThreshold={0.1}
        onScroll={({ nativeEvent }) =>
          setScrollOffset(nativeEvent.contentOffset.y)
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerContainer}>
              <Spinner color="green.500" />
            </View>
          ) : null
        }
      />
    </VStack>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },

  footerContainer: {
    width: Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
});

import React, { useContext, useEffect, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  HStack,
  Heading,
  Icon,
  VStack,
  Box,
  Center,
  Text,
  Slider,
  ScrollView,
  useToast,
} from "native-base";
import { Feather, AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { Button } from "@components/Button";
import { api, dictionaryApi } from "@services/api";
import { Loading } from "@components/Loading";
import { AppError } from "@utils/AppError";
import { AuthContext } from "@contexts/AuthContext";
import { useAuth } from "@hooks/useAuth";

// Define interfaces
interface WordRouteParams {
  selectedWord: string;
  hideButtonWhenIsFavorite: boolean;
}
type ResponseItem = {
  word: string;
  favorite: string;
  updated_at?: string;
};
type WordListItem = { word: string; favorite: string };
interface WordDetail {
  word: string;
  phonetic: string;
  phonetics: Phonetics[];
  meanings: Meaning[];
}
interface Phonetics {
  audio?: string;
}
interface Definition {
  definition: string;
}
interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export function Word() {
  // Define states and references
  const { user } = useAuth();
  const [sound, setSound] = useState<Audio.Sound | null | undefined>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wordDetails, setWordDetails] = useState<WordDetail | null>(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSendingDataToHistoryPrevious, setIsSendingDataToHistoryPrevious] =
    useState(false);
  const [isSendingDataToHistoryNext, setIsSendingDataToHistoryNext] =
    useState(false);
  const [wordCache, setWordCache] = useState<{ [key: string]: any }>({});

  const isFirstCall = useRef(true);
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute();
  const { selectedWord, hideButtonWhenIsFavorite } =
    route.params as WordRouteParams;
  const [hideButtonFavorite, setHideButtonFavorite] = useState(false);
  const [selectedWordsList, setSelectedWordsList] = useState<WordListItem[]>(
    []
  );

  const audioUrl = wordDetails?.phonetics?.[0]?.audio;
  const meaning = wordDetails?.meanings[0]?.definitions[0]?.definition
    ? wordDetails?.meanings[0]?.definitions[0]?.definition
    : "Sorry, we couldn't find definitions for the word you were looking for.";
  const word = wordDetails?.word ? wordDetails?.word : "No Word Found";
  const phonetic = wordDetails?.phonetic ? wordDetails?.phonetic : "";

  // Define functions
  const handleGoBack = () => navigation.goBack();

  const handleAudioPlay = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.positionMillis === status.durationMillis) {
        await sound.stopAsync();
        await sound.playAsync();
      } else if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else {
      const { sound: audioSound } = await Audio.Sound.createAsync({
        uri: audioUrl as string,
      });
      setSound(audioSound);
      await audioSound.playAsync();
      setIsPlaying(true);
      audioSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setDuration(status.durationMillis || 0);
          setPosition(status.positionMillis || 0);
          setIsPlaying(status.isPlaying);
          if (status.didJustFinish) {
            setPosition(0);
            setIsPlaying(false);
            audioSound.unloadAsync();
            setSound(null);
          }
        }
      });
    }
  };

  const handleSliderValueChange = async (event: any) => {
    const newPosition = event.value * duration;
    if (sound) {
      await sound.setPositionAsync(newPosition);
      setPosition(newPosition);
    }
  };

  const fetchWordDetails = async () => {
    try {
      if (isFirstCall.current) {
        setLoading(true);
      }

      if (wordCache[selectedWord]) {
        setWordDetails(wordCache[selectedWord]);
        if (isFirstCall.current) {
          setLoading(false);
          isFirstCall.current = false;
        }
        return;
      }
      try {
        const response = await dictionaryApi.get(`/${selectedWord}`);
        setWordDetails(response.data[0]);
        setWordCache((prevCache) => ({
          ...prevCache,
          [selectedWord]: response.data[0],
        }));

        if (isFirstCall.current) {
          setLoading(false);
          isFirstCall.current = false;
        }
      } catch (error: any) {
        if (error && error?.response) {
          setWordDetails(null);
          setWordCache((prevCache) => ({
            ...prevCache,
            [selectedWord]: null,
          }));

          if (isFirstCall.current) {
            setLoading(false);
            isFirstCall.current = false;
          }
        } else if (error instanceof AppError) {
          // If it's a custom error
          console.log("Custom error:", error?.message);
        } else {
          // Other errors
          console.log("Unknown error:", error?.message || "Unknown error");
        }
      }
    } catch (error) {
      console.error("Error fetching word details:", error);
      if (isFirstCall.current) {
        setLoading(false);
        isFirstCall.current = false;
      }
    }
  };

  const handleNextWord = () => {
    const currentIndex = selectedWordsList.findIndex(
      (item) => item.word === selectedWord
    );
    if (currentIndex < selectedWordsList.length - 1) {
      const nextWord = selectedWordsList[currentIndex + 1];
      navigation.setParams({ selectedWord: nextWord.word } as any);
    }
  };

  const handlePreviousWord = () => {
    const currentIndex = selectedWordsList.findIndex(
      (item) => item.word === selectedWord
    );
    if (currentIndex > 0) {
      const previousWord = selectedWordsList[currentIndex - 1];
      navigation.setParams({ selectedWord: previousWord.word } as any);
    }
  };

  // Define constants
  const currentIndex = selectedWordsList.findIndex(
    (item) => item.word === selectedWord
  );
  const disablePrevious = currentIndex === 0;
  const disableNext = currentIndex === selectedWordsList.length - 1;
  const favorite = selectedWordsList.find((item) => item.word === selectedWord);

  const [isFavorite, setIsFavorite] = useState(false);
  const toast = useToast();

  function getPreviousWord(word: string, wordsList: { word: string }[]) {
    const currentIndex = wordsList.findIndex((item) => item.word === word);
    if (currentIndex <= 0) {
      return null;
    }
    return wordsList[currentIndex - 1].word;
  }

  function getNextWord(word: string, wordsList: { word: string }[]) {
    const currentIndex = wordsList.findIndex((item) => item.word === word);
    if (currentIndex === -1 || currentIndex === wordsList.length - 1) {
      return null;
    }
    return wordsList[currentIndex + 1].word;
  }

  // Handle word history registration for previous word
  async function handleWordHistoryRegisterPrevious(word: string) {
    setIsSendingDataToHistoryPrevious(true);
    try {
      const previousWord = getPreviousWord(word, selectedWordsList);
      if (previousWord !== null) {
        await api.sendHistory({
          word: previousWord,
          user_id: Number(user.id),
        });
      }
      handlePreviousWord();
    } catch (error) {
      const isAppError = error instanceof AppError;
      console.log(isAppError);
    } finally {
      setIsSendingDataToHistoryPrevious(false);
    }
  }

  // Handle word history registration for next word
  async function handleWordHistoryRegisterNext(word: string) {
    setIsSendingDataToHistoryNext(true);

    try {
      const nextWord = getNextWord(word, selectedWordsList);
      if (nextWord !== null) {
        await api.sendHistory({
          word: nextWord,
          user_id: Number(user.id),
        });
      }
      handleNextWord();
    } catch (error) {
      const isAppError = error instanceof AppError;
      console.log(isAppError);
    } finally {
      setIsSendingDataToHistoryNext(false);
    }
  }

  // Send word to the backend for favorite update
  async function sendWordToBackend(data: {
    word: string;
    favorite: string;
    user_id: number;
  }) {
    try {
      await api.sendFavoriteUpdate(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Unable to send the word. Please try again later.";
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  // Handle favorite icon click
  const handleIconClick = () => {
    // Invert the value of isFavorite
    setIsFavorite((prev) => !prev);

    // Update the value in selectedWordsList
    const wordIndex = selectedWordsList.findIndex(
      (item) => item.word === selectedWord
    );
    if (wordIndex !== -1) {
      const updatedFavorite = isFavorite ? "N" : "Y";
      selectedWordsList[wordIndex].favorite = updatedFavorite;

      // Prepare the object to send to the backend
      const wordToSend = {
        word: selectedWordsList[wordIndex].word,
        favorite: updatedFavorite,
        user_id: Number(user.id),
      };

      // Send the object to the backend
      sendWordToBackend(wordToSend);
    }
  };

  // Load words from the backend
  const { fetchWords } = useContext(AuthContext);
  const loadWords = async function () {
    try {
      const response: any = await fetchWords();

      const extractWordAndFavorite = (responseArray: ResponseItem[]) => {
        return responseArray.map((item) => ({
          word: item.word,
          favorite: item.favorite,
        }));
      };

      setSelectedWordsList(extractWordAndFavorite(response));
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  // Fetch word details and load words on component mount
  useEffect(() => {
    setHideButtonFavorite(hideButtonWhenIsFavorite);
    fetchWordDetails();
    loadWords();
  }, [selectedWord, hideButtonWhenIsFavorite]);

  // Render loading spinner while data is being fetched
  if (loading) return <Loading />;

  return (
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
        </TouchableOpacity>
        <HStack justifyContent="space-between" mt={4} mb={8}>
          <Heading
            color="gray.100"
            fontSize="lg"
            fontFamily="heading"
            flexShrink={1}
          >
            {selectedWord}
          </Heading>
          {favorite?.favorite === "N" ? (
            <Icon
              as={AntDesign}
              name="staro"
              color="green.500"
              size={8}
              onPress={handleIconClick}
            />
          ) : (
            <Icon
              as={AntDesign}
              name="star"
              color="yellow.500"
              size={8}
              onPress={handleIconClick}
            />
          )}
        </HStack>
      </VStack>
      <ScrollView>
        <Box
          bg="gray.400"
          p="100"
          m="2"
          mt={4}
          mb={8}
          rounded="xl"
          _text={{
            fontSize: "md",
            fontWeight: "medium",
            color: "warmGray.50",
            textAlign: "center",
          }}
        >
          <Center>
            <VStack alignItems="center">
              <Heading color="gray.100" fontSize="lg" fontFamily="heading">
                {word}
              </Heading>
              <Text color="gray.200">{phonetic}</Text>
            </VStack>
          </Center>
        </Box>
        <HStack alignItems="center" px={2} mb={8}>
          <TouchableOpacity
            onPress={handleAudioPlay}
            disabled={!audioUrl}
            style={{ opacity: !audioUrl ? 0.5 : 1 }}
          >
            <Icon
              as={AntDesign}
              name={isPlaying ? "pause" : "caretright"}
              color="green.500"
              size={8}
            />
          </TouchableOpacity>
          <Box alignItems="center" w="100%">
            <Slider
              defaultValue={0}
              value={duration !== 0 ? position / duration : 0}
              onChangeEnd={(value) => handleSliderValueChange(value)}
              minValue={0}
              maxValue={1}
              step={0.01}
              maxW="80%"
            >
              <Slider.Track bg="gray.200">
                <Slider.FilledTrack bg="#00B37E" />
              </Slider.Track>
              <Slider.Thumb
                size={6}
                borderColor="transparent"
                borderWidth={0}
                bg="#00B37E"
                style={{ opacity: !audioUrl ? 0.5 : 1 }}
              />
            </Slider>
          </Box>
        </HStack>
        <VStack px={2} mb={8}>
          <Heading color="gray.100" fontSize="lg" fontFamily="heading">
            Meanings
          </Heading>
          <Text color="gray.100">{meaning}</Text>
        </VStack>
      </ScrollView>
      {!hideButtonFavorite ? (
        <VStack bg="gray.500" p={4}>
          <HStack px={2} space={4} alignItems="center" w="50%">
            <Button
              title="Previous"
              onPress={() => handleWordHistoryRegisterPrevious(word as string)}
              disabled={disablePrevious}
              style={{ opacity: disablePrevious ? 0.5 : 1 }}
              isLoading={isSendingDataToHistoryPrevious}
            />
            <Button
              title="Next"
              onPress={() => handleWordHistoryRegisterNext(word as string)}
              disabled={disableNext}
              style={{ opacity: disableNext ? 0.5 : 1 }}
              isLoading={isSendingDataToHistoryNext}
            />
          </HStack>
        </VStack>
      ) : (
        ""
      )}
    </VStack>
  );
}

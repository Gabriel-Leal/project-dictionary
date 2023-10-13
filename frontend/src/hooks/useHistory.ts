import { useState, useCallback } from "react";
import { useToast } from "native-base"; // Importing the useToast hook from native-base
import { api } from "@services/api"; // Importing the api service
import { AppError } from "@utils/AppError"; // Importing the AppError utility
import { Word, HistoryByDayDTO } from "@dtos/HistoryByDayDTO"; // Importing data types from HistoryByDayDTO
import { useFocusEffect } from "@react-navigation/native"; // Importing the useFocusEffect hook from react-navigation/native

export function useHistory(userId: number) {
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [words, setWords] = useState<HistoryByDayDTO[]>([]); // State to store historical word data
  const toast = useToast(); // Using the toast hook for displaying messages

  // Function to transform raw word data into grouped sections by date
  const transformData = (words: Word[]): { title: string; data: Word[] }[] => {
    const grouped: Record<string, Word[]> = {};

    words.forEach((word) => {
      const date = word.created_at.split(" ")[0]; // Extracting the date part from created_at
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(word);
    });

    return Object.keys(grouped).map((date) => ({
      title: date, // Section title is the date
      data: grouped[date], // Data contains words for that date
    }));
  };

  // Function to fetch historical word data
  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true); // Set loading to true while fetching data
      const response = await api.getHistory({ user_id: userId }); // Fetch historical data from the API
      const transformedWords = transformData(response); // Transform raw data into grouped sections
      setWords(transformedWords); // Set the transformed data in state
    } catch (error) {
      const isAppError = error instanceof AppError; // Check if the error is an AppError
      const title = isAppError
        ? error.message
        : "Não foi possível carregar o historico."; // Set an appropriate error message
      toast.show({
        title, // Display the error message using a toast
        placement: "top", // Display the toast at the top
        bgColor: "red.500", // Red background color for error messages
      });
    } finally {
      setIsLoading(false); // Set loading to false when the operation is completed
    }
  }, [userId, toast]);

  // Use the useFocusEffect hook to fetch history when the component is focused
  useFocusEffect(
    useCallback(() => {
      fetchHistory(); // Call the fetchHistory function when focused
    }, [fetchHistory])
  );

  return { isLoading, words }; // Return the loading status and historical word data
}

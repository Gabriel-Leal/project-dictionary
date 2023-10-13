// Represents a general section structure with a title and associated data
export interface Section {
  title: string;
  data: Word[];
}

// Represents a word entity with its attributes
export type Word = {
  id: number; // Unique identifier for the word
  word: string; // Actual word content
  created_at: string; // Timestamp when the word was created
};

// Represents word data grouped by day for history purposes
export type HistoryByDayDTO = {
  title: string; // The day when the words were created
  data: Word[]; // List of words created on the given day
};

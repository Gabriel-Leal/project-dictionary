// Represents an entry in the user's word history
export type HistoryDTO = {
  id: number; // Unique identifier for the history entry
  word: string; // The word that was searched or saved
  created_at: string; // Timestamp when the entry was added to history
};

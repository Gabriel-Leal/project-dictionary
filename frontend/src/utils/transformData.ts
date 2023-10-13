// Define the type OriginalWord to represent the structure of the input data.
type OriginalWord = {
  favorite: string;
  updated_at: string;
  word: string;
};

// Define the type TransformedWord to represent the structure of the transformed data.
type TransformedWord = {
  created_at: string;
  id: number;
  word: string;
  favorite: string;
};

// Define the type TransformedData to represent the final transformed data structure.
type TransformedData = {
  title: string;
  data: TransformedWord[];
};

// Export the transformData function, which takes an array of OriginalWord objects as input
// and returns an array of TransformedData objects.
export const transformData = (words: OriginalWord[]): TransformedData[] => {
  // Create an empty object called grouped to store the transformed data.
  const grouped: Record<string, TransformedWord[]> = {};

  // Loop through each OriginalWord object in the input array.
  words.forEach((word, index) => {
    // Extract the date part from the updated_at property.
    const date = word.updated_at.split(" ")[0];

    // If the date is not present in the grouped object, initialize it as an empty array.
    if (!grouped[date]) {
      grouped[date] = [];
    }

    // Push a new TransformedWord object into the corresponding date's array.
    // This object is created by mapping the properties from OriginalWord to TransformedWord.
    grouped[date].push({
      created_at: word.updated_at,
      id: index + 1, // The id is a placeholder here, you can adjust it as needed.
      word: word.word,
      favorite: word.favorite,
    });
  });

  // Finally, convert the grouped object into an array of TransformedData objects.
  const transformedDataArray = Object.keys(grouped).map((date) => ({
    title: date,
    data: grouped[date],
  }));

  // Return the array of TransformedData.
  return transformedDataArray;
};

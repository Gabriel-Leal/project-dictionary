import { Spinner, Center } from "native-base";

/**
 * Loading component.
 *
 * This component provides a visual indication when a loading state is active.
 * It centers a spinner icon on the screen with a background color.
 *
 */
export const Loading = (): JSX.Element => {
  return (
    <Center flex={1} bg="gray.700">
      <Spinner color="green.500" />
    </Center>
  );
};

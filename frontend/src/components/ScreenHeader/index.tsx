import { Center, Heading } from "native-base";

/**
 * ScreenHeader component.
 *
 * Represents a header for a screen. It centers the provided title in the middle
 * of a colored background. The heading has predefined styles, including
 * color, font size, and font family.
 *
 * @param props - Contains the title of the header.
 */
export function ScreenHeader({ title }: Props): JSX.Element {
  return (
    <Center bg="gray.600" pb={6} pt={16}>
      <Heading color="gray.100" fontSize="xl" fontFamily="heading">
        {title}
      </Heading>
    </Center>
  );
}

type Props = {
  title: string;
};

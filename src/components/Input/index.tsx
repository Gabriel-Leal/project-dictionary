import {
  Input as NativeBaseInput,
  IInputProps,
  FormControl,
} from "native-base";

type Props = IInputProps & {
  errorMessage?: string | null;
};

/**
 * Input component.
 *
 * This component extends the functionality of NativeBase's Input by adding
 * an error message capability. When an error message is provided, the input
 * field will display it below the input box, and the input's border will
 * turn red to indicate an error state.
 *
 * @param errorMessage - The error message to display. If null, no message will be shown.
 * @param rest - Any other props passed to the input component.
 *
 */
export function Input({
  errorMessage = null,
  isInvalid,
  ...rest
}: Props): JSX.Element {
  // Determine if the input is in an invalid state.
  const invalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseInput
        bg="gray.700"
        h={14}
        px={4}
        borderWidth={0}
        fontSize="md"
        color="white"
        fontFamily="body"
        isInvalid={invalid}
        _invalid={{
          borderWidth: 1,
          borderColor: "red.500",
        }}
        _focus={{
          bg: "gray.700",
          borderWidth: 1,
          borderColor: "green.500",
        }}
        {...rest}
      />
      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  );
}

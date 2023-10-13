import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";

/**
 * Props for the custom Button component.
 * It extends IButtonProps from native-base to inherit its properties.
 */
type Props = IButtonProps & {
  title: string; // Text to display on the button
  variant?: "solid" | "outline"; // Specifies the button style: solid or outlined
};

/**
 * Button component.
 *
 * A custom button that provides both solid and outline variants.
 * This component is built on top of the Button component from native-base.
 *
 * @param title - The text to display on the button.
 * @param variant - The button style. Can be either "solid" (default) or "outline".
 * @param rest - Rest of the properties that can be passed to the native-base Button.
 */
export function Button({
  title,
  variant = "solid",
  ...rest
}: Props): JSX.Element {
  return (
    <ButtonNativeBase
      w="full"
      h={14}
      bg={variant === "outline" ? "transparent" : "green.700"}
      borderWidth={variant === "outline" ? 1 : 0}
      borderColor="green.500"
      rounded="sm"
      _pressed={{
        bg: variant === "outline" ? "gray.500" : "green.500",
      }}
      {...rest}
    >
      <Text
        color={variant === "outline" ? "green.500" : "white"}
        fontFamily="heading"
        fontSize="sm"
      >
        {title}
      </Text>
    </ButtonNativeBase>
  );
}

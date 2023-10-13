import { Image, IImageProps } from "native-base";

/**
 * UserPhoto component.
 *
 * Represents a circular image ideal for user profile photos or avatars.
 * The component ensures a circular form with a border around the image.
 * The size of the image is customizable.
 *
 * @param props - Contains the size of the image and all other standard Image properties.
 */
export function UserPhoto({ size, ...rest }: Props): JSX.Element {
  return (
    <Image
      w={size}
      h={size}
      rounded="full"
      borderWidth={2}
      borderColor="gray.400"
      {...rest}
    />
  );
}

type Props = IImageProps & {
  size: number;
};

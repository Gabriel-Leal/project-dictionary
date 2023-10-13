import React, { useEffect, useState, useCallback } from "react";
import {
  Center,
  ScrollView,
  VStack,
  Skeleton,
  Text,
  Heading,
  useToast,
} from "native-base";
import { Alert, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "@hooks/useAuth";
import { api, axiosInstance } from "@services/api";
import { AppError } from "@utils/AppError";
import defaultUserPhotoImg from "@assets/userPhotoDefault.png";

// Constants
const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  confirm_password: string;
};

// Yup schema for form validation
const profileSchema = yup.object().shape({
  name: yup.string().required("Provide the name."),
  // ... rest of the schema ...
});

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  });

  // Handles profile updates
  const handleProfileUpdate = useCallback(
    async (data: FormDataProps) => {
      try {
        setIsUpdating(true);
        const userUpdated = { ...user, name: data.name };
        await api.updateUsers(data);
        await updateUserProfile(userUpdated);
        toast.show({
          title: "Profile updated successfully.",
          placement: "top",
          bgColor: "green.500",
        });
      } catch (error) {
        handleAppError(error);
      } finally {
        setIsUpdating(false);
      }
    },
    [user, updateUserProfile]
  );

  // Handles errors, shows appropriate toast messages
  const handleAppError = (error: any) => {
    const isAppError = error instanceof AppError;
    const title = isAppError ? error.message : "Unexpected error occurred.";
    toast.show({
      title,
      placement: "top",
      bgColor: "red.500",
    });
  };

  // Handles selecting a user photo from the device
  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true);
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });
      if (photoSelected.canceled) return;
      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        );

        const photoSize = (photoInfo as any).size;

        if (photoSize && photoSize / 1024 / 1024 > 5) {
          return toast.show({
            title: "This image is too large. You can upload up to 5MB.",
            placement: "top",
            bgColor: "red.500",
          });
        }

        const fileExtension = photoSelected.assets[0].uri.split(".").pop();

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append("avatar", photoFile);

        try {
          const avatarUpdatedResponse = await api.updateAvatar(
            userPhotoUploadForm
          );

          const userUpdated = user;
          userUpdated.avatar = avatarUpdatedResponse.avatar;

          updateUserProfile(userUpdated);

          toast.show({
            title: "Picture updated successfully",
            placement: "top",
            bgColor: "green.500",
          });
        } catch (error) {
          const isAppError = error instanceof AppError;
          const title = isAppError
            ? error.message
            : "It is not possible to upload the picture. Try again later.";
          toast.show({
            title,
            placement: "top",
            bgColor: "red.500",
          });
        }
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  useEffect(() => {}, []); // Empty dependency array

  return (
    <VStack flex={1}>
      <ScreenHeader title="Profile" />
      <ScrollView>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
              source={
                user.avatar
                  ? {
                      uri: `${axiosInstance.defaults.baseURL}/avatar/${user.avatar}`,
                    }
                  : defaultUserPhotoImg
              }
              alt="profile"
              size={PHOTO_SIZE}
            />
          )}
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              mt={2}
              mb={8}
            >
              Change photo
            </Text>
          </TouchableOpacity>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Name"
                bg="gray.600"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Email"
                bg="gray.600"
                isDisabled
                value={value}
              />
            )}
          />
        </Center>
        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" fontFamily="heading" mb={2}>
            Change password
          </Heading>
          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Old password"
                bg="gray.600"
                secureTextEntry
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="New password"
                bg="gray.600"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Confirm new password"
                bg="gray.600"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />
          <Button
            title="Update"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdating}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}

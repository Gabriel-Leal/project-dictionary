import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  VStack,
  Center,
  Text,
  Heading,
  ScrollView,
  useToast,
} from "native-base";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { api } from "@services/api";

import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";
import { useAuth } from "@hooks/useAuth";

// Define the form data structure for SignUp
type FormDataProps = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
};

// Define Yup schema for form validation
const signUpSchema = yup.object({
  name: yup.string().required("Provide your name."),
  email: yup.string().required("Provide your email.").email("Invalid email."),
  password: yup
    .string()
    .required("Provide your password.")
    .min(6, "The password must be at least 6 characters long."),
  confirm_password: yup
    .string()
    .required("Confirm your password.")
    .oneOf([yup.ref("password")], "Incorrect password."),
});

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { signIn } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema), // Apply the Yup validation resolver
  });

  const navigation = useNavigation();

  // Function to navigate back to the sign-in screen
  function handleGoBack() {
    navigation.goBack();
  }

  // Function to handle sign-up when the form is submitted
  async function handleSignUp({ name, email, password }: FormDataProps) {
    try {
      setIsLoading(true);

      // Make an API call to sign up the user
      await api.signUp(name, email, password);

      // Sign in the user after successful sign-up
      await signIn(email, password);
    } catch (error) {
      // Handle API or validation errors
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "It is not possible to create the account. Try again later.";

      // Display an error toast message
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsHorizontalScrollIndicator={false}
    >
      <VStack flex="1" px={10}>
        <Center my={24} fontSize="sm">
          <LogoSvg />
          <Text color="gray.100">Find your words</Text>
        </Center>
        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Create your account
          </Heading>

          {/* Name Input */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Name"
                autoCapitalize="none"
                onChangeText={onChange}
                errorMessage={errors.name?.message}
                bg="gray.600"
              />
            )}
          />

          {/* Email Input */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                bg="gray.600"
                errorMessage={errors.email?.message}
              />
            )}
          />

          {/* Password Input */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Password"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                bg="gray.600"
                errorMessage={errors.password?.message}
              />
            )}
          />

          {/* Confirm Password Input */}
          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirm password"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                bg="gray.600"
                errorMessage={errors.confirm_password?.message}
                onSubmitEditing={handleSubmit(handleSignUp)} // Submit form on "send" button press
                returnKeyLabel="send"
              />
            )}
          />

          {/* Register Button */}
          <Button
            title="Register"
            onPress={handleSubmit(handleSignUp)} // Handle form submission
            isLoading={isLoading}
          ></Button>
        </Center>

        {/* Back to Sign-In Button */}
        <Button
          title="Back to Sign In"
          variant="outline"
          mt={19}
          onPress={handleGoBack}
        ></Button>
      </VStack>
    </ScrollView>
  );
}

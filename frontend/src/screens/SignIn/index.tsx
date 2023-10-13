import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import {
  VStack,
  Image,
  Center,
  Text,
  Heading,
  ScrollView,
  useToast,
} from "native-base";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { useAuth } from "@hooks/useAuth";
import BackgroundImg from "@assets/background_books.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";

// Define form data structure for Sign In
type FormData = {
  email: string;
  password: string;
};

// Define Yup schema for form validation
const signInSchema = yup.object({
  email: yup
    .string()
    .required("Provide your email.")
    .email("Invalid email format."),
  password: yup.string().required("Provide your password."),
});

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const { signIn } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(signInSchema) });

  // Function to navigate to the sign-up screen
  function handleNewAccount() {
    navigation.navigate("signUp");
  }

  // Function to handle sign-in when the form is submitted
  async function handleSignIn({ email, password }: FormData) {
    try {
      setIsLoading(true);

      // Make an API call to sign in the user
      await signIn(email, password);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "It is not possible to sign in at this moment. Try again later.";

      setIsLoading(false);

      // Display an error toast message
      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
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
            Login to your account
          </Heading>

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

          {/* Sign In Button */}
          <Button
            title="Sign In"
            onPress={handleSubmit(handleSignIn)} // Handle form submission
            isLoading={isLoading}
          ></Button>
        </Center>

        <Center mt={24}>
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
            Create your account
          </Text>

          {/* Sign Up Button */}
          <Button
            title="Sign Up"
            variant="outline"
            onPress={handleNewAccount}
          ></Button>
        </Center>
      </VStack>
    </ScrollView>
  );
}

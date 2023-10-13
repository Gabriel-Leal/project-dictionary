import { Heading, VStack, SectionList, Text, View } from "native-base";
import { ScreenHeader } from "@components/ScreenHeader";
import { ListCard } from "@components/ListCard";
import { Loading } from "@components/Loading";
import { useHistory } from "@hooks/useHistory";
import { useAuth } from "@hooks/useAuth";
import { Dimensions } from "react-native";

export function History() {
  const { user } = useAuth();
  const { isLoading, words } = useHistory(user.id);

  const { height } = Dimensions.get("window");
  const marginTopPercentage = 0.3;
  const marginTop = height * marginTopPercentage;

  return (
    <VStack flex={1}>
      <ScreenHeader title="Words history" />
      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={words}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ListCard content="history" data={item} />}
          renderSectionHeader={({ section }) => (
            <Heading
              color="gray.200"
              fontSize="md"
              fontFamily="heading"
              mt={8}
              mb={3}
            >
              {section.title}
            </Heading>
          )}
          px={8}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: marginTop,
              }}
            >
              <Text color="gray.100" textAlign="center">
                There are no words in the history. {"\n"} Search the word on the
                main page
              </Text>
            </View>
          )}
        />
      )}
    </VStack>
  );
}

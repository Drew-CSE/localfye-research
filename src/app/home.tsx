import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import GemMap from "@/components/gem-map";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  // Read the username that the Login screen passed as a route parameter.
  const { username } = useLocalSearchParams<{ username?: string | string[] }>();
  const displayUsername = Array.isArray(username) ? username[0] : username;

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <Stack.Screen options={{ title: displayUsername?.trim() || "Guest" }} />
      <GemMap />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#ffffff",
  },
});

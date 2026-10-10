import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  // Read the username that the Login screen passed as a route parameter.
  const { username } = useLocalSearchParams<{ username?: string | string[] }>();
  const displayUsername = Array.isArray(username) ? username[0] : username;

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <Text style={styles.username}>{displayUsername?.trim() || "Guest"}</Text>
      <View style={styles.content}>
        <Text>Welcome to Localfye!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#ffffff",
  },
  username: {
    fontSize: 24,
    fontWeight: "600",
    color: "#222222",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

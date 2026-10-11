import { StyleSheet, Text, View } from "react-native";

// A native map can be added here when we return to testing on a phone.
export default function GemMap() {
  return (
    <View style={styles.container}>
      <Text>The map is currently available in the browser version of Localfye.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});

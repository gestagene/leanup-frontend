import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.notificationButtonInner}>
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={38}
            color="#EEEEEE"
          />
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greetingsContainer}>
          <Text style={styles.greetingsText}>Good morning, Gene.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d1d1d",
  },
  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 18,
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  greetingsContainer: {
    backgroundColor: "#212121",
    padding: 16,
    minWidth: 0,
    justifyContent: "center",
    borderRadius: 10,
  },
  greetingsText: {
    color: "#EEEEEE",
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 0.8,
    flexShrink: 1,
  },
  notificationButton: {
    flex: 1,
    alignItems: "flex-end",
  },
  notificationButtonInner: {
    borderRadius: 100,
    padding: 7,
  },
});

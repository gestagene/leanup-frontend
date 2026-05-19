import Header from "@/components/Header";
import { colors } from "@/constants/colorscheme";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Analytics() {
  return (
    <SafeAreaView style={styles.container}>
      <Header content={"Analytics"} />
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.headerText}>PLACEHOLDER</Text>
          <View
            style={{
              borderBottomWidth: 0.5,
              borderColor: "#ffffff",
              opacity: 0.5,
              width: "50%",
              height: 1,
            }}
          ></View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  main: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 2,
    minHeight: "100%",
  },
  header: {
    flexDirection: "column",
    marginTop: 12,
    marginBottom: 16,
    alignItems: "center",
    gap: 6,
  },
  headerText: {
    fontWeight: "900",
    fontSize: 16,
    color: "#ffffff",
    letterSpacing: 0.5,
  },
});

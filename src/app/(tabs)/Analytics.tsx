import Header from "@/components/Header";
import { colors } from "@/constants/colorscheme";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Analytics() {
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Header content={"Analytics"} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingVertical: 2,
          paddingBottom: 32,
          backgroundColor: colors.primary,
          minHeight: "100%",
        }}
        style={styles.main}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Performance Snapshot</Text>
        </View>
        <View style={styles.card}></View>
        <View
          style={[
            styles.section,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.text}>
            Tip: Lorem Ipsum Dolem Sahur
          </Text>
        </View>
        <View style={styles.grid}>
          <View style={styles.gridCard}>
            <Text style={[styles.text, { fontWeight: "700" }]}>
              Avg. Calories
            </Text>
          </View>
          <View style={styles.gridCard}>
            <Text style={[styles.text, { fontWeight: "700" }]}>
              Avg. Protein
            </Text>
          </View>
          <View style={styles.gridCard}>
            <Text style={[styles.text, { fontWeight: "700" }]}>
              Workout Frequency
            </Text>
          </View>
          <View style={styles.gridCard}>
            <Text style={[styles.text, { fontWeight: "700" }]}>Steps</Text>
          </View>
        </View>
        <View
          style={[
            styles.section,
            { gap: 6, justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={[styles.headerText, { textAlign: "center" }]}>
            Personal Achievements
          </Text>
          <TouchableOpacity
            disabled={true}
            onPress={() => router.push("/analytics/Achievements")}
            style={[
              styles.card,
              {
                height: 45,
                width: "85%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#444",
                borderRadius: 20,
                opacity: 0.5,
              },
            ]}
          >
            <Text style={styles.headerText}>Coming soon</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  },
  header: {
    flexDirection: "column",
    marginVertical: 12,
    alignItems: "center",
    gap: 6,
  },
  card: {
    backgroundColor: colors.tertiary,
    width: "100%",
    height: 200,
    borderRadius: 6,
    marginVertical: 4,
  },
  headerText: {
    fontWeight: "900",
    fontSize: 18,
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  section: {
    marginVertical: 8,
  },
  text: {
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 0.5,
    fontWeight: 300,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  gridCard: {
    width: "48%",
    height: 140,
    backgroundColor: colors.tertiary,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
});

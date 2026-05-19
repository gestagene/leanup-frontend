import CalorieRing from "@/components/CalorieRing";
import Header from "@/components/Header";
import { colors } from "@/constants/colorscheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Nutrition() {
  return (
    <SafeAreaView style={styles.container}>
      <Header content="CALORIES" />
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={[styles.headerText]}>Summary</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryLeft}>
              <Text style={[styles.headerText, { opacity: 0.75 }]}>
                Calories
              </Text>
              <CalorieRing
                calories={10}
                maxCalories={1000}
                protein={50}
                carbs={50}
                fats={50}
              />
            </View>
            <View style={styles.summaryRight}>
              <Text style={styles.headerText}></Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Meal Tracker</Text>
          <View style={styles.cardWrapper}>
            <View style={[styles.card, { flex: 3 }]}>
              <Text
                style={[
                  styles.sectionLabel,
                  { textAlign: "center", fontWeight: "900", opacity: 0.75 },
                ]}
              >
                LOG FOOD
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.card, { flex: 1, backgroundColor: colors.accent }]}
            >
              <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Recent Logs</Text>
          <View style={styles.cardWrapper}>
            <View style={styles.card}></View>
          </View>
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
    marginTop: 12,
    marginBottom: 6,
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
  headerText: {
    color: colors.textPrimary,
    fontSize: 18,
    letterSpacing: 0.5,
    fontWeight: 800,
  },
  normalText: {
    color: colors.textSecondary,
    fontSize: 11,
    letterSpacing: 0.5,
    textAlign: "center",
    fontWeight: 300,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLeft: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  summaryRight: {
    flexDirection: "column",
    justifyContent: "center",
  },
  section: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 13,
    opacity: 0.8,
    letterSpacing: 0.5,
    color: "#ffffff",
    width: 100,
    fontWeight: "500",
  },
  cardWrapper: {
    flexDirection: "row",
    marginVertical: 6,
    gap: "2%",
  },
  card: {
    flex: 1,
    backgroundColor: colors.tertiary,
    height: 45,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});

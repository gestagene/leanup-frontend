import CalorieRing from "@/components/CalorieRing";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { colors } from "@/constants/colorscheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Nutrition() {
  return (
    <SafeAreaView style={styles.container}>
      <Header content="CALORIES" />
      <View style={styles.main}>
        <View style={{ marginTop: 12, marginBottom: 5, marginHorizontal: 6 }}>
          <Text style={styles.headerText}>Nutrition Overview</Text>
        </View>
        <View
          style={[
            styles.card,
            {
              width: "100%",
              padding: 12,
            },
          ]}
        >
          {/*Texts*/}
          <View
            style={{ justifyContent: "space-around", flexDirection: "row" }}
          >
            <View>
              <Text style={[styles.headerText, { textAlign: "left" }]}>
                Calories
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <View
                  style={{
                    height: 3,
                    width: 3,
                    backgroundColor: "#3B82F6",
                  }}
                ></View>
                <Text
                  style={[styles.text, { fontWeight: "600", color: "#3B82F6" }]}
                >
                  Protein
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <View
                  style={{
                    height: 3,
                    width: 3,
                    backgroundColor: "#F59E0B",
                  }}
                ></View>
                <Text
                  style={[styles.text, { fontWeight: "600", color: "#F59E0B" }]}
                >
                  Carbs
                </Text>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <View
                  style={{
                    height: 3,
                    width: 3,
                    backgroundColor: "#EF4444",
                  }}
                ></View>
                <Text
                  style={[styles.text, { fontWeight: "600", color: "#EF4444" }]}
                >
                  Fats
                </Text>
              </View>
            </View>
          </View>
          {/*Graphs*/}
          <View
            style={{
              alignItems: "center",
              paddingVertical: 10,
              flexDirection: "row",
              gap: 16,
            }}
          >
            <CalorieRing
              calories={1000}
              maxCalories={1500}
              protein={20}
              carbs={20}
              fats={20}
            />
            <View style={{ flex: 1 }}>
              <View style={{ marginVertical: 8 }}>
                <View style={[styles.section]}>
                  <Text style={[styles.text, { marginBottom: 4 }]}>
                    0 / 145
                  </Text>
                  <ProgressBar target={8} value={1} color={"#3B82F6"} />
                </View>
                <View style={[styles.section]}>
                  <Text style={[styles.text, { marginBottom: 4 }]}>0</Text>
                  <ProgressBar target={8} value={1} color={"#F59E0B"} />
                </View>
                <View style={[styles.section, { gap: 2 }]}>
                  <Text style={[styles.text, { marginBottom: 4 }]}>0</Text>
                  <ProgressBar target={2} value={1} color={"#EF4444"} />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          {/*Label*/}
          <Text style={styles.sectionLabel}>Meal Tracker</Text>
          <View style={styles.cardWrapper}>
            <View
              style={[
                styles.card,
                {
                  flex: 2,
                  height: 45,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: 16,
                    fontWeight: "900",
                  },
                ]}
              >
                LOG FOOD
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.card,
                {
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.accent,
                  height: 45,
                },
              ]}
            >
              <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Recent Meals</Text>
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

  summaryContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLeft: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  summaryRight: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  section: {
    marginVertical: 6,
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
    backgroundColor: colors.tertiary,
    width: 285,
    height: 200,
    borderRadius: 6,
    marginVertical: 4,
  },
  text: {
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 0.5,
    fontWeight: 300,
  },
});

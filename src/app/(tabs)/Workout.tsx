import CompactCard from "@/components/CompactCard";
import Header from "@/components/Header";
import { colors } from "@/constants/colorscheme";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Workout() {
  const [activeTab, setActiveTab] = useState("plans");

  return (
    <SafeAreaView style={styles.container}>
      <Header content="Workouts" />
      <View style={styles.main}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setActiveTab("plans");
            }}
          >
            <Text
              style={
                activeTab === "plans"
                  ? styles.activeHeaderText
                  : styles.headerText
              }
            >
              PLANS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setActiveTab("explore");
            }}
          >
            <Text
              style={
                activeTab === "explore"
                  ? styles.activeHeaderText
                  : styles.headerText
              }
            >
              EXPLORE
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "plans" && (
          <>
            <View style={[styles.section]}>
              {/*Label*/}
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.sectionLabel}>Active Plans</Text>
                <Text style={[styles.sectionLabel]}>( 1 / 5 )</Text>
              </View>
              {/*Content*/}
              <View style={styles.cardWrapper}>
                <CompactCard title={"Upper Day"} />
              </View>
            </View>

            <View style={styles.section}>
              {/*Label*/}
              <Text style={styles.sectionLabel}>Create a Plan</Text>
              <View style={styles.cardWrapper}>
                <TouchableOpacity style={[styles.card, { flex: 1 }]}>
                  <Ionicons name="add" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.card,
                    {
                      flex: 2,
                      flexDirection: "row",
                      gap: 6,
                      backgroundColor: colors.accent,
                    },
                  ]}
                >
                  <Text
                    adjustsFontSizeToFit
                    style={{ color: "#ffffff", fontWeight: "800" }}
                  >
                    GENERATE
                  </Text>
                  <Ionicons name="sparkles-sharp" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              {/*Label*/}
              <Text style={styles.sectionLabel}>Activity</Text>
              {/*Content*/}
              <View style={styles.cardWrapper}>
                <View style={styles.card}></View>
              </View>
            </View>
          </>
        )}
        {activeTab === "explore" && (
          <>
            <View style={styles.section}>
              {/*Label*/}
              <Text
                numberOfLines={1}
                style={[
                  styles.sectionLabel,
                  { width: "100%", marginBottom: 8 },
                ]}
              >
                Search
              </Text>
              {/*Text Input*/}
              <View style={styles.searchBar}>
                <Feather
                  name="search"
                  size={24}
                  color="white"
                  style={{ opacity: 0.5 }}
                />

                <TextInput style={styles.searchInput} />
              </View>
            </View>
            <View style={styles.section}>
              {/*Label*/}
              <Text
                numberOfLines={1}
                style={[styles.sectionLabel, { width: "100%" }]}
              >
                Recommended Exercises
              </Text>
              {/*Cards*/}
              <View style={styles.cardWrapper}>
                <View style={styles.card}></View>
              </View>
            </View>

            <View style={styles.section}>
              {/*Label*/}
              <Text
                numberOfLines={1}
                style={[styles.sectionLabel, { width: "100%" }]}
              >
                Beginner Exercises
              </Text>

              {/*Cards*/}
              <View style={styles.cardWrapper}>
                <View style={styles.card}></View>
              </View>
            </View>
          </>
        )}
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
    marginBottom: 28,
    flexDirection: "row",
    justifyContent: "center",
  },
  headerText: {
    fontWeight: "900",
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.5,
    letterSpacing: 0.5,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderColor: "#ffffff",
    borderBottomWidth: 1,
  },
  activeHeaderText: {
    fontWeight: "900",
    fontSize: 14,
    color: "#ffffff",
    opacity: 1,
    letterSpacing: 0.5,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderColor: "#ffffff",
    borderBottomWidth: 1,
  },
  section: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 12,
    opacity: 0.8,
    letterSpacing: 0.5,
    color: "#ffffff",
    minWidth: 85,
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.tertiary,
    height: 45,
    borderRadius: 6,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: "white",
  },
});

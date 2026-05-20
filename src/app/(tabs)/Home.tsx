import CalorieRing from "@/components/CalorieRing";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { colors } from "@/constants/colorscheme";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [activeCard, setActiveCard] = useState(0);
  const [cups, setCups] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <Header content="tempo" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.main}>
        <View style={{ marginTop: 12, marginBottom: 5, marginHorizontal: 6 }}>
          <Text style={styles.headerText}>Daily Summary</Text>
        </View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / 300);
            setActiveCard(index);
          }}
          scrollEventThrottle={16}
          contentContainerStyle={{
            gap: 10,
          }}
        >
          <View
            style={[
              styles.card,
              {
                width: 300,
                padding: 12,
              },
            ]}
          >
            {/*Texts*/}
            <View>
              <Text style={[styles.headerText, { textAlign: "left" }]}>
                Calories
              </Text>
              <Text style={[styles.text, { textAlign: "left" }]}>
                Remaining = Goal - Calories
              </Text>
            </View>
            {/*Graphs*/}
            <View
              style={{
                justifyContent: "space-around",
                alignItems: "center",
                paddingVertical: 10,
                flexDirection: "row",
              }}
            >
              <View>
                <CalorieRing
                  calories={1000}
                  maxCalories={1500}
                  protein={20}
                  carbs={20}
                  fats={20}
                />
              </View>
              <View style={{ gap: 8 }}>
                <View
                  style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
                >
                  <Ionicons name="flag" size={24} color={"#3B82F6"} />
                  <View style={{ flexDirection: "column", gap: 2 }}>
                    <Text style={styles.text}>Base Goal</Text>
                    <Text style={[styles.text, { fontWeight: "900" }]}>0</Text>
                  </View>
                </View>
                <View
                  style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
                >
                  <FontAwesome6 name="utensils" size={24} color={"#FB923C"} />
                  <View style={{ flexDirection: "column", gap: 2 }}>
                    <Text style={styles.text}>Food</Text>
                    <Text style={[styles.text, { fontWeight: "900" }]}>0</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.card,
              {
                width: 300,
                padding: 12,
              },
            ]}
          >
            {/*Text*/}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <View>
                <Text style={[styles.headerText, { textAlign: "left" }]}>
                  Macros
                </Text>
              </View>
              {/*legend*/}
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
                    style={[
                      styles.text,
                      { fontWeight: "600", color: "#3B82F6" },
                    ]}
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
                    style={[
                      styles.text,
                      { fontWeight: "600", color: "#F59E0B" },
                    ]}
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
                    style={[
                      styles.text,
                      { fontWeight: "600", color: "#EF4444" },
                    ]}
                  >
                    Fats
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ marginVertical: 8 }}>
              <View style={[styles.section]}>
                <Text style={[styles.text, { marginBottom: 4 }]}>0 / 145</Text>
                <ProgressBar target={8} value={cups} color={"#F59E0B"} />
              </View>
              <View style={[styles.section]}>
                <Text style={[styles.text, { marginBottom: 4 }]}>0</Text>
                <ProgressBar target={8} value={cups} color={"#F59E0B"} />
              </View>
              <View style={[styles.section, { gap: 2 }]}>
                <Text style={[styles.text, { marginBottom: 4 }]}>0</Text>
                <ProgressBar target={2} value={cups} color={"#EF4444"} />
              </View>
            </View>
          </View>
        </ScrollView>
        <View
          style={[
            styles.section,
            {
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
              marginTop: 8,
            },
          ]}
        >
          {[0, 1].map((i) => (
            <View
              key={i}
              style={{
                width: activeCard === i ? 20 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: activeCard === i ? "#7961c2" : "#444",
              }}
            />
          ))}
        </View>
        <View style={[styles.section]}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[styles.text, { textAlign: "center" }]}
          >
            Train each muscle group 2× per week for faster growth.
          </Text>
        </View>
        <View style={styles.section}>
          <View
            style={[
              styles.card,
              {
                height: 65,
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "6%",
                padding: 10,
              },
            ]}
          >
            <Text style={[styles.headerText, { fontStyle: "italic" }]}>
              Today's Workout Plan
            </Text>
            <TouchableOpacity style={styles.button}>
              <Entypo name="eye" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.section,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                height: 120,
              },
            ]}
          >
            {/* Water */}
            <View
              style={[
                styles.card,
                {
                  height: "100%",
                  width: "48%",
                  paddingHorizontal: 12,
                  paddingTop: 8,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.headerText, { fontSize: 16 }]}>Water</Text>
                <TouchableOpacity
                  onPress={() =>
                    setCups((prev) => (prev < 8 ? prev + 1 : prev))
                  }
                  style={[styles.button, { backgroundColor: "transparent" }]}
                >
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  justifyContent: "flex-start",
                  gap: 18,
                }}
              >
                <FontAwesome6 name="glass-water" size={24} color="#21547D" />
                <View
                  style={{
                    flexDirection: "row",
                    gap: 6,
                  }}
                >
                  <Text
                    style={[styles.headerText, { opacity: 0.65, fontSize: 16 }]}
                  >
                    {cups} / 8
                  </Text>
                  <Text
                    style={[styles.headerText, { opacity: 0.65, fontSize: 16 }]}
                  >
                    Glasses
                  </Text>
                </View>
              </View>
              <ProgressBar target={8} value={cups} />
            </View>
            {/* Steps */}
            <View
              style={[
                styles.card,
                {
                  height: "100%",
                  width: "48%",
                  paddingHorizontal: 12,
                  paddingTop: 8,
                },
              ]}
            >
              <Text style={[styles.headerText, { fontSize: 16 }]}>Steps</Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  justifyContent: "flex-start",
                  gap: 18,
                }}
              >
                <MaterialCommunityIcons
                  name="shoe-sneaker"
                  size={34}
                  color="#BD4040"
                  style={{ transform: [{ rotate: "-15deg" }] }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    gap: 4,
                  }}
                >
                  <Text
                    style={[styles.headerText, { opacity: 0.65, fontSize: 16 }]}
                  >
                    0
                  </Text>
                  <Text
                    style={[styles.headerText, { opacity: 0.65, fontSize: 16 }]}
                  >
                    / 10,000
                  </Text>
                </View>
              </View>
              <ProgressBar target={10000} value={cups} />
            </View>
          </View>
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: colors.secondary,
  },
  main: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 2,
    minHeight: "100%",
  },
  headerText: {
    color: colors.textPrimary,
    fontSize: 18,
    letterSpacing: 0.5,
    fontWeight: 800,
  },
  text: {
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 0.5,
    fontWeight: 300,
  },
  card: {
    backgroundColor: colors.tertiary,
    width: 285,
    height: 200,
    borderRadius: 6,
    marginVertical: 4,
  },
  section: {
    marginVertical: 8,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 100,
    paddingVertical: "2.5%",
    paddingHorizontal: "3%",
    alignItems: "center",
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
});

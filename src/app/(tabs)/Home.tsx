import CalorieRing from "@/components/CalorieRing";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { colors } from "@/constants/colorscheme";
import { useHealthConnect } from "@/hooks/useHealthConnect";
import { useProfile } from "@/hooks/useProfile";
import { useTdee } from "@/hooks/useTdee";
import { nutritionService } from "@/services/nutrition.service";
import { progressService } from "@/services/progress.service";
import { userService } from "@/services/user.service";
import type { NutritionSummary } from "@/types/nutrition.types";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type UserProfile = {
  name: string;
  goal: string;
};

const FITNESS_TIPS = [
  "Train each muscle group 2× per week for faster growth.",
  "Sleep 7-9 hours — muscle is built during recovery, not training.",
  "Progressive overload: add weight or reps each week to keep growing.",
  "Protein synthesis peaks 24-48 hours after training. Stay consistent.",
  "Dehydration of just 2% body weight can reduce performance by 10%.",
  "Compound lifts (squat, deadlift, bench) give you the most bang for your buck.",
  "Rest 48-72 hours before training the same muscle group again.",
  "Eating protein before bed helps overnight muscle recovery.",
  "Warm up for 5-10 minutes to reduce injury risk and improve performance.",
  "Consistency beats intensity — showing up regularly matters more than perfect workouts.",
];

const STEP_GOAL = 10000;

export default function Home() {
  const { profile, streak } = useProfile();
  const [activeCard, setActiveCard] = useState(0);
  const [cups, setCups] = useState(0);
  const [summary, setSummary] = useState<NutritionSummary>({
    total_calories: 0,
    total_protein: 0,
    total_carbs: 0,
    total_fats: 0,
  });
  const [loading, setLoading] = useState(true);

  const { steps, activeCalories, hasPermission } = useHealthConnect();
  const { tdee } = useTdee();

  const tip = useMemo(
    () => FITNESS_TIPS[Math.floor(Math.random() * FITNESS_TIPS.length)],
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, profileData] = await Promise.all([
          nutritionService.getTodaySummary(),
          userService.getProfile(),
          progressService.getStreak(),
        ]);
        setSummary(summaryData);
        progressService.getStreak();
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        content={`🔥 ${streak} day${streak !== 1 ? "s" : ""}`}
        initial={profile?.name}
      />
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
          contentContainerStyle={{ gap: 10 }}
        >
          {/* Calories Card */}
          <View style={[styles.card, { width: 300, padding: 12 }]}>
            <View>
              <Text style={[styles.headerText, { textAlign: "left" }]}>
                Calories
              </Text>
              <Text style={[styles.text, { textAlign: "left" }]}>
                Remaining = Goal - Calories
              </Text>
            </View>
            <View
              style={{
                justifyContent: "space-around",
                alignItems: "center",
                paddingVertical: 10,
                flexDirection: "row",
              }}
            >
              <CalorieRing
                calories={summary.total_calories}
                maxCalories={tdee.target_calories}
                protein={summary.total_protein}
                carbs={summary.total_carbs}
                fats={summary.total_fats}
              />
              <View style={{ gap: 8 }}>
                <View
                  style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
                >
                  <Ionicons name="flag" size={24} color={"#3B82F6"} />
                  <View style={{ flexDirection: "column", gap: 2 }}>
                    <Text style={styles.text}>Base Goal</Text>
                    <Text style={[styles.text, { fontWeight: "900" }]}>
                      {tdee.target_calories}
                    </Text>
                  </View>
                </View>
                <View
                  style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
                >
                  <FontAwesome6 name="utensils" size={24} color={"#FB923C"} />
                  <View style={{ flexDirection: "column", gap: 2 }}>
                    <Text style={styles.text}>Food</Text>
                    <Text style={[styles.text, { fontWeight: "900" }]}>
                      {summary.total_calories}
                    </Text>
                  </View>
                </View>
                {hasPermission && activeCalories > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="flame" size={24} color={"#EF4444"} />
                    <View style={{ flexDirection: "column", gap: 2 }}>
                      <Text style={styles.text}>Active</Text>
                      <Text style={[styles.text, { fontWeight: "900" }]}>
                        {activeCalories}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Macros Card */}
          <View style={[styles.card, { width: 300, padding: 12 }]}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Text style={[styles.headerText, { textAlign: "left" }]}>
                Macros
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {[
                  { label: "Protein", color: "#3B82F6" },
                  { label: "Carbs", color: "#F59E0B" },
                  { label: "Fats", color: "#EF4444" },
                ].map(({ label, color }) => (
                  <View
                    key={label}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <View
                      style={{ height: 3, width: 3, backgroundColor: color }}
                    />
                    <Text style={[styles.text, { fontWeight: "600", color }]}>
                      {label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ marginVertical: 8 }}>
              <View style={styles.section}>
                <Text style={[styles.text, { marginBottom: 4 }]}>
                  {summary.total_protein}g / {tdee.target_protein}g
                </Text>
                <ProgressBar
                  target={tdee.target_protein}
                  value={summary.total_protein}
                  color={"#3B82F6"}
                />
              </View>
              <View style={styles.section}>
                <Text style={[styles.text, { marginBottom: 4 }]}>
                  {summary.total_carbs}g / {tdee.target_carbs}g
                </Text>
                <ProgressBar
                  target={tdee.target_carbs}
                  value={summary.total_carbs}
                  color={"#F59E0B"}
                />
              </View>
              <View style={[styles.section, { gap: 2 }]}>
                <Text style={[styles.text, { marginBottom: 4 }]}>
                  {summary.total_fats}g / {tdee.target_fats}g
                </Text>
                <ProgressBar
                  target={tdee.target_fats}
                  value={summary.total_fats}
                  color={"#EF4444"}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Pagination dots */}
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

        {/* Tip */}
        <View style={styles.section}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[styles.text, { textAlign: "center" }]}
          >
            Tip: {tip}
          </Text>
        </View>

        <View style={styles.section}>
          {/* Workout Plan */}
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
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/Workout")}
              style={styles.button}
            >
              <Feather name="arrow-up-right" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Water + Steps */}
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
                  <Ionicons name="add" size={16} color="white" />
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
                <View style={{ flexDirection: "row", gap: 6 }}>
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
              <View style={{ paddingTop: 10 }}>
                <ProgressBar target={8} value={cups} color={"#21547D"} />
              </View>
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
                <View style={{ flexDirection: "row", gap: 4 }}>
                  <Text
                    style={[styles.headerText, { opacity: 0.65, fontSize: 16 }]}
                  >
                    {hasPermission ? steps.toLocaleString() : "--"}
                  </Text>
                  <Text
                    style={[styles.headerText, { opacity: 0.65, fontSize: 16 }]}
                  >
                    / {STEP_GOAL.toLocaleString()}
                  </Text>
                </View>
              </View>
              <View style={{ paddingTop: hasPermission ? 10 : 0 }}>
                {hasPermission ? (
                  <ProgressBar target={STEP_GOAL} value={steps} />
                ) : (
                  <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    style={[
                      styles.text,
                      { opacity: 0.5, fontSize: 10, textAlign: "center" },
                    ]}
                  >
                    Enable Health Connect to track steps
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.secondary },
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
    fontWeight: "800",
  },
  text: {
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 0.5,
    fontWeight: "500",
  },
  card: {
    backgroundColor: colors.tertiary,
    width: 285,
    height: 200,
    borderRadius: 6,
    marginVertical: 4,
  },
  section: { marginVertical: 8 },
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

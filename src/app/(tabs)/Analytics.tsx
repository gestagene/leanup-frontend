import FabiconModal from "@/components/FabiconModal";
import Header from "@/components/Header";
import { colors } from "@/constants/colorscheme";
import { useHealthConnect } from "@/hooks/useHealthConnect";
import { nutritionService } from "@/services/nutrition.service";
import { progressService } from "@/services/progress.service";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CHART_WIDTH = width - 48;

const FITNESS_TIPS = [
  "Log every meal — consistency in tracking leads to consistency in results.",
  "Your body adapts to stress. Change your routine every 4-6 weeks.",
  "Protein is most important on rest days — that's when muscle is rebuilt.",
  "Sleep deprivation increases cortisol, which breaks down muscle tissue.",
  "Even a 10-minute walk counts. Movement compounds over time.",
  "Strength training boosts metabolism for up to 48 hours post-workout.",
  "Meal prepping on weekends makes hitting macros 3x easier.",
  "Creatine is the most researched and proven supplement for strength.",
  "Track your weight at the same time each day for accurate trends.",
  "Progressive overload is the single most important principle in training.",
];

type Analytics = {
  total_workouts: number;
  workouts_this_week: number;
  workouts_this_month: number;
  total_calories_logged: number;
  progress_entries: number;
  latest_weight: number | null;
  starting_weight: number | null;
  weight_change: number | null;
  weight_history: { date: string; weight: number }[];
  latest_body_fat: number | null;
  body_fat_history: { date: string; body_fat: number }[];
};

type Tdee = {
  bmr: number;
  tdee: number;
  target_calories: number;
  target_protein: number;
  goal: string;
  adjustment: number;
};

function Analytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [tdee, setTdee] = useState<Tdee | null>(null);
  const [avgProtein, setAvgProtein] = useState(0);
  const [avgCalories, setAvgCalories] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const { steps, hasPermission, requestPermissions } = useHealthConnect();

  const tip = useMemo(
    () => FITNESS_TIPS[Math.floor(Math.random() * FITNESS_TIPS.length)],
    [],
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsData, logsData, tdeeData] = await Promise.all([
        progressService.getAnalytics(),
        nutritionService.getLogs(),
        progressService.getTdee(),
      ]);
      setAnalytics(analyticsData);
      setTdee(tdeeData);

      if (logsData.length > 0) {
        const totalCals = logsData.reduce(
          (sum: number, l: any) => sum + (l.calories ?? 0),
          0,
        );
        const totalProtein = logsData.reduce(
          (sum: number, l: any) => sum + (l.protein ?? 0),
          0,
        );
        const avgCals = Math.round(totalCals / logsData.length);
        const avgProt = Math.round(totalProtein / logsData.length);
        setAvgCalories(avgCals);
        setAvgProtein(avgProt);

        // Fetch AI insight after data is ready
        fetchAiInsight(analyticsData, tdeeData, avgCals, avgProt);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAiInsight = async (
    analyticsData: Analytics,
    tdeeData: Tdee,
    avgCals: number,
    avgProt: number,
  ) => {
    try {
      setLoadingInsight(true);
      const insight = await progressService.getAiInsight({
        total_workouts: analyticsData.total_workouts,
        workouts_this_week: analyticsData.workouts_this_week,
        latest_weight: analyticsData.latest_weight,
        weight_change: analyticsData.weight_change,
        avg_calories: avgCals,
        avg_protein: avgProt,
        target_calories: tdeeData.target_calories,
        target_protein: tdeeData.target_protein,
        goal: tdeeData.goal,
      });
      setAiInsight(insight.insight);
    } catch (err) {
      console.error("Failed to fetch AI insight:", err);
    } finally {
      setLoadingInsight(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const weightData =
    analytics?.weight_history.map((w) => ({
      value: w.weight,
      label: formatDate(w.date),
      labelTextStyle: { color: "#888", fontSize: 9 },
    })) ?? [];

  const calorieData =
    analytics?.weight_history.slice(-7).map((_, i) => ({
      value: Math.floor(Math.random() * 800) + 1400,
      label: `Day ${i + 1}`,
      labelTextStyle: { color: "#888", fontSize: 9 },
    })) ?? [];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  const currentSteps = steps ?? 0;

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Header content="Analytics" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.main}
      >
        {/* AI Insight card */}
        <View style={styles.highlightCard}>
          {loadingInsight ? (
            <ActivityIndicator size="small" color="#9b85e0" />
          ) : (
            <Text style={styles.highlightText}>
              {aiInsight ?? "Start logging workouts to see your insights here."}
            </Text>
          )}
        </View>

        {/* Chart cards */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / (CHART_WIDTH + 16),
            );
            setActiveChart(index);
          }}
          scrollEventThrottle={16}
          contentContainerStyle={{ gap: 12 }}
        >
          {/* Weight Chart */}
          <View style={[styles.chartCard, { width: CHART_WIDTH }]}>
            <Text style={styles.chartTitle}>Weight Progress</Text>
            {weightData.length > 1 ? (
              <View style={styles.chartWrapper}>
                <LineChart
                  data={weightData}
                  width={CHART_WIDTH - 64}
                  height={130}
                  color={colors.accent}
                  thickness={3}
                  hideDataPoints={false}
                  dataPointsColor={colors.accent}
                  dataPointsRadius={4}
                  startFillColor={`${colors.accent}33`}
                  endFillColor="transparent"
                  areaChart
                  yAxisTextStyle={{ color: "#888", fontSize: 9 }}
                  xAxisThickness={0}
                  yAxisThickness={0}
                  rulesColor="#444"
                  rulesThickness={0.5}
                />
              </View>
            ) : (
              <View style={styles.emptyChart}>
                <Text numberOfLines={1} style={styles.emptyText}>
                  No data found.
                </Text>
              </View>
            )}
            {analytics?.latest_weight && (
              <View style={styles.chartFooter}>
                <Text style={styles.chartStat}>
                  Current: {analytics.latest_weight}kg
                </Text>
                {analytics.weight_change !== null && (
                  <Text
                    style={[
                      styles.chartStat,
                      {
                        color:
                          analytics.weight_change < 0 ? "#2fa83d" : "#EF4444",
                      },
                    ]}
                  >
                    {analytics.weight_change > 0 ? "+" : ""}
                    {analytics.weight_change}kg total
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* Calorie Trend Chart */}
          <View style={[styles.chartCard, { width: CHART_WIDTH }]}>
            <Text style={styles.chartTitle}>Calorie Trend (last 7 days)</Text>
            {calorieData.length > 0 ? (
              <View style={styles.chartWrapper}>
                <BarChart
                  data={calorieData}
                  width={CHART_WIDTH - 64}
                  height={130}
                  frontColor="#FB923C"
                  barWidth={16}
                  spacing={12}
                  yAxisTextStyle={{ color: "#888", fontSize: 9 }}
                  xAxisThickness={0}
                  yAxisThickness={0}
                  rulesColor="#444"
                  rulesThickness={0.5}
                />
              </View>
            ) : (
              <View style={styles.emptyChart}>
                <Text style={styles.emptyText}>No data found.</Text>
              </View>
            )}
            <View style={styles.chartFooter}>
              <Text style={styles.chartStat}>Avg: {avgCalories} kcal/meal</Text>
              <Text style={styles.chartStat}>
                Total: {analytics?.total_calories_logged ?? 0} kcal logged
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Pagination dots */}
        <View style={styles.dots}>
          {[0, 1].map((i) => (
            <View
              key={i}
              style={[styles.dot, activeChart === i && styles.dotActive]}
            />
          ))}
        </View>

        {/* Tip */}
        <View style={[styles.section, { alignItems: "center" }]}>
          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.text}>
            Tip: {tip}
          </Text>
        </View>

        {/* Grid cards */}
        <View style={styles.grid}>
          <View style={styles.gridCard}>
            <Text style={[styles.text, { fontWeight: "700" }]}>
              Avg. Calories
            </Text>
            <Text style={styles.gridValue}>{avgCalories}</Text>
            <Text style={styles.gridUnit}>kcal / meal</Text>
            {tdee && (
              <Text
                style={[
                  styles.gridUnit,
                  {
                    marginTop: 4,
                    color:
                      avgCalories <= tdee.target_calories
                        ? "#2fa83d"
                        : "#EF4444",
                  },
                ]}
              >
                Threshold: {tdee.target_calories} kcal
              </Text>
            )}
          </View>

          <View style={styles.gridCard}>
            <Text style={[styles.text, { fontWeight: "700" }]}>
              Avg. Protein
            </Text>
            <Text style={styles.gridValue}>{avgProtein}g</Text>
            <Text style={styles.gridUnit}>per meal</Text>
            {tdee && (
              <Text
                style={[
                  styles.gridUnit,
                  {
                    marginTop: 4,
                    color:
                      avgProtein >= tdee.target_protein ? "#2fa83d" : "#EF4444",
                  },
                ]}
              >
                Target: {tdee.target_protein}g
              </Text>
            )}
          </View>

          <View style={styles.gridCard}>
            <Text style={[styles.text, { fontWeight: "700" }]}>
              Workout Frequency
            </Text>
            <Text style={styles.gridValue}>
              {analytics?.workouts_this_week ?? 0}
            </Text>
            <Text style={styles.gridUnit}>this week</Text>
            <Text style={[styles.gridUnit, { marginTop: 4 }]}>
              {analytics?.workouts_this_month ?? 0} this month
            </Text>
          </View>

          <TouchableOpacity
            style={styles.gridCard}
            disabled={hasPermission}
            onPress={requestPermissions}
          >
            <Text style={[styles.text, { fontWeight: "700" }]}>Steps</Text>
            {hasPermission ? (
              <>
                <Text style={styles.gridValue}>
                  {currentSteps.toLocaleString()}
                </Text>
                <Text style={styles.gridUnit}>today</Text>
              </>
            ) : (
              <>
                <Text
                  style={[
                    styles.gridValue,
                    { fontSize: 18, marginVertical: 6, color: colors.accent },
                  ]}
                >
                  Connect
                </Text>
                <Text style={styles.gridUnit}>Tap to link health data</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.fab}
      >
        <FontAwesome6 name="add" size={24} color="white" />
      </TouchableOpacity>

      <FabiconModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLogged={fetchData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.secondary },
  main: { flex: 1, backgroundColor: colors.primary },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 2,
    paddingBottom: 32,
    backgroundColor: colors.primary,
    minHeight: "100%",
  },
  highlightCard: {
    backgroundColor: "#1e1a2e",
    borderRadius: 10,
    padding: 16,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3d2f6e",
    alignItems: "center",
    minHeight: 56,
    justifyContent: "center",
  },
  highlightText: {
    color: "#9b85e0",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.4,
    lineHeight: 20,
  },
  chartCard: {
    backgroundColor: colors.tertiary,
    borderRadius: 10,
    padding: 12,
    marginVertical: 4,
  },
  chartTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    paddingLeft: 8,
  },
  chartFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  chartStat: { color: colors.textSecondary, fontSize: 11 },
  emptyChart: { height: 160, alignItems: "center", justifyContent: "center" },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 12,
    opacity: 0.5,
    textAlign: "center",
    width: 100,
    letterSpacing: 0.5,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginVertical: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#444" },
  dotActive: { backgroundColor: colors.accent, width: 20 },
  section: { marginVertical: 8 },
  text: {
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 0.5,
    fontWeight: "500",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  gridCard: {
    width: "48%",
    height: 160,
    backgroundColor: colors.tertiary,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    justifyContent: "center",
    gap: 4,
  },
  gridValue: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  gridUnit: { color: colors.textPrimary, fontSize: 11, opacity: 0.7 },
  fab: {
    position: "absolute",
    bottom: "5%",
    right: "5%",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default Analytics;

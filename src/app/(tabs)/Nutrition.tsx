import CalorieRing from "@/components/CalorieRing";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { colors } from "@/constants/colorscheme";
import { useTdee } from "@/hooks/useTdee";
import { nutritionService } from "@/services/nutrition.service";
import {
  FoodSearchResult,
  MealLog,
  NutritionSummary,
} from "@/types/nutrition.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Nutrition() {
  const { tdee } = useTdee();
  const [summary, setSummary] = useState<NutritionSummary>({
    total_calories: 0,
    total_protein: 0,
    total_carbs: 0,
    total_fats: 0,
  });
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [logging, setLogging] = useState(false);
  const [error, setError] = useState("");

  const calorieGoal = tdee.target_calories;

  const fetchData = async () => {
    try {
      const [summaryData, logsData] = await Promise.all([
        nutritionService.getTodaySummary(),
        nutritionService.getLogs(),
      ]);
      setSummary(summaryData);
      setLogs(logsData);
    } catch (error) {
      console.error("Failed to fetch nutrition data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setSearching(true);
      const data = await nutritionService.searchFood(searchQuery);
      setSearchResults(data.results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const handleLogFood = async (food: FoodSearchResult) => {
    try {
      setLogging(true);
      await nutritionService.logMeal({
        food_name: food.food_name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fats: food.fats,
        meal_type: "snack",
      });
      setModalVisible(false);
      setSearchQuery("");
      setSearchResults([]);
      await fetchData(); // refresh summary and logs
    } catch (error) {
      console.error("Failed to log food:", error);
    } finally {
      setLogging(false);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    try {
      await nutritionService.deleteLog(logId);
      await fetchData();
    } catch (error) {
      console.error("Failed to delete log:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header content="Calories" />
      <ScrollView style={styles.main}>
        <View style={{ marginTop: 12, marginBottom: 5, marginHorizontal: 6 }}>
          <Text style={styles.headerText}>Nutrition Overview</Text>
        </View>

        {/* Calorie + Macro Card */}
        <View style={[styles.card, { width: "100%", padding: 12 }]}>
          <View
            style={{ justifyContent: "space-around", flexDirection: "row" }}
          >
            <Text style={[styles.headerText, { textAlign: "left" }]}>
              Calories
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <View
                  style={{ height: 3, width: 3, backgroundColor: "#3B82F6" }}
                />
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
                  style={{ height: 3, width: 3, backgroundColor: "#F59E0B" }}
                />
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
                  style={{ height: 3, width: 3, backgroundColor: "#EF4444" }}
                />
                <Text
                  style={[styles.text, { fontWeight: "600", color: "#EF4444" }]}
                >
                  Fats
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              alignItems: "center",
              paddingVertical: 10,
              flexDirection: "row",
              gap: 16,
            }}
          >
            <CalorieRing
              calories={summary.total_calories}
              maxCalories={tdee.target_calories}
              protein={summary.total_protein}
              carbs={summary.total_carbs}
              fats={summary.total_fats}
            />
            <View style={{ flex: 1 }}>
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
          </View>
        </View>

        {/* Meal Tracker */}
        <View style={styles.section}>
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
              <Text style={[styles.text, { fontSize: 16, fontWeight: "900" }]}>
                LOG FOOD
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
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

        {/* Recent Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Recent Meals</Text>
          {logs.length === 0 ? (
            <Text style={[styles.text, { marginTop: 8, opacity: 0.5 }]}>
              No meals logged today.
            </Text>
          ) : (
            logs.map((log) => (
              <View
                key={log.id}
                style={[
                  styles.card,
                  {
                    width: "100%",
                    height: "auto",
                    padding: 12,
                    marginVertical: 4,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                ]}
              >
                <View>
                  <Text
                    style={[
                      styles.text,
                      {
                        fontWeight: "700",
                        fontSize: 14,
                        color: colors.textPrimary,
                      },
                    ]}
                  >
                    {log.food_name}
                  </Text>
                  <Text style={styles.text}>
                    {log.calories} kcal · P: {log.protein}g · C: {log.carbs}g ·
                    F: {log.fats}g
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteLog(log.id)}>
                  <Ionicons name="trash-outline" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Log Food Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.headerText}>Search Food</Text>
            <View style={styles.searchBar}>
              <TextInput
                style={styles.searchInput}
                placeholder="e.g. chicken breast"
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity style={{ padding: 6 }} onPress={handleSearch}>
                <Ionicons name="search" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {searching ? (
              <ActivityIndicator size="large" color={colors.accent} />
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleLogFood(item)}
                    style={styles.resultItem}
                  >
                    <View>
                      <Text
                        style={[
                          styles.text,
                          { fontWeight: "700", color: colors.textPrimary },
                        ]}
                      >
                        {item.food_name || "Unknown"}
                      </Text>
                      <Text style={styles.text}>
                        {item.calories} kcal · P: {item.protein}g · C:{" "}
                        {item.carbs}g · F: {item.fats}g
                      </Text>
                    </View>
                    <Ionicons
                      name="add-circle-outline"
                      size={24}
                      color={colors.accent}
                    />
                  </TouchableOpacity>
                )}
              />
            )}

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setSearchResults([]);
                setSearchQuery("");
              }}
              style={styles.closeButton}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  section: { marginVertical: 6 },
  sectionLabel: {
    fontSize: 13,
    opacity: 0.8,
    letterSpacing: 0.5,
    color: "#ffffff",
    fontWeight: "500",
  },
  cardWrapper: { flexDirection: "row", marginVertical: 6, gap: 8 },
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
    fontWeight: "300",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 10,
    marginVertical: 12,
  },
  searchInput: { flex: 1, color: "white" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "80%",
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.tertiary,
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: colors.tertiary,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
});

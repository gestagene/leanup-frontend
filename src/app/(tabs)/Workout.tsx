import Header from "@/components/Header";
import ActivityList from "@/components/workouts/ActivityList";
import CreatePlanModal from "@/components/workouts/CreatePlanModal";
import ExerciseCard from "@/components/workouts/ExerciseCard";
import PlansList from "@/components/workouts/PlansList";
import PresetBanner from "@/components/workouts/PresetBanner";
import { colors } from "@/constants/colorscheme";
import {
  Exercise,
  WorkoutPlan,
  workoutService,
} from "@/services/workout.service";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Workout() {
  const [activeTab, setActiveTab] = useState("plans");
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [error, setError] = useState("");

  const [exploreQuery, setExploreQuery] = useState("");
  const [exploreResults, setExploreResults] = useState<Exercise[]>([]);
  const [exploreSearching, setExploreSearching] = useState(false);
  const [exploreSearched, setExploreSearched] = useState(false);
  const [recommended, setRecommended] = useState<Exercise[]>([]);
  const [loadingRecommended, setLoadingRecommended] = useState(false);
  const [exploreMore, setExploreMore] = useState<Exercise[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === "explore") {
      fetchRecommended();
      fetchMoreExplore();
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const [plansData, sessionsData] = await Promise.all([
        workoutService.getPlans(),
        workoutService.getSessions(),
      ]);
      setPlans(plansData);
      setSessions(sessionsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommended = async () => {
    try {
      setLoadingRecommended(true);
      const data = await workoutService.getRandomExercises();
      setRecommended(data.results ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRecommended(false);
    }
  };

  const fetchMoreExplore = async () => {
    try {
      setLoadingMore(true);
      const data = await workoutService.getRandomExercises();
      setExploreMore(data.results ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleExploreSearch = async () => {
    if (!exploreQuery.trim()) return;
    try {
      setExploreSearching(true);
      setExploreSearched(true);
      const data = await workoutService.searchExercises(exploreQuery);
      setExploreResults(data.results ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setExploreSearching(false);
    }
  };

  const handleStartWorkout = async (plan: WorkoutPlan) => {
    try {
      const session = await workoutService.startSession(plan.id);
      router.push({
        pathname: "/(workouts)/session",
        params: { sessionId: session.id, planId: plan.id },
      });
    } catch (err: any) {
      setError(err.message);
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
      <Header content="Workouts" />
      <View style={styles.main}>
        {/* Tabs */}
        <View style={styles.tabs}>
          {["plans", "explore"].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
              <Text
                style={
                  activeTab === tab ? styles.activeTab : styles.inactiveTab
                }
              >
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Plans tab */}
        {activeTab === "plans" && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Recommended for you</Text>
              <PresetBanner onAdded={fetchData} />
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>
                  My Plans ({plans.length}/5)
                </Text>
                {plans.length < 5 && (
                  <TouchableOpacity
                    onPress={() => setCreateModalVisible(true)}
                    style={styles.addButton}
                  >
                    <Ionicons name="add" size={22} color="white" />
                  </TouchableOpacity>
                )}
              </View>
              <PlansList
                plans={plans}
                onRefresh={fetchData}
                onStartWorkout={handleStartWorkout}
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Previous Sessions</Text>
              <ActivityList sessions={sessions} />
            </View>
          </ScrollView>
        )}

        {/* Explore tab */}
        {activeTab === "explore" && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Search */}
            <View style={styles.section}>
              <View style={styles.searchBar}>
                <Feather
                  name="search"
                  size={20}
                  color="white"
                  style={{ opacity: 0.5 }}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholderTextColor="#666"
                  placeholder="Search exercises..."
                  value={exploreQuery}
                  onChangeText={(text) => {
                    setExploreQuery(text);
                    if (text.trim().length === 0) {
                      setExploreResults([]);
                      setExploreSearched(false);
                    }
                  }}
                  onSubmitEditing={handleExploreSearch}
                  returnKeyType="search"
                />
                {exploreQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setExploreQuery("");
                      setExploreResults([]);
                      setExploreSearched(false);
                    }}
                  >
                    <Feather name="x" size={18} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Search results */}
            {exploreSearched && (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  Results
                  {exploreResults.length > 0
                    ? ` (${exploreResults.length})`
                    : ""}
                </Text>
                {exploreSearching ? (
                  <ActivityIndicator
                    color={colors.accent}
                    style={{ marginTop: 12 }}
                  />
                ) : exploreResults.length === 0 ? (
                  <Text style={styles.emptyText}>No exercises found</Text>
                ) : (
                  exploreResults.map((ex) => (
                    <ExerciseCard key={ex.id} exercise={ex} />
                  ))
                )}
              </View>
            )}

            {/* Recommended + More */}
            {!exploreSearched && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Recommended Exercises</Text>
                  {loadingRecommended ? (
                    <ActivityIndicator
                      color={colors.accent}
                      style={{ marginTop: 12 }}
                    />
                  ) : (
                    <View style={{ marginTop: 8 }}>
                      {recommended.map((ex) => (
                        <ExerciseCard key={ex.id} exercise={ex} />
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionLabel}>More Exercises</Text>
                    <TouchableOpacity
                      onPress={fetchMoreExplore}
                      style={styles.shuffleButton}
                    >
                      <Feather
                        name="refresh-cw"
                        size={12}
                        color={colors.accent}
                      />
                      <Text
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        style={styles.shuffleText}
                      >
                        Shuffle
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {loadingMore ? (
                    <ActivityIndicator
                      color={colors.accent}
                      style={{ marginTop: 12 }}
                    />
                  ) : (
                    <View style={{ marginTop: 8 }}>
                      {exploreMore.map((ex) => (
                        <ExerciseCard key={ex.id} exercise={ex} />
                      ))}
                    </View>
                  )}
                </View>
              </>
            )}
          </ScrollView>
        )}
      </View>

      <CreatePlanModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onCreated={fetchData}
      />
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
    paddingTop: 2,
    paddingBottom: 100,
    minHeight: "100%",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 28,
  },
  activeTab: {
    fontWeight: "900",
    fontSize: 14,
    color: "#ffffff",
    letterSpacing: 0.5,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ffffff",
  },
  inactiveTab: {
    fontWeight: "900",
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.5,
    letterSpacing: 0.5,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ffffff",
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionLabel: {
    fontSize: 12,
    opacity: 0.8,
    letterSpacing: 0.5,
    color: "#ffffff",
    fontWeight: "500",
    marginBottom: 6,
  },
  addButton: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.tertiary,
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    color: "white",
  },
  shuffleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: 65,
  },
  shuffleText: {
    color: colors.accent,
    fontSize: 12,
  },
  emptyText: {
    color: "#666",
    fontSize: 13,
    marginTop: 8,
  },
});

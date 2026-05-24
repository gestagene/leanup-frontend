import { colors } from "@/constants/colorscheme";
import { WorkoutPlan, workoutService } from "@/services/workout.service";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SessionState = "warmup" | "exercise" | "cooldown" | "complete";

type WarmupExercise = {
  name: string;
  duration: string;
  instruction: string;
};

type SetLog = {
  set_number: number;
  reps_completed: number;
  weight_kg: number;
  is_completed: boolean;
};

const WARMUP_EXERCISES: WarmupExercise[] = [
  {
    name: "Light Jog / March in Place",
    duration: "2 min",
    instruction: "Keep a comfortable pace to raise your heart rate gradually.",
  },
  {
    name: "Arm Circles",
    duration: "1 min",
    instruction:
      "Extend arms and rotate in large circles, forward and backward.",
  },
  {
    name: "Hip Circles",
    duration: "1 min",
    instruction:
      "Hands on hips, rotate in large circles to loosen up the hip flexors.",
  },
];

const COOLDOWN_EXERCISES: WarmupExercise[] = [
  {
    name: "Standing Quad Stretch",
    duration: "1 min",
    instruction:
      "Hold each leg for 30 seconds, keep balance by focusing on a point ahead.",
  },
  {
    name: "Chest Opener Stretch",
    duration: "1 min",
    instruction: "Clasp hands behind back, open chest and hold.",
  },
  {
    name: "Child's Pose",
    duration: "2 min",
    instruction: "Kneel and extend arms forward, breathe deeply and relax.",
  },
];

const DEFAULT_REST_SECONDS = 180; // 3 minutes

export default function SessionScreen() {
  const { sessionId, planId } = useLocalSearchParams<{
    sessionId: string;
    planId: string;
  }>();

  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionState, setSessionState] = useState<SessionState>("warmup");

  // warmup/cooldown
  const [genericIndex, setGenericIndex] = useState(0);

  // exercise state
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [completedSets, setCompletedSets] = useState<SetLog[]>([]);

  // rest timer
  const [restActive, setRestActive] = useState(false);
  const [restSeconds, setRestSeconds] = useState(DEFAULT_REST_SECONDS);
  const restInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // session tracking
  const [startTime] = useState(new Date());
  const [sessionComplete, setSessionComplete] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((n) => n + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchPlan();
    return () => {
      if (restInterval.current) clearInterval(restInterval.current);
    };
  }, []);

  useEffect(() => {
    // fade in on state/exercise change
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [sessionState, exerciseIndex, currentSet]);

  useEffect(() => {
    if (restActive && restSeconds > 0) {
      restInterval.current = setInterval(() => {
        setRestSeconds((s) => s - 1);
      }, 1000);
    } else if (restSeconds === 0) {
      stopRestTimer();
    }
    return () => {
      if (restInterval.current) clearInterval(restInterval.current);
    };
  }, [restActive, restSeconds]);

  const fetchPlan = async () => {
    try {
      const plans = await workoutService.getPlans();
      const found = plans.find((p: WorkoutPlan) => p.id === planId);
      setPlan(found ?? null);
    } catch (err) {
      console.error("Failed to fetch plan:", err);
    } finally {
      setLoading(false);
    }
  };

  const startRestTimer = () => {
    setRestSeconds(DEFAULT_REST_SECONDS);
    setRestActive(true);
  };

  const stopRestTimer = () => {
    setRestActive(false);
    if (restInterval.current) clearInterval(restInterval.current);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const getDuration = () => {
    const diff = Math.floor(
      (new Date().getTime() - startTime.getTime()) / 1000,
    );
    return formatTime(diff);
  };

  const handleExitConfirm = () => {
    Alert.alert("Exit Workout?", "Your progress will be saved as incomplete.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Exit",
        style: "destructive",
        onPress: () => router.back(),
      },
    ]);
  };

  const handleCompleteSet = async () => {
    const repsNum = parseInt(reps) || 0;
    const weightNum = parseFloat(weight) || 0;
    const exercise = plan!.workout_plan_exercises[exerciseIndex];

    try {
      await workoutService.logSet(sessionId, {
        exercise_name: exercise.exercise_name,
        set_number: currentSet,
        reps_completed: repsNum,
        weight_kg: weightNum,
        is_completed: true,
      });

      setCompletedSets((prev) => [
        ...prev,
        {
          set_number: currentSet,
          reps_completed: repsNum,
          weight_kg: weightNum,
          is_completed: true,
        },
      ]);

      const totalSets = exercise.sets;
      if (currentSet < totalSets) {
        setCurrentSet((s) => s + 1);
        setReps("");
        setWeight("");
        startRestTimer();
      } else {
        // move to next exercise or cooldown
        stopRestTimer();
        handleNextExercise();
      }
    } catch (err) {
      console.error("Failed to log set:", err);
    }
  };

  const handleNextExercise = () => {
    const exercises = plan!.workout_plan_exercises;
    if (exerciseIndex < exercises.length - 1) {
      setExerciseIndex((i) => i + 1);
      setCurrentSet(1);
      setReps("");
      setWeight("");
      setCompletedSets([]);
      stopRestTimer();
    } else {
      setSessionState("cooldown");
      setGenericIndex(0);
    }
  };

  const handleSkipExercise = () => {
    Alert.alert("Skip Exercise?", "This exercise won't be logged.", [
      { text: "Cancel", style: "cancel" },
      { text: "Skip", onPress: handleNextExercise },
    ]);
  };

  const handleFinishSession = async () => {
    try {
      await workoutService.finishSession(sessionId);
      setSessionState("complete");
    } catch (err) {
      console.error("Failed to finish session:", err);
    }
  };

  const handleGenericNext = (type: "warmup" | "cooldown") => {
    const list = type === "warmup" ? WARMUP_EXERCISES : COOLDOWN_EXERCISES;
    if (genericIndex < list.length - 1) {
      setGenericIndex((i) => i + 1);
    } else {
      if (type === "warmup") {
        setSessionState("exercise");
        setGenericIndex(0);
      } else {
        handleFinishSession();
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  // ── WARMUP / COOLDOWN ──────────────────────────────────────────
  if (sessionState === "warmup" || sessionState === "cooldown") {
    const list =
      sessionState === "warmup" ? WARMUP_EXERCISES : COOLDOWN_EXERCISES;
    const current = list[genericIndex];
    const isLast = genericIndex === list.length - 1;

    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.topBar}>
            <Text style={styles.timerText}>{getDuration()}</Text>
            <Text style={styles.phaseLabel}>
              {sessionState === "warmup" ? "WARM UP" : "COOL DOWN"}
            </Text>
            <TouchableOpacity onPress={handleExitConfirm}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>

          {/* Step indicator */}
          <View style={styles.stepIndicator}>
            {list.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.stepDot,
                  i === genericIndex && styles.stepDotActive,
                  i < genericIndex && styles.stepDotDone,
                ]}
              />
            ))}
          </View>

          {/* Content */}
          <View style={styles.genericContent}>
            <Text style={styles.genericDuration}>{current.duration}</Text>
            <Text style={styles.exerciseName}>{current.name}</Text>
            <Text style={styles.genericInstruction}>{current.instruction}</Text>
          </View>

          {/* Actions */}
          <View style={styles.bottomActions}>
            <TouchableOpacity
              onPress={() => {
                if (sessionState === "warmup") {
                  setSessionState("exercise");
                } else {
                  handleFinishSession();
                }
              }}
              style={styles.skipButton}
            >
              <Text style={styles.skipText}>
                Skip {sessionState === "warmup" ? "Warmup" : "Cooldown"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleGenericNext(sessionState)}
              style={styles.checkButton}
            >
              <Ionicons
                name={isLast ? "checkmark-done" : "checkmark"}
                size={32}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // ── COMPLETE ───────────────────────────────────────────────────
  if (sessionState === "complete") {
    const totalSets = completedSets.length;
    const exercises = plan?.workout_plan_exercises ?? [];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.completeContainer}>
          <Ionicons name="trophy" size={64} color="#F59E0B" />
          <Text style={styles.completeTitle}>Workout Complete!</Text>
          <Text style={styles.completeSub}>
            Great work. Here's your summary:
          </Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>{getDuration()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Exercises</Text>
              <Text style={styles.summaryValue}>{exercises.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sets logged</Text>
              <Text style={styles.summaryValue}>{totalSets}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.doneButton}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── EXERCISE ───────────────────────────────────────────────────
  const exercises =
    plan?.workout_plan_exercises.sort(
      (a, b) => a.order_index - b.order_index,
    ) ?? [];
  const currentExercise = exercises[exerciseIndex];
  const totalSets = currentExercise?.sets ?? 3;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={styles.timerText}>{getDuration()}</Text>
          <Text style={styles.phaseLabel}>
            {exerciseIndex + 1} / {exercises.length}
          </Text>
          <TouchableOpacity onPress={handleExitConfirm}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* GIF */}
        {currentExercise?.gif_url ? (
          <Image
            source={{ uri: currentExercise.gif_url }}
            style={styles.gif}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.gifPlaceholder}>
            <Ionicons name="barbell-outline" size={64} color="#444" />
          </View>
        )}

        {/* Exercise info */}
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>
            {currentExercise?.exercise_name}
          </Text>
          <Text style={styles.setCounter}>
            Set {currentSet} of {totalSets}
          </Text>

          {/* Set dots */}
          <View style={styles.setDots}>
            {Array.from({ length: totalSets }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.setDot,
                  i < currentSet - 1 && styles.setDotDone,
                  i === currentSet - 1 && styles.setDotActive,
                ]}
              />
            ))}
          </View>

          {/* Rest timer */}
          {restActive && (
            <View style={styles.restTimer}>
              <Ionicons name="timer-outline" size={16} color="#F59E0B" />
              <Text style={styles.restTimerText}>
                Rest {formatTime(restSeconds)}
              </Text>
              <TouchableOpacity onPress={stopRestTimer}>
                <Text style={styles.skipRestText}>Skip rest</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Weight + reps input */}
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                value={weight}
                onChangeText={setWeight}
                placeholder="0"
                placeholderTextColor="#666"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Reps</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={reps}
                onChangeText={setReps}
                placeholder={String(currentExercise?.reps ?? 10)}
                placeholderTextColor="#666"
              />
            </View>
          </View>
        </View>

        {/* Bottom actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            onPress={handleSkipExercise}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>Skip exercise</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCompleteSet}
            style={styles.checkButton}
          >
            <Ionicons name="checkmark" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  timerText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    minWidth: 50,
  },
  phaseLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: 12,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#333",
  },
  stepDotActive: {
    backgroundColor: colors.accent,
    width: 20,
  },
  stepDotDone: {
    backgroundColor: "#2fa83d",
  },
  gif: {
    width: "100%",
    height: "45%",
    backgroundColor: "#1a1a1a",
  },
  gifPlaceholder: {
    width: "100%",
    height: "45%",
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseInfo: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 8,
  },
  exerciseName: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  setCounter: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  setDots: {
    flexDirection: "row",
    gap: 6,
  },
  setDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#333",
  },
  setDotActive: {
    backgroundColor: colors.accent,
    width: 24,
    borderRadius: 5,
  },
  setDotDone: {
    backgroundColor: "#2fa83d",
  },
  restTimer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1a1500",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  restTimerText: {
    color: "#F59E0B",
    fontSize: 14,
    fontWeight: "700",
  },
  skipRestText: {
    color: "#F59E0B",
    fontSize: 12,
    opacity: 0.7,
    marginLeft: 4,
    textDecorationLine: "underline",
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  inputGroup: {
    flex: 1,
    gap: 6,
  },
  inputLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "white",
    borderRadius: 10,
    padding: 14,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  genericContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  genericDuration: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  genericInstruction: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 8,
  },
  bottomActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: 14,
    opacity: 0.7,
  },
  checkButton: {
    backgroundColor: colors.accent,
    width: "70%",
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  completeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 16,
  },
  completeTitle: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "800",
  },
  completeSub: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  summaryCard: {
    backgroundColor: colors.tertiary,
    borderRadius: 12,
    padding: 20,
    width: "100%",
    gap: 12,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  doneButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
    marginTop: 8,
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});

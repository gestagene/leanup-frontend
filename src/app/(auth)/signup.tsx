import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import {
  UserCredentials,
  UserFitnessLevel,
  UserGoal,
  UserProfile,
  UserSex,
} from "@/types/user.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Checkbox } from "expo-checkbox";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrolLRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const headers = [
    "Welcome",
    "Goals",
    "Goals",
    "About You",
    "About You",
    "Create Account",
    "Account Created",
  ];

  const [formData, setFormData] = useState<Omit<UserProfile, "id">>({
    first_name: "",
    age: 0,
    height: 0,
    weight: 0,
    sex: null,
    goal: null,
    fitness_level: null,
  });

  const [credentials, setCredentials] = useState<UserCredentials>({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.signUp(credentials.email, credentials.password);
      const session = await authService.getSession();
      if (!session) throw new Error("Session Timeout");
      await userService.createProfile({ id: session.user.id, ...formData });
      goNext();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goals: { label: string; value: UserGoal }[] = [
    { label: "General Fitness", value: "general_fitness" },
    { label: "Lose Weight", value: "lose_weight" },
    { label: "Build Muscle", value: "build_muscle" },
    { label: "Maintain", value: "maintain" },
  ];

  const fitnessLevel: { label: string; value: UserFitnessLevel }[] = [
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
  ];

  const sex: { label: string; value: UserSex }[] = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const totalPages = 7;
  const { width } = Dimensions.get("window");
  const goNext = () => {
    scrolLRef.current?.scrollTo({
      x: width * (currentPage + 1),
      animated: true,
    });
    setCurrentPage((prev) => prev + 1);
  };
  const goPrev = () => {
    if (currentPage === 0) {
      router.push("/" as any);
      return;
    }
    scrolLRef.current?.scrollTo({
      x: width * (currentPage - 1),
      animated: true,
    });
    setCurrentPage((prev) => prev - 1);
  };
  const updateField = (field: keyof Omit<UserProfile, "id">, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{headers[currentPage]}</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${((currentPage + 1) / totalPages) * 100}%` },
          ]}
        />
      </View>
      <ScrollView
        ref={scrolLRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <View style={styles.page}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              First, tell us something about yourself.
            </Text>
            <Text style={styles.subtitle}>What's your first name?</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Preffered name</Text>
            <TextInput
              style={[
                styles.input,
                formData.first_name.length > 0 && styles.selected,
              ]}
              value={formData.first_name}
              onChangeText={(value) => updateField("first_name", value)}
            />
          </View>
        </View>
        <View style={styles.page}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Next, let’s set your goal.</Text>
            <Text style={styles.subtitle}>
              Tell us what you’d like to achieve so we can personalize your
              plan.
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select one to focus on</Text>
            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.value}
                style={[
                  styles.section,
                  formData.goal === goal.value && styles.selected,
                ]}
                onPress={() => updateField("goal", goal.value)}
              >
                <Text style={styles.sectionText}>{goal.label}</Text>
                <Checkbox
                  color={formData.goal === goal.value ? "#7961c2" : "#ffffff"}
                  value={formData.goal === goal.value}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.page}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>What's your fitness level?</Text>
            <Text style={styles.subtitle}>
              So we can recommend workouts that feel just right.
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}></Text>
            {fitnessLevel.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.section,
                  formData.fitness_level === level.value && styles.selected,
                ]}
                onPress={() => updateField("fitness_level", level.value)}
              >
                <Text style={styles.sectionText}>{level.label}</Text>
                <Checkbox
                  color={
                    formData.fitness_level === level.value
                      ? "#7961c2"
                      : "#ffffff"
                  }
                  value={formData.fitness_level === level.value}
                  onValueChange={() =>
                    updateField("fitness_level", level.value)
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.page}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Just a few more questions.</Text>
            <Text style={styles.subtitle}>
              We'd like to know you a little better.
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Please select your sex.</Text>
          </View>
          <View style={styles.sexContainer}>
            {sex.map((sex) => (
              <TouchableOpacity
                key={sex.value}
                onPress={() => updateField("sex", sex.value)}
                style={[
                  styles.sexButton,
                  formData.sex === sex.value && styles.selected,
                ]}
              >
                <Text style={styles.sexInput}>{sex.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>How old are you?</Text>
            <TextInput
              keyboardType={"numeric"}
              style={styles.input}
              value={formData.age === 0 ? "" : formData.age.toString()}
              onChangeText={(value) => updateField("age", Number(value))}
            />
          </View>
        </View>
        <View style={styles.page}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>We're almost there!</Text>
            <Text style={styles.subtitle}>Just a few final details..</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>How tall are you?</Text>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={[styles.input, { width: "70%" }]}
                keyboardType="numeric"
                value={formData.height === 0 ? "" : formData.height.toString()}
                onChangeText={(value) => updateField("height", Number(value))}
              />
              <Text style={styles.metricUnit}>cm</Text>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>What's your current weight?</Text>
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={[styles.input, { width: "70%" }]}
                keyboardType="numeric"
                value={formData.weight === 0 ? "" : formData.weight.toString()}
                onChangeText={(value) => updateField("weight", Number(value))}
              />
              <Text style={styles.metricUnit}>kg</Text>
            </View>
          </View>
        </View>
        <View style={styles.page}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              We're almost finished! Let's create your account.
            </Text>
          </View>
          <View style={[styles.inputContainer, { marginTop: -8 }]}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(value) =>
                setCredentials((prev) => ({ ...prev, email: value }))
              }
              style={styles.input}
              value={credentials.email}
            />
          </View>
          <View style={[styles.inputContainer, { marginTop: -19 }]}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={credentials.password}
              onChangeText={(value) =>
                setCredentials((prev) => ({ ...prev, password: value }))
              }
              secureTextEntry
              style={styles.input}
            />
          </View>
        </View>
        <View style={styles.page}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { fontSize: 24, textAlign: "center" }]}>
              Let's get to work, {formData.first_name}!
            </Text>
          </View>
          <View style={styles.createdContainer}>
            <Text style={styles.createdText}>
              The hardest part is starting and you just did it. We've
              personalized everything based on your goal.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.navContainer}>
        <TouchableOpacity onPress={goPrev} style={styles.prevButton}>
          <View style={styles.prevButtonInner}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={
            currentPage === totalPages - 2
              ? handleSubmit
              : currentPage === totalPages - 1
              ? () => router.replace("/tabs" as any)
              : goNext
          }
          style={styles.nextButton}
        >
          <Text style={styles.buttonText}>
            {currentPage === 5 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    width: Dimensions.get("window").width,
    alignItems: "center",
    flexWrap: "wrap",
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  headerContainer: {
    marginVertical: 12,
    alignItems: "center",
  },
  header: {
    fontSize: 18,
    minWidth: 300,
    color: "#cccccc",
    textAlign: "center",
  },
  titleContainer: {
    marginTop: 40,
    paddingHorizontal: 14,
    width: "100%",
  },
  title: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 5,
    letterSpacing: 0.8,
  },
  subtitle: {
    color: "#cecece",
    fontSize: 14,
    letterSpacing: 0.8,
  },
  label: {
    color: "#cccccc",
    fontSize: 12,
    letterSpacing: 0.8,
    fontWeight: 700,
    marginBottom: -3,
  },
  inputContainer: {
    paddingTop: 36,
    width: "100%",
    gap: 10,
    paddingHorizontal: 14,
  },
  input: {
    alignSelf: "center",
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
    width: "100%",
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    marginHorizontal: 24,
    marginTop: 12,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: "#2fa83d",
    borderRadius: 2,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  nextButton: {
    flex: 2,
  },
  prevButton: {
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    paddingHorizontal: 50,
    paddingVertical: 14,
    backgroundColor: "#7961c2",
    borderRadius: 100,
    textAlign: "center",
  },
  prevButtonInner: {
    backgroundColor: "#7961c2",
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#252525",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  sectionText: {
    color: "#ffffff",
    fontSize: 17,
    letterSpacing: 0.8,
    width: "80%",
  },
  selected: {
    borderWidth: 1,
    borderColor: "#7961c2",
  },
  sexContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 14,
    marginTop: 16,
    alignItems: "center",
  },
  sexButton: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
  },
  sexInput: {
    color: "#ffffff",
    fontSize: 17,
    letterSpacing: 0.8,
  },
  metricUnit: {
    flex: 1,
    color: "#cccccc",
    alignSelf: "center",
    textAlign: "center",
    borderColor: "#333",
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 17,
    fontSize: 16,
    marginHorizontal: 6,
  },
  invalidInput: {
    borderColor: "#ba2525",
    borderWidth: 1,
  },
  createdContainer: {
    flex: 1,
    marginVertical: 16,
  },
  createdText: {
    color: "#e5e5e5",
    fontSize: 16,
    letterSpacing: 0.8,
    textAlign: "center",
    marginHorizontal: 18,
  },
});

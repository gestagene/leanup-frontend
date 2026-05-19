import { colors } from "@/constants/colorscheme";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth.service";
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
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
  const { isEmailConfirmed } = useAuth();
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
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [created, setIsCreated] = useState(false);

  const calculateAge = (d: string, m: string, y: string) => {
    const today = new Date();
    const birthDate = new Date(Number(y), Number(m) - 1, Number(d));
    let age = today.getFullYear() - birthDate.getFullYear();
    const md = today.getMonth() - birthDate.getMonth();
    if (md < 0 || (md === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const [formData, setFormData] = useState<Omit<UserProfile, "id">>({
    name: "",
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
      await authService.signUp(credentials, formData);
      setIsCreated(true);
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
  const isPageValid = () => {
    switch (currentPage) {
      case 0:
        return formData.name.length > 0;
      case 1:
        return formData.goal !== null;
      case 2:
        return formData.fitness_level !== null;
      case 3:
        return formData.sex !== null && formData.age > 0;
      case 4:
        return formData.height > 0 && formData.weight > 0;
      case 5:
        return credentials.email.length > 0 && credentials.password.length > 0;
      default:
        return true;
    }
  };

  const handleNav = () => {
    if (currentPage === totalPages - 2) {
      if (created && isEmailConfirmed) {
        goNext();
      } else if (!created) {
        return handleSubmit();
      }
      return;
    }

    if (currentPage === totalPages - 1) {
      return router.replace("/(tabs)/Home" as any);
    }
    goNext();
  };

  const setDisable = () => {
    if (loading) {
      return true;
    }
    if (currentPage === totalPages - 2) {
      if (!created) {
        return !isPageValid();
      }
    }
    if (currentPage === totalPages - 1) return false;
    return !isPageValid();
  };

  const navContent = () => {
    const isLoading = loading || (created && !isEmailConfirmed);
    if (isLoading) {
      return <ActivityIndicator size="large" color="#ffffff" />;
    }
    return (
      <Text style={styles.buttonText}>
        {currentPage === totalPages - 2 ? "Submit" : "Next"}
      </Text>
    );
  };
  useEffect(() => {
    if (created && isEmailConfirmed) {
      setLoading(false);
      goNext();
    }
  }, [isEmailConfirmed]);

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
            <Text style={styles.subtitle}>What should we call you?</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Preffered name</Text>
            <TextInput
              style={[
                styles.input,
                formData.name.length > 0 && styles.selected,
              ]}
              value={formData.name}
              onChangeText={(value) => updateField("name", value)}
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
            <Text style={styles.label}>When is your birth day?</Text>
            <View style={styles.birthDateContainer}>
              <View style={styles.birthDate}>
                <TextInput
                  value={day}
                  maxLength={2}
                  keyboardType={"numeric"}
                  style={[styles.input, { borderRadius: 5 }]}
                  onChangeText={(value) => {
                    const curr = Number(value);
                    curr > 31 ? setDay("31") : setDay(value);

                    if (value && month && year && year.length === 4) {
                      updateField("age", calculateAge(value, month, year));
                    }
                  }}
                />
                <Text style={styles.label}>Day</Text>
              </View>
              <View style={styles.birthDate}>
                <TextInput
                  value={month}
                  maxLength={2}
                  keyboardType={"numeric"}
                  style={[styles.input, { borderRadius: 5 }]}
                  onChangeText={(value) => {
                    const curr = Number(value);
                    curr > 12 ? setMonth("12") : setMonth(value);

                    if (value && day && year && year.length === 4) {
                      updateField("age", calculateAge(day, value, year));
                    }
                  }}
                />
                <Text style={styles.label}>Month</Text>
              </View>
              <View style={styles.birthDate}>
                <TextInput
                  value={year}
                  maxLength={4}
                  keyboardType={"numeric"}
                  style={[styles.input, { borderRadius: 5 }]}
                  onChangeText={(value) => {
                    const curr = Number(value);
                    const currYear = new Date().getFullYear();

                    curr > currYear
                      ? setYear(currYear.toString())
                      : setYear(value);
                    if (value && day && month && value.length === 4) {
                      updateField("age", calculateAge(day, month, value));
                    }
                  }}
                />
                <Text style={styles.label}>Year</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.page}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Almost there!</Text>
            <Text style={styles.subtitle}>Just a few final details..</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Height:</Text>
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
            <Text style={styles.label}>Weight:</Text>
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
              Finally, Let's set up your account.
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
          {created && (
            <View style={styles.confirmationContainer}>
              <Text style={styles.confirmationText}>
                Confirmation link sent to {credentials.email}.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.page}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { fontSize: 24, textAlign: "center" }]}>
              Let's get to work, {formData.name}!
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
        {currentPage !== totalPages - 1 && (
          <TouchableOpacity onPress={goPrev} style={styles.prevButton}>
            <View style={styles.prevButtonInner}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => handleNav()}
          disabled={setDisable()}
          style={[styles.nextButton, setDisable() && styles.disabledButton]}
        >
          {navContent()}
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
    backgroundColor: colors.primary,
  },
  headerContainer: {
    marginVertical: 12,
    alignItems: "center",
  },
  header: {
    fontSize: 18,
    minWidth: 300,
    color: colors.textSecondary,
    textAlign: "center",
  },
  titleContainer: {
    marginTop: 30,
    paddingHorizontal: 14,
    width: "100%",
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 5,
    letterSpacing: 0.8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    letterSpacing: 0.8,
  },
  label: {
    color: colors.textSecondary,
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
    backgroundColor: colors.secondary,
    color: "#ffffff",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
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
    fontWeight: 800,
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
    padding: 12,
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
  disabledButton: {
    opacity: 0.5,
  },
  birthDateContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    flexDirection: "row",
    gap: 4,
  },
  birthDate: {
    flex: 1,
    flexDirection: "column",
    gap: 6,
    alignItems: "center",
  },
  confirmationContainer: {
    paddingVertical: 10,
  },
  confirmationText: {
    color: "#00D100",
    fontSize: 12,
    letterSpacing: 0.6,
    textAlign: "center",
  },
});

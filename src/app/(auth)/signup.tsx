import Ionicons from "@expo/vector-icons/Ionicons";
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
  const scrolLRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const headers = ["Welcome", "Goals", "About You", "Create Account"];

  const totalPages = 5;
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Ready to Lean Up?</Text>
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
            <Text style={styles.label}>Preffered Name</Text>
            <TextInput style={styles.input} />
          </View>
        </View>
      </ScrollView>

      <View style={styles.navContainer}>
        <TouchableOpacity onPress={goPrev} style={styles.prevButton}>
          <View style={styles.prevButtonInner}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={goNext} style={styles.nextButton}>
          <Text style={styles.buttonText}>
            {currentPage === totalPages - 1 ? "Finish" : "Next"}
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
  },
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  headerContainer: {
    paddingVertical: 12,
    alignItems: "center",
  },
  header: {
    fontSize: 18,
    minWidth: 300,
    color: "#cccccc",
    textAlign: "center",
  },
  titleContainer: {
    paddingTop: 50,
  },
  title: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    paddingBottom: 5,
    letterSpacing: 0.8,
  },
  subtitle: {
    color: "#e5e5e5",
    fontSize: 14,
    letterSpacing: 0.8,
  },
  label: {
    color: "#cccccc",
    width: 98,
    fontSize: 12,
    letterSpacing: 0.8,
  },
  inputContainer: {
    paddingTop: 36,
    width: "86%",
    gap: 10,
  },
  input: {
    alignSelf: "center",
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
    borderRadius: 10,
    padding: 16,
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
    justifyContent: "space-around",
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
    backgroundColor: "#322861",
    borderRadius: 100,
    textAlign: "center",
  },
  prevButtonInner: {
    backgroundColor: "#322861",
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 26,
    alignItems: "center",
    justifyContent: "center",
  },
});

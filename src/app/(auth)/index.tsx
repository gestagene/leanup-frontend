import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/logo/logo1.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Image
          source={require("../../../assets/logo/leanup.png")}
          style={styles.logoText}
          resizeMode="contain"
        />
      </View>
      <View style={styles.taglineContainer}>
        <Text style={styles.tagline}>Turn Goals Into Results</Text>
        <Text style={styles.taglineSub}>Track. Train. Transform</Text>
      </View>
      <View style={styles.horizontalRule}></View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => router.push("/signup")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>GET STARTED</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/signin")}
          style={styles.secondButton}
        >
          <Text style={styles.existingUser}>Already a user?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
  },
  logoImage: {
    width: 335,
    height: 335,
    resizeMode: "contain",
    marginTop: -40,
  },
  logoText: {
    width: 400,
    height: 200,
    resizeMode: "contain",
    marginTop: -175,
  },
  taglineContainer: {
    alignItems: "center",
    paddingBottom: 40,
    gap: 4,
  },
  tagline: {
    color: "#ffffff",
    fontSize: 21,
    fontWeight: "400",
    fontStyle: "italic",
    letterSpacing: 1.2,
  },
  taglineSub: {
    color: "#aaaaaa",
    fontSize: 17,
    fontStyle: "italic",
  },
  buttonContainer: {
    paddingHorizontal: 50,
    paddingBottom: 70,
  },
  button: {
    backgroundColor: "#d0d0d0",
    borderRadius: 50,
    paddingVertical: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#1a1a1a",
    fontStyle: "italic",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 2,
  },
  horizontalRule: {
    backgroundColor: "#d0d0d0",
    borderRadius: 50,
    alignSelf: "center",
    width: "80%",
    height: 1,
    marginTop: -15,
    marginBottom: 30,
  },
  secondButton: {
    paddingTop: 10,
  },
  existingUser: {
    color: "#e5e5e5",
    textAlign: "center",
    fontStyle: "italic",
    fontSize: 16,
    letterSpacing: 1,
  },
});

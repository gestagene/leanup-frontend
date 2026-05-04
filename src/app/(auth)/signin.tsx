import ErrorMessage from "@/components/ErrorMessage";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import type { UserCredentials } from "@/types/user.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<UserCredentials>({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.signIn(credentials.email, credentials.password);
      const session = await authService.getSession();
      if (!session) throw new Error("Session Timeout");
      await userService.getProfile(session.user.id);
      router.replace("/Home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={styles.prevButton}
        >
          <View style={styles.prevButtonInner}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <Text style={styles.header}>Login</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          keyboardType={"email-address"}
          value={credentials.email}
          onChangeText={(value) =>
            setCredentials((prev) => ({ ...prev, email: value }))
          }
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
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
      <View style={styles.utilityActions}>
        <TouchableOpacity>
          <Text style={styles.utilityText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View>
        <ErrorMessage message={error} />
      </View>
      <View style={styles.horizontalRule}></View>
      <View>
        <Text style={styles.or}>OR</Text>
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
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
  },
  logoImage: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  logoText: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginTop: -175,
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#171717",
    padding: 8,
    alignItems: "center",
    gap: "29%",
  },
  header: {
    fontSize: 18,
    width: "14%",
    color: "#cccccc",
    textAlign: "center",
    alignSelf: "center",
  },
  label: {
    color: "#cccccc",
    fontSize: 12,
    letterSpacing: 0.8,
    fontWeight: 700,
    marginBottom: -3,
  },
  inputContainer: {
    marginTop: 36,
    marginBottom: -4,
    width: "100%",
    gap: 10,
    paddingHorizontal: 16,
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
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: 36,
  },
  button: {
    backgroundColor: "#d0d0d0",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#1a1a1a",
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  utilityActions: {
    width: "100%",
    gap: 9,
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  utilityText: {
    color: "#cccccc",
    fontSize: 14,
    fontWeight: 700,
  },
  prevButton: {
    alignItems: "center",
  },
  prevButtonInner: {
    backgroundColor: "#7961c2",
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  horizontalRule: {
    backgroundColor: "#d1d1d1",
    borderRadius: 50,
    alignSelf: "center",
    width: "90%",
    height: 0.5,
    marginTop: 62,
  },
  or: {
    backgroundColor: "#1a1a1a",
    textAlign: "center",
    height: "100%",
    alignSelf: "center",
    inset: 0,
    top: -10,
    width: "15%",
    color: "#d1d1d1",
    fontSize: 14,
    fontWeight: 300,
    letterSpacing: 0.8,
  },
});

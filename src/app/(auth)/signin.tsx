import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/logo/logo1.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Image
          source={require("../../../assets/logo/leanup.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View className="flex-1"></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111113'
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 250,
    height: 250
  }
})
import { colors } from "@/constants/colorscheme";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.primary,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom + 8,
            paddingTop: 2,
          },
          tabBarActiveTintColor: "#7961c2",
          tabBarInactiveTintColor: "#555",
          tabBarLabelStyle: { fontSize: 9 },
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="view-dashboard-outline"
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Workout"
          options={{
            title: "Workout",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="dumbbell" size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="Chat"
          options={{
            title: "A.I Assistant",
            tabBarIcon: () => (
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: colors.accent,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                  borderWidth: 2,
                  borderColor: colors.border,
                }}
              >
                <Entypo name="paper-plane" size={24} color="white" />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="Nutrition"
          options={{
            title: "Nutrition",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="food-drumstick"
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Analytics"
          options={{
            title: "Analytics",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="google-analytics"
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tabs>

      <TouchableOpacity style={styles.fab}>
        <FontAwesome6 name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: "15%",
    right: "5%",
    width: 50,
    height: 50,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    opacity: 0.7,
  },
});

import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#111",
          borderTopColor: "#2a2a2a",
          borderTopWidth: 0.5,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 2,
        },
        tabBarActiveTintColor: "#7961c2",
        tabBarInactiveTintColor: "#555",
        tabBarLabelStyle: { fontSize: 10 },
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
          title: "A.I Coach",
          tabBarIcon: () => (
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: "#7961c2",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
                borderWidth: 3,
                borderColor: "#111",
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
  );
}

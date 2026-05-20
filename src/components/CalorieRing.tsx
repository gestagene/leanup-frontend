import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type RingProps = {
  calories: number;
  maxCalories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export default function CalorieRing({
  calories,
  maxCalories,
  protein,
  carbs,
  fats,
}: RingProps) {
  const size = 130;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // calculate progress for each ring
  const calorieProgress = Math.min(calories / maxCalories, 1);
  const proteinProgress = Math.min(protein / 150, 1); // 150g max
  const carbsProgress = Math.min(carbs / 250, 1); // 250g max
  const fatsProgress = Math.min(fats / 65, 1);

  //calculate remaining
  const remaining = Math.max(maxCalories - calories, 0);

  const getOffset = (progress: number) =>
    circumference - progress * circumference;

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        {/* background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2a2a2a"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* calories progress */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#7961c2"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={getOffset(calorieProgress)}
          strokeLinecap="round"
        />
      </Svg>
      <View
        style={{
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 24, fontWeight: "700" }}>
          {remaining}
        </Text>
        <Text
          style={{
            color: "#ffffff",
            opacity: 0.75,
            fontSize: 12,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Remaining
        </Text>
      </View>
    </View>
  );
}

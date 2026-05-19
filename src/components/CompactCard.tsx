import { colors } from "@/constants/colorscheme";
import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type status = "finished" | "inProgress";

export default function CompactCard({
  title,
  status,
}: {
  title: string;
  status?: status;
}) {
  return (
    <View
      style={[
        styles.card,
        {
          borderWidth: status ? 1 : 0,
          borderColor: status === "finished" ? colors.success : colors.warning,
        },
      ]}
    >
      <View style={styles.leftContainer}>
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={styles.importantText}
        >
          {title}
        </Text>
      </View>
      <TouchableOpacity>
        <Feather name="more-horizontal" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.tertiary,
    width: "100%",
    height: 45,
    borderRadius: 6,
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  importantText: {
    color: colors.textSecondary,
    fontSize: 14,
    letterSpacing: 0.5,
    fontWeight: 800,
  },
});

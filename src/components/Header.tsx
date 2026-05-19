import { colors } from "@/constants/colorscheme";
import { StyleSheet, Text, View } from "react-native";

export default function Header({ content }: { content: string }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.avatar}>
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={[styles.normalText, { fontWeight: 800, fontSize: 14 }]}
        >
          G
        </Text>
      </View>
      <View style={styles.greetingsContainer}>
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={styles.greetingsText}
        >
          {content}
        </Text>
      </View>
      <View style={{ width: 30 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: colors.secondary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  greetingsContainer: {
    alignItems: "center",
    flex: 1,
  },
  greetingsText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: 0.6,
    flexShrink: 1,
    textAlign: "center",
    alignItems: "center",
    fontStyle: "italic",
  },
  normalText: {
    color: colors.textSecondary,
    fontSize: 10,
    letterSpacing: 0.5,
    textAlign: "center",
    fontWeight: 300,
  },
});

import { colors } from "@/constants/colorscheme";
import { useProfile } from "@/hooks/useProfile";
import { authService } from "@/services/auth.service";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Header({
  content,
  initial,
}: {
  content: string;
  initial?: string;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { profile } = useProfile();
  const displayInitial = profile?.name?.charAt(0).toUpperCase() ?? "?";

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await authService.signOut();
      router.replace("/(auth)");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoggingOut(false);
      setModalVisible(false);
    }
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.avatar}
        >
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[styles.normalText, { fontWeight: "800", fontSize: 14 }]}
          >
            {displayInitial}
          </Text>
        </TouchableOpacity>
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

      {/* Profile Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            {/* Avatar */}
            <View style={styles.modalAvatar}>
              <Text style={styles.modalInitial}>{displayInitial}</Text>
            </View>

            <View style={styles.divider} />

            {/* Logout */}
            <TouchableOpacity
              onPress={handleLogout}
              disabled={loggingOut}
              style={styles.logoutButton}
            >
              {loggingOut ? (
                <ActivityIndicator size="small" color="#EF4444" />
              ) : (
                <Text style={styles.logoutText}>Sign Out</Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
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
    fontWeight: "600",
    letterSpacing: 0.6,
    flexShrink: 1,
    textAlign: "center",
    fontStyle: "italic",
  },
  normalText: {
    color: colors.textPrimary,
    fontSize: 10,
    letterSpacing: 0.5,
    textAlign: "center",
    fontWeight: "300",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    paddingTop: 100,
    paddingLeft: 16,
  },
  modalContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    width: 180,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  modalInitial: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  logoutButton: {
    alignItems: "center",
    paddingVertical: 4,
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});

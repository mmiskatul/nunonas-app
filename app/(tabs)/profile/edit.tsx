// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Calendar } from "react-native-calendars";
import * as ImagePicker from "expo-image-picker";
import theme from "../../../constants/theme";
import { getMe, updatePersonalDetails, uploadProfileImage } from "../../../lib/customer-api";
import ProfileAvatarPlaceholder from "../../../components/tabs/profile/ProfileAvatarPlaceholder";

function InputField({
  label,
  value,
  onChangeText,
  icon,
  placeholder,
  onPress,
  editable = true,
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity
        activeOpacity={onPress ? 0.7 : 1}
        onPress={onPress}
        style={styles.inputWrapper}
      >
        <TextInput
          style={[
            styles.input,
            !editable && { color: theme.COLORS.textPrimary },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.COLORS.textSecondary}
          editable={editable}
          pointerEvents={onPress ? "none" : "auto"}
        />
        {icon && (
          <Ionicons name={icon} size={20} color={theme.COLORS.textPrimary} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const EditProfileScreen = () => {
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dob: "",
    memberSince: "",
    imageUrl: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const profile = await getMe();
        if (!active) {
          return;
        }

        setFormData({
          fullName: profile.full_name || "",
          email: profile.email || "",
          phoneNumber: profile.phone || "",
          dob: profile.date_of_birth || "",
          memberSince: profile.member_since || "",
          imageUrl: profile.profile_image_url || "",
        });
      } catch (error) {
        if (active) {
          Alert.alert("Profile unavailable", error.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleSave = async () => {
    const fullName = formData.fullName.trim();
    if (fullName.length < 2) {
      Alert.alert("Full name required", "Please enter your full name.");
      return;
    }

    try {
      setSaving(true);
      let imageUrl = formData.imageUrl;

      if (selectedImage) {
        setUploadingImage(true);
        const upload = await uploadProfileImage(selectedImage);
        imageUrl = upload?.profile_image_url ?? imageUrl;
      }

      const updated = await updatePersonalDetails({
        full_name: fullName,
        email: formData.email.trim().toLowerCase() || null,
        phone: formData.phoneNumber.trim() || null,
        date_of_birth: formData.dob || null,
      });
      setFormData((current) => ({
        ...current,
        fullName: updated.full_name || current.fullName,
        email: updated.email || "",
        phoneNumber: updated.phone || "",
        dob: updated.date_of_birth || "",
        memberSince: updated.member_since || current.memberSince,
        imageUrl,
      }));
      setSelectedImage(null);
      router.back();
    } catch (error) {
      Alert.alert("Save failed", error.message);
    } finally {
      setUploadingImage(false);
      setSaving(false);
    }
  };

  const handleSelectImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow photo library access to update your profile image."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const asset = result.assets[0];
      setSelectedImage(asset);
      setFormData((current) => ({
        ...current,
        imageUrl: asset.uri ?? current.imageUrl,
      }));
    } catch (error) {
      Alert.alert("Image unavailable", error.message);
    }
  };

  const onDateSelect = (day) => {
    setFormData({ ...formData, dob: day.dateString });
    setShowCalendar(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={theme.COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.COLORS.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileSection}>
          <View style={styles.imageWrapper}>
            {formData.imageUrl ? (
              <Image source={{ uri: formData.imageUrl }} style={styles.profileImage} />
            ) : (
              <ProfileAvatarPlaceholder size={120} style={styles.profileImage} />
            )}
            <TouchableOpacity style={styles.editImageButton} onPress={handleSelectImage} activeOpacity={0.85}>
              <Ionicons name="camera-outline" size={18} color={theme.COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{formData.fullName}</Text>
          <Text style={styles.userStatus}>
            {formData.memberSince ? `Member since ${formData.memberSince}` : "Personal details"}
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Personal Information</Text>

          <InputField
            label="Full Name"
            value={formData.fullName}
            onChangeText={(text) =>
              setFormData({ ...formData, fullName: text })
            }
          />

          <InputField
            label="Email Address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />

          <InputField
            label="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, phoneNumber: text })
            }
          />

          <InputField
            label="Date of Birth"
            value={formData.dob}
            onChangeText={(text) => setFormData({ ...formData, dob: text })}
            icon="calendar-outline"
            onPress={() => setShowCalendar(true)}
            editable={false}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (saving || uploadingImage) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={saving || uploadingImage}
          >
            <Text style={styles.saveButtonText}>
              {uploadingImage ? "Uploading image..." : saving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={() => router.back()}>
            <Text style={styles.logoutButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCalendar(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.calendarContainer}>
                <View style={styles.calendarHeader}>
                  <Text style={styles.calendarTitle}>Select Date of Birth</Text>
                  <TouchableOpacity onPress={() => setShowCalendar(false)}>
                    <Ionicons
                      name="close"
                      size={24}
                      color={theme.COLORS.textPrimary}
                    />
                  </TouchableOpacity>
                </View>
                <Calendar
                  onDayPress={onDateSelect}
                  markedDates={{
                    [formData.dob]: {
                      selected: true,
                      disableTouchEvent: true,
                      selectedColor: theme.COLORS.primary,
                    },
                  }}
                  theme={{
                    todayTextColor: theme.COLORS.primary,
                    todayFontWeight: "bold",
                    arrowColor: theme.COLORS.primary,
                    textMonthFontWeight: "800",
                    textDayHeaderFontWeight: "600",
                    selectedDayBackgroundColor: theme.COLORS.primary,
                    selectedDayTextColor: theme.COLORS.white,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profileSection: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 15,
  },
  editImageButton: {
    position: "absolute",
    right: 6,
    bottom: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.COLORS.white,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: theme.COLORS.white,
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
  userStatus: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
    marginTop: 4,
  },
  formCard: {
    backgroundColor: theme.COLORS.white,
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.COLORS.textSecondary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: theme.COLORS.textPrimary,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 20,
    marginTop: 30,
    gap: 15,
  },
  saveButton: {
    backgroundColor: theme.COLORS.primary,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  logoutButton: {
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  logoutButtonText: {
    color: theme.COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  calendarContainer: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 20,
    width: "100%",
    padding: 20,
    ...theme.SHADOWS.primary,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.COLORS.textPrimary,
  },
});

export default EditProfileScreen;



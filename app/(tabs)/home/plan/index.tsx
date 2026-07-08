// @ts-nocheck
import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme from "../../../../constants/theme";

// Import Components
import Step1 from "../../../../components/tabs/home/plan/Step1";
import Step2 from "../../../../components/tabs/home/plan/Step2";
import Step3 from "../../../../components/tabs/home/plan/Step3";
import Step4 from "../../../../components/tabs/home/plan/Step4";

export default function PlanScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [planData, setPlanData] = useState({
    companion: "",
    vibe: "",
    budget: "",
    area: "Anywhere in Doha",
    vouchersOnly: false,
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleComplete = () => {
    console.log("Plan Data:", planData);
    // Here you would typically navigate to results or call an API
    router.back();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            selectedId={planData.companion}
            onSelect={(id) => setPlanData({ ...planData, companion: id })}
          />
        );
      case 2:
        return (
          <Step2
            selectedId={planData.vibe}
            onSelect={(id) => setPlanData({ ...planData, vibe: id })}
          />
        );
      case 3:
        return (
          <Step3
            selectedId={planData.budget}
            onSelect={(id) => setPlanData({ ...planData, budget: id })}
          />
        );
      case 4:
        return (
          <Step4
            data={planData}
            setData={setPlanData}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return !planData.companion;
    if (currentStep === 2) return !planData.vibe;
    if (currentStep === 3) return !planData.budget;
    return false;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.COLORS.textPrimary}
          />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((step) => (
            <View
              key={step}
              style={[
                styles.progressDot,
                currentStep >= step && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
        <View style={{ width: 40 }} />
        {/* Placeholder for balance */}
      </View>

      {/* Content */}
      <View style={styles.content}>{renderStep()}</View>

      {/* Footer Navigation (only for steps before the last one) */}
      {currentStep < 4 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              isNextDisabled() && styles.continueButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={isNextDisabled()}
          >
            <Text style={styles.continueButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    flexDirection: "row",
    gap: 8,
  },
  progressDot: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.COLORS.border,
  },
  progressDotActive: {
    backgroundColor: theme.COLORS.primary,
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  continueButton: {
    backgroundColor: theme.COLORS.primary,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: theme.COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
});



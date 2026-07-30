import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../constants/theme";
import { addSaved, listSaved, removeSaved } from "../../lib/customer-api";
import { showToast } from "../../lib/toast";

type SaveButtonProps = {
  entityType: string;
  entityId?: string | null;
  compact?: boolean;
};

export default function SaveButton({ entityType, entityId, compact = false }: SaveButtonProps) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    if (!entityId) return () => { active = false; };
    listSaved<{ items?: Array<{ entity_type?: string; entity_id?: string }> }>()
      .then((payload) => {
        if (!active) return;
        setSaved(Boolean(payload?.items?.some((item) =>
          String(item.entity_type).toLowerCase() === entityType.toLowerCase() &&
          String(item.entity_id) === String(entityId),
        )));
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [entityId, entityType]);

  const toggle = async () => {
    if (!entityId || saving) return;
    const next = !saved;
    setSaved(next);
    setSaving(true);
    try {
      if (next) await addSaved(entityType, String(entityId));
      else await removeSaved(entityType, String(entityId));
      showToast(next ? "Saved successfully." : "Removed from saved items.", { type: "success" });
    } catch (error) {
      setSaved(!next);
      showToast(error instanceof Error ? error.message : "Could not update saved items.", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, compact && styles.compact]}
      onPress={(event) => { event.stopPropagation(); void toggle(); }}
      disabled={!entityId || saving}
      accessibilityRole="button"
      accessibilityLabel={saved ? "Remove from saved items" : "Save item"}
    >
      {saving ? <ActivityIndicator size="small" color={theme.COLORS.primary} /> : (
        <Ionicons name={saved ? "heart" : "heart-outline"} size={compact ? 20 : 24} color={saved ? "#ef4444" : theme.COLORS.textPrimary} />
      )}
      {!compact && <Text style={styles.label}>{saved ? "Saved" : "Save"}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { minWidth: 44, minHeight: 44, paddingHorizontal: 10, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 6 },
  compact: { width: 44, paddingHorizontal: 0 },
  label: { fontSize: 13, fontWeight: "700", color: theme.COLORS.textPrimary },
});

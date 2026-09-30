import { Feather, Ionicons } from "@expo/vector-icons";
import type React from "react";
import type { StyleProp, TextStyle } from "react-native";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function IonIcon({ name, size = 20, color = "#000", style }: IconProps) {
  const Comp = Ionicons as unknown as React.ComponentType<IconProps>;
  return <Comp name={name} size={size} color={color} style={style} />;
}

export function FeatherIcon({ name, size = 20, color = "#000", style }: IconProps) {
  const Comp = Feather as unknown as React.ComponentType<IconProps>;
  return <Comp name={name} size={size} color={color} style={style} />;
}

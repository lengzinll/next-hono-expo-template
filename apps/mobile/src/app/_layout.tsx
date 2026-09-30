import "../global.css";

import { Stack as ExpoStack } from "expo-router";
import type React from "react";

interface StackProps {
  screenOptions?: Record<string, unknown>;
  children?: React.ReactNode;
}

const Stack = ExpoStack as unknown as React.ComponentType<StackProps>;

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  );
}

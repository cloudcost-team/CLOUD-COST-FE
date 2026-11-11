"use client";

import { createContext, useContext } from "react";

type AppMode = {
  demo: boolean;
  basePath: string;
};

export const AppModeContext = createContext<AppMode>({
  demo: false,
  basePath: "",
});

export const DEMO_APP_MODE: AppMode = { demo: true, basePath: "/demo" };

export function useAppMode() {
  return useContext(AppModeContext);
}

export function useAppPath() {
  const { basePath } = useAppMode();
  return (path: string) => `${basePath}${path}`;
}

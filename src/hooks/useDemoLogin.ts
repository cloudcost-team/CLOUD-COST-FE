"use client";

import { useMutation } from "@tanstack/react-query";
import { loginDemo } from "@/api/demo";

export function useDemoLogin() {
  return useMutation({ mutationFn: loginDemo });
}

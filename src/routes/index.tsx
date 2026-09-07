import { createFileRoute } from "@tanstack/react-router";

import { LoginScreen } from "@/components/login-screen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Klyro AI | Autonomous SAP Integration Recovery" },
      {
        name: "description",
        content:
          "Klyro AI is an autonomous recovery agent for SAP Integration Suite — observe failed messages, heal payloads and re-trigger with human oversight.",
      },
      { property: "og:title", content: "Klyro AI | Autonomous SAP Recovery" },
      {
        property: "og:description",
        content: "Sign in to the Klyro AI cockpit for autonomous SAP integration recovery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginScreen,
});

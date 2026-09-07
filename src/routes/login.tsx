import { createFileRoute } from "@tanstack/react-router";

import { LoginScreen } from "@/components/login-screen";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In | Klyro AI Autonomous SAP Recovery" },
      {
        name: "description",
        content:
          "Sign in to Klyro AI to monitor, heal and re-trigger failed SAP Integration Suite messages autonomously.",
      },
      { property: "og:title", content: "Sign In | Klyro AI" },
      {
        property: "og:description",
        content: "Access the Klyro AI cockpit for autonomous SAP integration recovery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginScreen,
});

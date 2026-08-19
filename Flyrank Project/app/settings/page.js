import PlaceholderPage from "@/components/PlaceholderPage";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      eyebrow="Screen 03"
      title="Settings"
      description="This routed placeholder is ready for application settings and configuration controls."
      items={[
        { icon: "01", title: "General", text: "General application settings will be added here." },
        { icon: "02", title: "Notifications", text: "Notification preferences can be configured here." },
        { icon: "03", title: "Security", text: "Security and access controls can be added here." }
      ]}
    />
  );
}

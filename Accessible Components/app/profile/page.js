import PlaceholderPage from "@/components/PlaceholderPage";

export default function ProfilePage() {
  return (
    <PlaceholderPage
      eyebrow="Screen 02"
      title="Profile"
      description="This routed placeholder is ready for profile information, account details, and user actions."
      items={[
        { icon: "01", title: "Personal Details", text: "Profile information will be displayed here." },
        { icon: "02", title: "Preferences", text: "User preferences can be added in the next phase." },
        { icon: "03", title: "Account", text: "Account controls and status can live here." }
      ]}
    />
  );
}

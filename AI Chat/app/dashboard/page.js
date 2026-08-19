import PlaceholderPage from "@/components/PlaceholderPage";

export default function DashboardPage() {
  return (
    <PlaceholderPage
      eyebrow="Screen 01"
      title="Dashboard"
      description="This routed placeholder is ready for the dashboard features from your project specification."
      items={[
        { icon: "01", title: "Overview", text: "A space for key metrics and project activity." },
        { icon: "02", title: "Activity", text: "A future feed for recent updates and actions." },
        { icon: "03", title: "Insights", text: "A future section for charts and useful summaries." }
      ]}
    />
  );
}

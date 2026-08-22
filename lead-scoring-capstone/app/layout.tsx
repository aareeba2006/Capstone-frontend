import "./globals.css";

export const metadata = {
  title: "Lead Scoring Assistant",
  description: "AI SDK capstone — tool calling with typed tool parts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink">{children}</body>
    </html>
  );
}

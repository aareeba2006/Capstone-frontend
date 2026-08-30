import "./globals.css";

export const metadata = {
  title: "AI Study Helper",
  description: "A small AI-powered study helper"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}

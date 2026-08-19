import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Day 1 Deployment Project",
  description: "A responsive Next.js project scaffolded and deployment-ready from day one."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="container-page flex min-h-20 items-center justify-between gap-4 py-5 text-sm text-slate-500 max-sm:flex-col max-sm:items-start">
            <p>© 2026 Day 1 Deployment Project</p>
            <p>Built with Next.js + Tailwind CSS</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

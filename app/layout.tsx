import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pathwright — Spec to UX flow",
  description:
    "Paste a PRD or feature spec. Get a mapped user flow and the edge cases your team would otherwise find in review.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

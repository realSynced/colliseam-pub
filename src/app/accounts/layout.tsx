import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nexus | Accounts",
  description:
    "A home for developers, market for recruiters. Whether you're a beginner, or senior level developer, you can find your place here at Nexus.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

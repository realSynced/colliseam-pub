import { Metadata } from "next";
import MessagesSidebar from "./components/MessagesLeftPanel";

export const metadata: Metadata = {
  title: "Colliseam | Messages",
  description:
    "A home for developers, market for recruiters. Whether you're a beginner, or senior level developer, you can find your place here at Nexus.",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full">
      <MessagesSidebar />
      <div className="flex-grow">{children}</div>
    </div>
  );
}

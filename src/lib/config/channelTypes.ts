import { LucideIcon, MessageSquare, FileText, Calendar, Video, Code, Database, Users, Brain, Target, Kanban, Boxes, Workflow, BookOpen, StickyNote } from "lucide-react";

export interface ChannelType {
  type: string;
  icon: LucideIcon;
  description: string;
}

export interface ChannelCategory {
  id: string;
  name: string;
  description: string;
  types: ChannelType[];
}

export interface ChannelCategoriesMap {
  [key: string]: ChannelCategory;
}

// This will be our fallback if the database is not accessible
export const defaultChannelCategories: ChannelCategoriesMap = {
  communication: {
    id: "communication",
    name: "Communication",
    description: "Channels for team communication and collaboration",
    types: [
      {
        type: "Chat",
        icon: MessageSquare,
        description: "Real-time messaging and discussions",
      },
      {
        type: "Discussion",
        icon: Video,
        description: "Collaborative discussions",
      },
      // {
      //   type: "Team Space",
      //   icon: Users,
      //   description: "Dedicated space for team collaboration",
      // },
    ],
  },
  productivity: {
    id: "productivity",
    name: "Productivity",
    description: "Tools to enhance team productivity",
    types: [
      {
        type: "Kanban",
        icon: Kanban,
        description: "Visual project management board",
      },
      {
        type: "Sticky Notes",
        icon: StickyNote,
        description: "Create sticky notes and set reminders.",
      },
      {
        type: "Documents",
        icon: FileText,
        description: "Share and collaborate on documents",
      },
      // {
      //   type: "Tasks",
      //   icon: Target,
      //   description: "Track and manage team tasks",
      // },
      
    ],
  },
  // development: {
  //   id: "development",
  //   name: "Development",
  //   description: "Development and technical collaboration tools",
  //   types: [
  //     {
  //       type: "Code",
  //       icon: Code,
  //       description: "Code collaboration and reviews",
  //     },
  //     {
  //       type: "Database",
  //       icon: Database,
  //       description: "Manage structured data",
  //     },
  //     {
  //       type: "Workflow",
  //       icon: Workflow,
  //       description: "Automation and CI/CD pipelines",
  //     },
  //   ],
  // },
  resources: {
    id: "resources",
    name: "Resources",
    description: "Knowledge and resource management",
    types: [
      {
        type: "Knowledge Base",
        icon: Brain,
        description: "Team documentation and guides",
      },
      {
        type: "Resources",
        icon: Boxes,
        description: "Asset and resource management",
      },
      // {
      //   type: "Learning",
      //   icon: BookOpen,
      //   description: "Training and educational content",
      // },
    ],
  },
};

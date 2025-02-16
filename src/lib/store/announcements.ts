import { create } from "zustand";

export type Announcement = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  project_id: number;
  profiles?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
  } | null;
  projects?: {
    id: number;
    name: string;
    description: string;
  } | null;
};

interface AnnouncementState {
  announcements: Announcement[];
  addAnnouncement: (announcement: Announcement) => void;
  setAnnouncements: (announcements: Announcement[]) => void;
}

export const useAnnouncements = create<AnnouncementState>()((set) => ({
  announcements: [],
  addAnnouncement: (newAnnouncement) =>
    set((state) => ({
      announcements: [...state.announcements, newAnnouncement],
    })),
  setAnnouncements: (announcements) => set({ announcements }),
}));

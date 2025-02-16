import type { StaticImport } from "next/dist/shared/lib/get-img-props";

export type type = "General" | "Discussion" | "Critique Help" | "Tips & Tricks" | "Meme" | "News" | "Poll" | "Question" | "Update";

export interface headerData {
  isSelf: boolean;
  username: string;
  displayName: string;
  userTitle: string;
  userSubtitle: string;
  userBio: string;
  userFollowers?: number;
  userFollowing?: number;
  userSkills: string[];
  userPoints: number;
  href: string;
  tags: string[];
  time: string;
  type: type;
  profilePicture: string | StaticImport;
  postID: number;
  showAllTags?: boolean;
}
export interface bodyData {
  title: string;
  content: string;
  images: string[];
  displayMode: string;
  postID: number;
  showEntirePost?: boolean;
}
export interface footerData {
  voteStat: number;
  initialUpvote: boolean;
  initialDownvote: boolean;
  initialFavorite: boolean;
  numberOfComments: string;
  numberOfViews: string;
  postID: number;
}

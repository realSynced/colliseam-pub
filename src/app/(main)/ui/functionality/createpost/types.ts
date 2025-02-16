export interface HeaderData {
  username: string;
  time: string;
  profilePicture: string;
  postTypes: string[];
  postType: string;
  setPostType: Function;
}

export interface Area {
  id: string;
  //fix this any
  content: any;
  text: JSON | null;
  rawtext: string;
  files: File[];
}

export interface PostEntries {
  title: string | null;
  type: string;
  tags: string[];
  files: File[];
  richContent: Object[];
  rawContent: string;
}
export interface AreaContextValue {
  areaDispatch: Function;
  areas: Area[];
}
export interface TagsContextValue {
  postTags: string[];
  setPostTags: Function;
}

export interface AvailableTag {
  name: string;
  num_posts: number;
}

import { createContext } from "react";
import { AreaContextValue, TagsContextValue } from "./types";

export const AreaContext = createContext<AreaContextValue>({
    areaDispatch: Function,
    areas: []
})
export const TagsContext = createContext<TagsContextValue>({
    setPostTags: Function,
    postTags: []    
})
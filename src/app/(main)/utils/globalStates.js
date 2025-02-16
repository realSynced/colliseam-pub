import { create } from "zustand";

const usePostUpdate = create((set) => ({
    postUpdated: false,
    setPostUpdated: (value) => set({ postUpdated: value }),
}));

const useFollowUpdate = create((set) => ({
    followUpdated: false,
    setFollowUpdated: (value) => set({ followUpdated: value }),
}));

const useReplyUpdate = create((set) => ({
    replyUpdated: false,
    setReplyUpdated: (value) => set({ replyUpdated: value }),
}));

export { usePostUpdate, useFollowUpdate, useReplyUpdate };
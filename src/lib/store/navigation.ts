import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NavigationState {
    activeTab: string;
    channelID: string;
    channelUUID: string;
    categoryID: string;
    setActiveTab: (tab: string) => void;
    setChannelID: (id: any) => void;
    setChannelUUID: (id: string) => void;
    setCategoryID: (id: any) => void;
    clearNavigation: () => void;
}

export const useNavigation = create<NavigationState>()(
    persist(
        (set) => ({
            activeTab: "projects",
            channelID: "",
            channelUUID: "",
            categoryID: "",
            setActiveTab: (tab: string) => set({ activeTab: tab }),
            setChannelID: (id: string) => set({ channelID: id }),
            setChannelUUID: (id: string) => set({ channelUUID: id }),
            setCategoryID: (id: string) => set({ categoryID: id }),
            clearNavigation: () => set({ channelID: "", channelUUID: "", categoryID: "" })
        }),
        {
            name: 'navigation-storage',
            partialize: (state) => ({ 
                channelID: state.channelID,
                channelUUID: state.channelUUID,
                categoryID: state.categoryID
            })
        }
    )
);
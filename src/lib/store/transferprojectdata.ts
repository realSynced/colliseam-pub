import { create } from "zustand";
import { Json } from "../types/supabase";

// export type TransferData = {

// };

interface TransferProjDataState {
  transferData: any | undefined;
  setTransferData: (data: any | undefined) => void;
  setOptimisticChatID: (id: number) => void;
  setOptimisticCategoryID: (id: number) => void;
}

export const useTransferData = create<TransferProjDataState>()((set) => ({
    transferData: undefined,
    setTransferData: (transfer) => set((state) => ({ transferData: transfer })),
    setOptimisticChatID: (id) => set((state) => ({ transferData: { ...state.transferData, optimisticChatID: id } })),
    setOptimisticCategoryID: (id) => set((state) => ({ transferData: { ...state.transferData, optimisticCategoryID: id } })),
}));



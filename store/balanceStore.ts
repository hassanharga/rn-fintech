// import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";
// import { zustandStorage } from "./mmkv-storage";

// export interface Transaction {
//   id: string;
//   amount: number;
//   date: Date;
//   title: string;
// }

// export interface BalanceState {
//   balance: () => number;
//   transactions: Transaction[];
//   runTransaction: (transaction: Transaction) => void;
//   clearTransactions: () => void;
// }

// export const useBalanceStore = create<BalanceState>()(
//   persist(
//     (set, get) => ({
//       transactions: [],
//       balance: () => 0,
//       runTransaction: (transaction) => {
//         set((state) => ({ transactions: [...state.transactions, transaction] }));
//       },
//       clearTransactions: () => {
//         set({ transactions: [] });
//       },
//     }),
//     {
//       name: "balance",
//       storage: createJSONStorage(() => zustandStorage),
//     }
//   )
// );

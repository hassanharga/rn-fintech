import { MMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware";

const storage = new MMKV({ id: "balance-storage" });

export const zustandStorage: StateStorage = {
  getItem: (key: string) => {
    const item = storage.getString(key);
    return item ?? null;
  },
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
};

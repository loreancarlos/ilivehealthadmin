import { create } from "zustand";
import { Professional } from "../types";
import { api } from "../services/api";

interface ProfessionalState {
  professionals: Professional[];
  isProfessionalsLoading: boolean;
  professionalsError: string | null;
  fetchProfessionals: () => Promise<void>;
  getProfessionalById: (id: string) => Professional | undefined;
}

export const useProfessionalStore = create<ProfessionalState>((set, get) => ({
  professionals: [],
  isProfessionalsLoading: false,
  professionalsError: null,
  fetchProfessionals: async () => {
    try {
      set({ isProfessionalsLoading: true, professionalsError: null });
      const professionals = await api.getProfessionals();
      set({ professionals, isProfessionalsLoading: false });
    } catch (error) {
      set({
        professionalsError: "Failed to fetch professionals",
        isProfessionalsLoading: false,
      });
    }
  },
  getProfessionalById: (id: string) => {
    return get().professionals.find((professional) => professional.id === id);
  },
}));

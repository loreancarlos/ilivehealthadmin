import { create } from "zustand";
import { api } from "../services/api";
import { Specialty, ProfessionalSpecialty } from "../types";

interface SpecialtyState {
  specialties: Specialty[];
  isLoading: boolean;
  error: string | null;
  professionalSpecialties: ProfessionalSpecialty[];
  // Actions
  fetchSpecialties: () => Promise<void>;
  fetchProfessionalSpecialties: (id: string) => Promise<void>;
}

export const useSpecialtyStore = create<SpecialtyState>((set, get) => ({
  specialties: [],
  isLoading: false,
  error: null,
  professionalSpecialties: [],

  fetchSpecialties: async () => {
    set({ isLoading: true, error: null });
    try {
      const specialties = await api.getSpecialties();
      set({ specialties, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchProfessionalSpecialties: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const professionalSpecialties = await api.getProfessionalSpecialties(id);
      set({ professionalSpecialties, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

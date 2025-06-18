import { create } from "zustand";
import { Clinic } from "../types";
import { api } from "../services/api";

interface ClinicState {
  clinics: Clinic[];
  isClinicsLoading: boolean;
  clinicsError: string | null;
  fetchClinics: () => Promise<void>;
  getClinicById: (id: string) => Clinic | undefined;
}

export const useClinicStore = create<ClinicState>((set, get) => ({
  clinics: [],
  isClinicsLoading: false,
  clinicsError: null,

  fetchClinics: async () => {
    try {
      set({ isClinicsLoading: true, clinicsError: null });
      const clinics = await api.getClinics();
      set({ clinics, isClinicsLoading: false });
    } catch (error) {
      set({ clinicsError: "Failed to fetch clinics", isClinicsLoading: false });
    }
  },

  getClinicById: (id: string) => {
    return get().clinics.find((clinic) => clinic.id === id);
  },

  /* getClinicById: async (id: string) => {
    try {
      const clinic = await api.getClinicById(id);
      return clinic;
    } catch (error) {
      console.error("Failed to fetch clinic:", error);
      return undefined;
    }
  }, */
}));

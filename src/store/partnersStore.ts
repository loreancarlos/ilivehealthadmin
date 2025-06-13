import { create } from "zustand";
import { api } from "../services/api";
import { Clinic, Professional } from "../types";

export interface PartnershipRequest {
  id: string;
  clinicId: string;
  professionalId: string;
  professional: Professional;
  clinic: Clinic;
  status: "pending" | "approved" | "rejected";
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface PartnersState {
  availableProfessionals: Professional[];
  availableClinics: Clinic[];
  partnershipRequests: PartnershipRequest[];
  professionalsPartners: Professional[];
  clinicsPartners: Clinic[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAvailableProfessionals: () => Promise<void>;
  fetchAvailableClinics: () => Promise<void>;
  fetchPartnershipRequests: () => Promise<void>;
  fetchClinicsPartners: () => Promise<void>;
  fetchProfessionalsPartners: () => Promise<void>;
  sendPartnershipRequest: (data: any) => Promise<void>;
  respondToPartnershipRequest: (
    requestId: string,
    status: "approved" | "rejected"
  ) => Promise<void>;
  /* removePartner: (professionalId: string) => Promise<void>; */
}

export const usePartnersStore = create<PartnersState>((set, get) => ({
  availableProfessionals: [],
  availableClinics: [],
  partnershipRequests: [],
  professionalsPartners: [],
  clinicsPartners: [],
  isLoading: false,
  error: null,

  fetchAvailableProfessionals: async () => {
    set({ isLoading: true, error: null });
    try {
      const availableProfessionals = await api.getAvailableProfessionals();
      set({ availableProfessionals, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchAvailableClinics: async () => {
    set({ isLoading: true, error: null });
    try {
      const availableClinics = await api.getAvailableClinics();
      set({ availableClinics, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchPartnershipRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const partnershipRequests = await api.getPartnershipRequests();
      set({ partnershipRequests, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchClinicsPartners: async () => {
    set({ isLoading: true, error: null });
    try {
      const clinicsPartners = await api.getClinicsPartners();
      set({ clinicsPartners, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  fetchProfessionalsPartners: async () => {
    set({ isLoading: true, error: null });
    try {
      const professionalsPartners = await api.getProfessionalsPartners();
      set({ professionalsPartners, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  sendPartnershipRequest: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const request = await api.sendPartnershipRequest(data);
      set((state) => ({
        partnershipRequests: [...state.partnershipRequests, request],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  respondToPartnershipRequest: async (requestId, status) => {
    set({ isLoading: true, error: null });
    try {
      const updatedRequest = await api.respondToPartnershipRequest(
        requestId,
        status
      );
      set((state) => ({
        partnershipRequests: state.partnershipRequests.map((request) =>
          request.id === requestId ? updatedRequest : request
        ),
        isLoading: false,
      }));

      // If approved, add to partners
      if (status === "approved") {
        get().fetchPartners();
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  /* removePartner: async (professionalId) => {
    set({ isLoading: true, error: null });
    try {
      await api.removePartner(professionalId);
      set((state) => ({
        partners: state.partners.filter(
          (partner) => partner.id !== professionalId
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }, */
}));

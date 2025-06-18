import { create } from "zustand";
import { api } from "../services/api";
import { PartnershipRequest } from "../types";

interface PartnersState {
  partnerships: PartnershipRequest[];
  isPartnersLoading: boolean;
  partnersError: string | null;

  // Actions
  fetchClinicsPartnerships: () => Promise<void>;
  fetchProfessionalsPartnerships: () => Promise<void>;
  sendPartnershipRequest: (data: any) => Promise<void>;
  respondToClinicPartnershipRequest: (
    requestId: string,
    professionalApproved: "approved" | "rejected"
  ) => Promise<void>;
  respondToProfessionalPartnershipRequest: (
    requestId: string,
    clinicApproved: "approved" | "rejected"
  ) => Promise<void>;
  removePartner: (professionalId: string) => Promise<void>;
}

export const usePartnersStore = create<PartnersState>((set, get) => ({
  partnerships: [],
  isPartnersLoading: false,
  partnersError: null,

  fetchClinicsPartnerships: async () => {
    set({ isPartnersLoading: true, partnersError: null });
    try {
      const partnerships = await api.getPartnershipsClinicsList();
      set({ partnerships, isPartnersLoading: false });
    } catch (error) {
      set({ partnersError: error.message, isPartnersLoading: false });
    }
  },

  fetchProfessionalsPartnerships: async () => {
    set({ isPartnersLoading: true, partnersError: null });
    try {
      const partnerships = await api.getPartnershipsProfessionalsList();
      set({ partnerships, isPartnersLoading: false });
    } catch (error) {
      set({ partnersError: error.message, isPartnersLoading: false });
    }
  },

  sendPartnershipRequest: async (data) => {
    set({ isPartnersLoading: true, partnersError: null });
    try {
      const request = await api.sendPartnershipRequest(data);
      set((state) => ({
        partnerships: [...state.partnerships, request],
        isPartnersLoading: false,
      }));
    } catch (error) {
      set({ partnersError: error.message, isPartnersLoading: false });
      throw error;
    }
  },

  respondToClinicPartnershipRequest: async (
    requestId,
    professionalApproved
  ) => {
    set({ isPartnersLoading: true, partnersError: null });

    try {
      const updatedRequest = await api.respondToClinicPartnershipRequest(
        requestId,
        professionalApproved
      );
      set((state) => ({
        partnerships: state.partnerships.map((request) =>
          request.id === requestId ? updatedRequest : request
        ),
        isPartnersLoading: false,
      }));
      /* 
      // If approved, add to partners

      if (professionalApproved === "approved") {
        get().fetchPartnerships();
      } */
    } catch (error) {
      set({ partnersError: error.message, isPartnersLoading: false });
      throw error;
    }
  },

  respondToProfessionalPartnershipRequest: async (
    requestId,
    clinicApproved
  ) => {
    set({ isPartnersLoading: true, partnersError: null });

    try {
      const updatedRequest = await api.respondToProfessionalPartnershipRequest(
        requestId,
        clinicApproved
      );
      set((state) => ({
        partnerships: state.partnerships.map((request) =>
          request.id === requestId ? updatedRequest : request
        ),
        isPartnersLoading: false,
      }));

      /*   // If approved, add to partners

      if (status === "approved") {
        get().fetchPartnerships();
      } */
    } catch (error) {
      set({ partnersError: error.message, isPartnersLoading: false });
      throw error;
    }
  },

  removePartner: async (professionalId) => {
    set({ isPartnersLoading: true, partnersError: null });
    try {
      await api.removePartner(professionalId);
      set((state) => ({
        partnerships: state.partnerships.filter(
          (partner) => partner.id !== professionalId
        ),
        isPartnersLoading: false,
      }));
    } catch (error) {
      set({ partnersError: error.message, isPartnersLoading: false });
      throw error;
    }
  },
}));

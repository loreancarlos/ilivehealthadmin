import { create } from "zustand";
import { api } from "../services/api";
import { Service } from "../types";

interface ServiceState {
  services: Service[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchServices: () => Promise<void>;
  createService: (serviceData: Omit<Service, "id">) => Promise<void>;
  updateService: (id: string, serviceData: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  toggleServiceStatus: (id: string) => Promise<void>;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  isLoading: false,
  error: null,

  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const services = await api.getServices();
      set({ services, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createService: async (serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const newService = await api.createService(serviceData);
      set((state) => ({
        services: [...state.services, newService],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateService: async (id, serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedService = await api.updateService(id, serviceData);
      set((state) => ({
        services: state.services.map((service) =>
          service.id === id ? updatedService : service
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteService: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteService(id);
      set((state) => ({
        services: state.services.filter((service) => service.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  toggleServiceStatus: async (id) => {
    set({ error: null });
    try {
      const updatedService = await api.toggleServiceStatus(id);
      set((state) => ({
        services: state.services.map((service) =>
          service.id === id ? updatedService : service
        ),
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));


import { create } from "zustand";
import { api } from "../services/api";
import { Service, ServiceCategory } from "../types";

interface ServicesState {
  services: Service[];
  categories: ServiceCategory[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchServices: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  createService: (serviceData: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: string, serviceData: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  toggleServiceStatus: (id: string) => Promise<void>;
}

export const useServicesStore = create<ServicesState>((set, get) => ({
  services: [],
  categories: [],
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

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await api.getServiceCategories();
      set({ categories, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createService: async (serviceData) => {
    set({ isLoading: true, error: null });
    try {
      const newService = await api.createService(serviceData);
      set(state => ({
        services: [...state.services, newService],
        isLoading: false
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
      set(state => ({
        services: state.services.map(service =>
          service.id === id ? updatedService : service
        ),
        isLoading: false
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
      set(state => ({
        services: state.services.filter(service => service.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  toggleServiceStatus: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const updatedService = await api.toggleServiceStatus(id);
      set(state => ({
        services: state.services.map(service =>
          service.id === id ? updatedService : service
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

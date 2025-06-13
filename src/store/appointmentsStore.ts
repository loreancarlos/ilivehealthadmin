
import { create } from "zustand";
import { api } from "../services/api";
import { Appointment } from "../types";

interface AppointmentsState {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAppointments: () => Promise<void>;
  createAppointment: (appointmentData: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointment: (id: string, appointmentData: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  updateAppointmentStatus: (id: string, status: string) => Promise<void>;
}

export const useAppointmentsStore = create<AppointmentsState>((set, get) => ({
  appointments: [],
  isLoading: false,
  error: null,

  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      const appointments = await api.getAppointments();
      set({ appointments, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createAppointment: async (appointmentData) => {
    set({ isLoading: true, error: null });
    try {
      const newAppointment = await api.createAppointment(appointmentData);
      set(state => ({
        appointments: [...state.appointments, newAppointment],
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateAppointment: async (id, appointmentData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedAppointment = await api.updateAppointment(id, appointmentData);
      set(state => ({
        appointments: state.appointments.map(appointment =>
          appointment.id === id ? updatedAppointment : appointment
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteAppointment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteAppointment(id);
      set(state => ({
        appointments: state.appointments.filter(appointment => appointment.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateAppointmentStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const updatedAppointment = await api.updateAppointmentStatus(id, status);
      set(state => ({
        appointments: state.appointments.map(appointment =>
          appointment.id === id ? updatedAppointment : appointment
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

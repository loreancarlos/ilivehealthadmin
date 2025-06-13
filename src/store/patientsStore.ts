
import { create } from "zustand";
import { api } from "../services/api";
import { Patient } from "../types";

interface PatientsState {
  patients: Patient[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchPatients: () => Promise<void>;
  createPatient: (patientData: Omit<Patient, 'id'>) => Promise<void>;
  updatePatient: (id: string, patientData: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
}

export const usePatientsStore = create<PatientsState>((set, get) => ({
  patients: [],
  isLoading: false,
  error: null,

  fetchPatients: async () => {
    set({ isLoading: true, error: null });
    try {
      const patients = await api.getPatients();
      set({ patients, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createPatient: async (patientData) => {
    set({ isLoading: true, error: null });
    try {
      const newPatient = await api.createPatient(patientData);
      set(state => ({
        patients: [...state.patients, newPatient],
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updatePatient: async (id, patientData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPatient = await api.updatePatient(id, patientData);
      set(state => ({
        patients: state.patients.map(patient =>
          patient.id === id ? updatedPatient : patient
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deletePatient: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.deletePatient(id);
      set(state => ({
        patients: state.patients.filter(patient => patient.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

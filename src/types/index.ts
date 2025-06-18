// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "professional" | "clinic";
  professional?: Professional;
  clinic?: Clinic;
}

// Professional related types
export interface Professional {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone?: string;
  perfilImage?: string;
  registrationNumber?: string;
  nameOfRegistration?: string;
  clinicIds?: string[];
}

// Clinic related types
export interface Clinic {
  id: string;
  cnpj: string;
  fantasyName: string;
  address?: Address;
  phone?: string;
  email: string;
  logo?: string;
  description?: string;
  openingHours?: OpeningHours[];
  isOpen?: boolean;
  rating?: number;
  reviewCount?: number;
  professionalIds?: string[];
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface OpeningHours {
  weekdays: string;
  hours: string;
}

// Appointment related types
export interface Appointment {
  id: string;
  patientId: string;
  patient: Patient;
  professionalId: string;
  professional: Professional;
  serviceId: string;
  service: Service;
  clinicId: string;
  clinic: Clinic;
  date: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show";
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: string;
  updatedAt: string;
}

// Patient related types
export interface Patient {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  profileImage?: string;
  registrationNumber?: string;
}

// Service related types
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  professionalId: string;
  clinicId: string;
  active: boolean;
  tags: string[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
}

// Financial data types
export interface Transaction {
  id: string;
  appointmentId: string;
  patientId: string;
  professionalId: string;
  clinicId: string;
  amount: number;
  status: "pending" | "completed" | "refunded" | "failed";
  date: string;
  paymentMethod: string;
  reference: string;
}

// Statistics and report types
export interface Statistic {
  label: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
}

export interface ChartData {
  name: string;
  value: number;
}

export interface ActivityItem {
  id: string;
  type:
    | "appointment_created"
    | "appointment_confirmed"
    | "appointment_cancelled"
    | "payment_received"
    | "service_added"
    | "patient_registered";
  date: string;
  message: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  entityId?: string;
  entityType?: "appointment" | "payment" | "service" | "patient";
}

// Search and filter types
export interface SearchParams {
  term?: string;
  category?: string;
  date?: string;
  status?: string;
  professionalId?: string;
  clinicId?: string;
}

export interface PartnershipRequest {
  id: string;
  clinicId: string;
  professionalId: string;
  clinic: Clinic;
  clinicApproved: "pending" | "approved" | "rejected";
  professionalApproved: "pending" | "approved" | "rejected";
  message: string;
  createdAt: string;
  updatedAt: string;
}

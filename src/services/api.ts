import { API_URL } from "../config";

class ApiClient {
  private baseURL: string;
  private token: string | null;
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private setShowConnectionTrouble?: (value: boolean) => void;
  private logout?: () => void;
  private redirectToLogin?: () => void;

  setLogoutHandler(logout: () => void, redirectToLogin: () => void) {
    this.logout = logout;
    this.redirectToLogin = redirectToLogin;
  }

  setConnectionTroubleHandler(handler: (value: boolean) => void) {
    this.setShowConnectionTrouble = handler;
  }

  constructor() {
    this.baseURL = API_URL;
    this.token = localStorage.getItem("auth-storage")
      ? JSON.parse(localStorage.getItem("auth-storage")!).state.token
      : null;

    if (this.token) {
      this.connectWebSocket();
    }
  }

  private connectWebSocket() {
    const wsUrl = API_URL.replace("http", "ws");
    this.ws = new WebSocket(`${wsUrl}?token=${this.token}`);

    this.ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      const handler = this.messageHandlers.get(type);
      if (handler) {
        handler(data);
      }
    };

    this.ws.onclose = () => {
      setTimeout(() => this.connectWebSocket(), 5000);
    };
  }

  setToken(token: string) {
    this.token = token;
    if (this.ws) {
      this.ws.close();
    }
    this.connectWebSocket();
  }

  clearToken() {
    this.token = null;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  onMessage(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });
      this.setShowConnectionTrouble?.(false);
      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          this.logout?.();
          this.redirectToLogin?.();
          throw new Error("Unauthorized");
        }
        const error = await response.json();
        throw new Error(error.error || "An error occurred");
      }
      return response.json();
    } catch (error) {
      if (error.message.includes("fetch") || error.message.includes("failed")) {
        this.setShowConnectionTrouble?.(true);
      }
      throw Error(error.message);
    }
  }

  // Auth
  async clinicLogin(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>(
      "/auth/login/clinic",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
    this.setToken(response.token);
    return response;
  }

  async professionalLogin(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>(
      "/auth/login/professional",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
    this.setToken(response.token);
    return response;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<void>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async adminResetPassword(userId: string, newPassword: string) {
    return this.request<void>("/auth/admin/reset-password", {
      method: "POST",
      body: JSON.stringify({ userId, newPassword }),
    });
  }

  // Users
  async getUsers() {
    return this.request<any[]>("/users");
  }

  async createUser(data: any) {
    return this.request<any>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: any) {
    return this.request<any>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request<void>(`/users/${id}`, {
      method: "DELETE",
    });
  }

  async toggleUserStatus(id: string) {
    return this.request<any>(`/users/${id}/toggle-status`, {
      method: "PATCH",
    });
  }

  // Clinics
  async getClinics() {
    return this.request<any[]>("/clinics");
  }

  async getClinicById(id: string) {
    return this.request<any>(`/clinics/${id}`);
  }

  async createClinics(data: any) {
    return this.request<any>("/clinics", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateClinics(id: string, data: any) {
    return this.request<any>(`/clinics/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteClinics(id: string) {
    return this.request<void>(`/clinics/${id}`, {
      method: "DELETE",
    });
  }

  // Professionals
  async getProfessionals() {
    return this.request<any[]>("/professionals");
  }

  async getProfessionalById(id: string) {
    return this.request<any>(`/professionals/${id}`);
  }

  async createProfessionals(data: any) {
    return this.request<any>("/professionals", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProfessionals(id: string, data: any) {
    return this.request<any>(`/professionals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteProfessionals(id: string) {
    return this.request<void>(`/professionals/${id}`, {
      method: "DELETE",
    });
  }

  // Services
  async getServices() {
    return this.request<any[]>("/services");
  }

  async getServiceCategories() {
    return this.request<any[]>("/service-categories");
  }

  async createService(data: any) {
    return this.request<any>("/services", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateService(id: string, data: any) {
    return this.request<any>(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: string) {
    return this.request<void>(`/services/${id}`, {
      method: "DELETE",
    });
  }

  async toggleServiceStatus(id: string) {
    return this.request<any>(`/services/${id}/toggle-status`, {
      method: "PATCH",
    });
  }

  // Appointments
  async getAppointments() {
    return this.request<any[]>("/appointments");
  }

  async createAppointment(data: any) {
    return this.request<any>("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAppointment(id: string, data: any) {
    return this.request<any>(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteAppointment(id: string) {
    return this.request<void>(`/appointments/${id}`, {
      method: "DELETE",
    });
  }

  async updateAppointmentStatus(id: string, status: string) {
    return this.request<any>(`/appointments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // Patients
  async getPatients() {
    return this.request<any[]>("/patients");
  }

  async createPatient(data: any) {
    return this.request<any>("/patients", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updatePatient(id: string, data: any) {
    return this.request<any>(`/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deletePatient(id: string) {
    return this.request<void>(`/patients/${id}`, {
      method: "DELETE",
    });
  }

  // Partners
  async getPartnershipsProfessionalsList() {
    return this.request<any[]>("/partners/professionals");
  }

  async getPartnershipsClinicsList() {
    return this.request<any[]>("/partners/clinics");
  }

  async sendPartnershipRequest(data: any) {
    return this.request<any>("/partners", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async respondToClinicPartnershipRequest(
    requestId: string,
    professionalApproved: string
  ) {
    return this.request<any>(`/partners/clinic/respond/${requestId}`, {
      method: "PATCH",
      body: JSON.stringify({ professionalApproved }),
    });
  }

  async respondToProfessionalPartnershipRequest(
    requestId: string,
    clinicApproved: string
  ) {
    return this.request<any>(`/partners/professional/respond/${requestId}`, {
      method: "PATCH",
      body: JSON.stringify({ clinicApproved }),
    });
  }

  async removePartner(professionalId: string) {
    return this.request<void>(`/partners/${professionalId}`, {
      method: "DELETE",
    });
  }

  // Google Calendar methods
  async updateGoogleCalendar(
    userId: string,
    data: {
      accessToken?: string | null;
      refreshToken?: string | null;
      selectedCalendarId?: string | null;
    }
  ) {
    return this.request<void>(`/users/${userId}/google-calendar`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async exchangeGoogleCode(code: string, location: string) {
    return this.request<any>("/google-calendar/exchange-code", {
      method: "POST",
      body: JSON.stringify({ code, location }),
    });
  }

  async getGoogleCalendars() {
    return this.request<any>("/google-calendar/calendars");
  }

  async disconnectGoogleCalendar() {
    return this.request<void>("/google-calendar/disconnect", {
      method: "POST",
    });
  }

  async createCalendarEvent(
    businessId: string,
    data: {
      summary: string;
      description: string;
      startDateTime: string;
      endDateTime: string;
    }
  ) {
    return this.request<void>(`/business/${businessId}/calendar-event`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();

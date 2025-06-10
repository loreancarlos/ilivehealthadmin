import { api } from "./api";
import { Clinic, Professional } from "../types";

export interface LoginResponse {
  token: string;
  clinic?: Clinic;
  professional?: Professional;
}

export interface AuthError {
  message: string;
  code: "INVALID_CREDENTIALS" | "NETWORK_ERROR" | "UNKNOWN_ERROR";
}

export class AuthService {
  static async clinicLogin(
    email: string,
    password: string
  ): Promise<LoginResponse> {
    try {
      return await api.clinicLogin(email, password);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        if (
          error.message.includes("fetch") ||
          error.message.includes("failed")
        ) {
          throw new Error("");
        }
        if (error.message.includes("Unauthorized")) {
          throw new Error("Email ou senha inválidos");
        }
      }
      throw new Error("Erro inesperado");
    }
  }

  static async professionalLogin(
    email: string,
    password: string
  ): Promise<LoginResponse> {
    try {
      return await api.professionalLogin(email, password);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        if (
          error.message.includes("fetch") ||
          error.message.includes("failed")
        ) {
          throw new Error("");
        }
        if (error.message.includes("Unauthorized")) {
          throw new Error("Email ou senha inválidos");
        }
      }
      throw new Error("Erro inesperado");
    }
  }

  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      await api.changePassword(currentPassword, newPassword);
    } catch (error) {
      throw new Error("Falha ao alterar a senha");
    }
  }

  static async adminResetPassword(
    userId: string,
    newPassword: string
  ): Promise<void> {
    try {
      await api.adminResetPassword(userId, newPassword);
    } catch (error) {
      throw new Error("Falha ao redefinir a senha");
    }
  }

  /* static async updateGoogleCalendar(
    userId: string,
    data: {
      accessToken?: string | null;
      refreshToken?: string | null;
      selectedCalendarId?: string | null;
    }
  ): Promise<void> {
    try {
      await api.updateGoogleCalendar(userId, data);
    } catch (error) {
      throw new Error("Falha ao atualizar configurações do Google Calendar");
    }
  } */
}

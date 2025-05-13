import { 
  users, type User, type InsertUser,
  professionals, type Professional, type InsertProfessional,
  clinics, type Clinic, type InsertClinic,
  patients, type Patient, type InsertPatient,
  professionalClinics, type ProfessionalClinic, type InsertProfessionalClinic,
  serviceCategories, type ServiceCategory, type InsertServiceCategory,
  services, type Service, type InsertService,
  appointments, type Appointment, type InsertAppointment,
  transactions, type Transaction, type InsertTransaction
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  
  // Professional operations
  getProfessional(id: number): Promise<Professional | undefined>;
  getProfessionalByUserId(userId: number): Promise<Professional | undefined>;
  getProfessionals(): Promise<Professional[]>;
  createProfessional(professional: InsertProfessional): Promise<Professional>;
  updateProfessional(id: number, professionalData: Partial<InsertProfessional>): Promise<Professional | undefined>;
  
  // Clinic operations
  getClinic(id: number): Promise<Clinic | undefined>;
  getClinics(): Promise<Clinic[]>;
  createClinic(clinic: InsertClinic): Promise<Clinic>;
  updateClinic(id: number, clinicData: Partial<InsertClinic>): Promise<Clinic | undefined>;
  
  // Professional-Clinic relationship
  getProfessionalClinics(professionalId: number): Promise<ProfessionalClinic[]>;
  getClinicProfessionals(clinicId: number): Promise<ProfessionalClinic[]>;
  addProfessionalToClinic(professionalClinic: InsertProfessionalClinic): Promise<ProfessionalClinic>;
  
  // Patient operations
  getPatient(id: number): Promise<Patient | undefined>;
  getPatients(): Promise<Patient[]>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patientData: Partial<InsertPatient>): Promise<Patient | undefined>;
  
  // Service Category operations
  getServiceCategory(id: number): Promise<ServiceCategory | undefined>;
  getServiceCategories(): Promise<ServiceCategory[]>;
  createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory>;
  
  // Service operations
  getService(id: number): Promise<Service | undefined>;
  getServices(): Promise<Service[]>;
  getServicesByProfessional(professionalId: number): Promise<Service[]>;
  getServicesByClinic(clinicId: number): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined>;
  
  // Appointment operations
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointments(): Promise<Appointment[]>;
  getAppointmentsByPatient(patientId: number): Promise<Appointment[]>;
  getAppointmentsByProfessional(professionalId: number): Promise<Appointment[]>;
  getAppointmentsByClinic(clinicId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointmentData: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  
  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactions(): Promise<Transaction[]>;
  getTransactionsByPatient(patientId: number): Promise<Transaction[]>;
  getTransactionsByProfessional(professionalId: number): Promise<Transaction[]>;
  getTransactionsByClinic(clinicId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transactionData: Partial<InsertTransaction>): Promise<Transaction | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private professionals: Map<number, Professional>;
  private clinics: Map<number, Clinic>;
  private patients: Map<number, Patient>;
  private professionalClinics: Map<number, ProfessionalClinic>;
  private serviceCategories: Map<number, ServiceCategory>;
  private services: Map<number, Service>;
  private appointments: Map<number, Appointment>;
  private transactions: Map<number, Transaction>;
  
  private userIdCounter: number;
  private professionalIdCounter: number;
  private clinicIdCounter: number;
  private patientIdCounter: number;
  private professionalClinicIdCounter: number;
  private serviceCategoryIdCounter: number;
  private serviceIdCounter: number;
  private appointmentIdCounter: number;
  private transactionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.professionals = new Map();
    this.clinics = new Map();
    this.patients = new Map();
    this.professionalClinics = new Map();
    this.serviceCategories = new Map();
    this.services = new Map();
    this.appointments = new Map();
    this.transactions = new Map();
    
    this.userIdCounter = 1;
    this.professionalIdCounter = 1;
    this.clinicIdCounter = 1;
    this.patientIdCounter = 1;
    this.professionalClinicIdCounter = 1;
    this.serviceCategoryIdCounter = 1;
    this.serviceIdCounter = 1;
    this.appointmentIdCounter = 1;
    this.transactionIdCounter = 1;
    
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize sample admin user
    this.createUser({
      username: "admin",
      password: "password",
      name: "Admin User",
      email: "admin@ilivehealth.com",
      role: "admin",
      profileImage: "https://randomuser.me/api/portraits/men/1.jpg"
    });

    // Create a sample professional
    this.createUser({
      username: "dra.silva",
      password: "password",
      name: "Dra. Ana Silva",
      email: "ana.silva@ilivehealth.com",
      role: "professional",
      profileImage: "https://randomuser.me/api/portraits/women/2.jpg"
    }).then(user => {
      this.createProfessional({
        userId: user.id,
        name: "Dra. Ana Silva",
        specialty: "Dermatologista",
        bio: "Especialista em tratamentos estéticos e dermatologia clínica",
        registrationNumber: "CRM-12345",
        phoneNumber: "(11) 99999-9999",
        email: "ana.silva@ilivehealth.com",
        profileImage: "https://randomuser.me/api/portraits/women/2.jpg"
      });
    });

    // Create a sample clinic
    this.createClinic({
      name: "Clínica Bem Estar",
      email: "contato@clinicabemestar.com",
      phoneNumber: "(11) 3333-3333",
      description: "Clínica especializada em estética e bem-estar",
      address: {
        street: "Av. Paulista",
        number: "1000",
        complement: "Sala 123",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
        zipCode: "01310-100"
      },
      logo: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      openingHours: [
        { weekdays: "Segunda à Sexta", hours: "8:00 - 20:00" },
        { weekdays: "Sábado", hours: "9:00 - 15:00" }
      ],
      isOpen: true,
      rating: 4,
      reviewCount: 120
    });

    // Initialize service categories
    const categories = [
      { name: "Consultas", slug: "consultations", description: "Consultas médicas e avaliações" },
      { name: "Procedimentos", slug: "procedures", description: "Procedimentos médicos e cirúrgicos" },
      { name: "Exames", slug: "exams", description: "Exames diagnósticos" },
      { name: "Estética", slug: "aesthetics", description: "Procedimentos estéticos" },
      { name: "Terapias", slug: "therapies", description: "Sessões terapêuticas e acompanhamentos" }
    ];
    
    categories.forEach(category => {
      this.createServiceCategory({
        name: category.name,
        slug: category.slug,
        description: category.description
      });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now, updatedAt: now };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Professional operations
  async getProfessional(id: number): Promise<Professional | undefined> {
    return this.professionals.get(id);
  }
  
  async getProfessionalByUserId(userId: number): Promise<Professional | undefined> {
    return Array.from(this.professionals.values()).find(prof => prof.userId === userId);
  }
  
  async getProfessionals(): Promise<Professional[]> {
    return Array.from(this.professionals.values());
  }
  
  async createProfessional(insertProfessional: InsertProfessional): Promise<Professional> {
    const id = this.professionalIdCounter++;
    const now = new Date();
    const professional: Professional = { ...insertProfessional, id, createdAt: now, updatedAt: now };
    this.professionals.set(id, professional);
    return professional;
  }
  
  async updateProfessional(id: number, professionalData: Partial<InsertProfessional>): Promise<Professional | undefined> {
    const professional = await this.getProfessional(id);
    if (!professional) return undefined;
    
    const updatedProfessional: Professional = {
      ...professional,
      ...professionalData,
      updatedAt: new Date()
    };
    
    this.professionals.set(id, updatedProfessional);
    return updatedProfessional;
  }

  // Clinic operations
  async getClinic(id: number): Promise<Clinic | undefined> {
    return this.clinics.get(id);
  }
  
  async getClinics(): Promise<Clinic[]> {
    return Array.from(this.clinics.values());
  }
  
  async createClinic(insertClinic: InsertClinic): Promise<Clinic> {
    const id = this.clinicIdCounter++;
    const now = new Date();
    const clinic: Clinic = { ...insertClinic, id, createdAt: now, updatedAt: now };
    this.clinics.set(id, clinic);
    return clinic;
  }
  
  async updateClinic(id: number, clinicData: Partial<InsertClinic>): Promise<Clinic | undefined> {
    const clinic = await this.getClinic(id);
    if (!clinic) return undefined;
    
    const updatedClinic: Clinic = {
      ...clinic,
      ...clinicData,
      updatedAt: new Date()
    };
    
    this.clinics.set(id, updatedClinic);
    return updatedClinic;
  }

  // Professional-Clinic relationship
  async getProfessionalClinics(professionalId: number): Promise<ProfessionalClinic[]> {
    return Array.from(this.professionalClinics.values())
      .filter(pc => pc.professionalId === professionalId);
  }
  
  async getClinicProfessionals(clinicId: number): Promise<ProfessionalClinic[]> {
    return Array.from(this.professionalClinics.values())
      .filter(pc => pc.clinicId === clinicId);
  }
  
  async addProfessionalToClinic(insertProfessionalClinic: InsertProfessionalClinic): Promise<ProfessionalClinic> {
    const id = this.professionalClinicIdCounter++;
    const now = new Date();
    const professionalClinic: ProfessionalClinic = { 
      ...insertProfessionalClinic, 
      id, 
      createdAt: now 
    };
    this.professionalClinics.set(id, professionalClinic);
    return professionalClinic;
  }

  // Patient operations
  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }
  
  async getPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }
  
  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.patientIdCounter++;
    const now = new Date();
    const patient: Patient = { ...insertPatient, id, createdAt: now, updatedAt: now };
    this.patients.set(id, patient);
    return patient;
  }
  
  async updatePatient(id: number, patientData: Partial<InsertPatient>): Promise<Patient | undefined> {
    const patient = await this.getPatient(id);
    if (!patient) return undefined;
    
    const updatedPatient: Patient = {
      ...patient,
      ...patientData,
      updatedAt: new Date()
    };
    
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }

  // Service Category operations
  async getServiceCategory(id: number): Promise<ServiceCategory | undefined> {
    return this.serviceCategories.get(id);
  }
  
  async getServiceCategories(): Promise<ServiceCategory[]> {
    return Array.from(this.serviceCategories.values());
  }
  
  async createServiceCategory(insertCategory: InsertServiceCategory): Promise<ServiceCategory> {
    const id = this.serviceCategoryIdCounter++;
    const now = new Date();
    const category: ServiceCategory = { ...insertCategory, id, createdAt: now };
    this.serviceCategories.set(id, category);
    return category;
  }

  // Service operations
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }
  
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }
  
  async getServicesByProfessional(professionalId: number): Promise<Service[]> {
    return Array.from(this.services.values())
      .filter(service => service.professionalId === professionalId);
  }
  
  async getServicesByClinic(clinicId: number): Promise<Service[]> {
    return Array.from(this.services.values())
      .filter(service => service.clinicId === clinicId);
  }
  
  async createService(insertService: InsertService): Promise<Service> {
    const id = this.serviceIdCounter++;
    const now = new Date();
    const service: Service = { ...insertService, id, createdAt: now, updatedAt: now };
    this.services.set(id, service);
    return service;
  }
  
  async updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    const service = await this.getService(id);
    if (!service) return undefined;
    
    const updatedService: Service = {
      ...service,
      ...serviceData,
      updatedAt: new Date()
    };
    
    this.services.set(id, updatedService);
    return updatedService;
  }

  // Appointment operations
  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }
  
  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }
  
  async getAppointmentsByPatient(patientId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.patientId === patientId);
  }
  
  async getAppointmentsByProfessional(professionalId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.professionalId === professionalId);
  }
  
  async getAppointmentsByClinic(clinicId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.clinicId === clinicId);
  }
  
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentIdCounter++;
    const now = new Date();
    const appointment: Appointment = { ...insertAppointment, id, createdAt: now, updatedAt: now };
    this.appointments.set(id, appointment);
    return appointment;
  }
  
  async updateAppointment(id: number, appointmentData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const appointment = await this.getAppointment(id);
    if (!appointment) return undefined;
    
    const updatedAppointment: Appointment = {
      ...appointment,
      ...appointmentData,
      updatedAt: new Date()
    };
    
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }
  
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }
  
  async getTransactionsByPatient(patientId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.patientId === patientId);
  }
  
  async getTransactionsByProfessional(professionalId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.professionalId === professionalId);
  }
  
  async getTransactionsByClinic(clinicId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.clinicId === clinicId);
  }
  
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const now = new Date();
    const transaction: Transaction = { ...insertTransaction, id, createdAt: now, updatedAt: now };
    this.transactions.set(id, transaction);
    return transaction;
  }
  
  async updateTransaction(id: number, transactionData: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = await this.getTransaction(id);
    if (!transaction) return undefined;
    
    const updatedTransaction: Transaction = {
      ...transaction,
      ...transactionData,
      updatedAt: new Date()
    };
    
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
}

export const storage = new MemStorage();

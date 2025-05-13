import { 
  Appointment, 
  Patient, 
  Professional, 
  Clinic, 
  Service, 
  Transaction,
  Statistic,
  ActivityItem,
  ServiceCategory,
  ChartData
} from "@/types";

// Mock professionals
export const professionals: Professional[] = [
  {
    id: "1",
    name: "Dra. Ana Silva",
    specialty: "Dermatologista",
    email: "ana.silva@ilivehealth.com",
    phoneNumber: "(11) 99999-1111",
    profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    registrationNumber: "CRM-SP 123456",
    clinicIds: ["1"]
  },
  {
    id: "2",
    name: "Dr. Marcos Oliveira",
    specialty: "Nutricionista",
    email: "marcos.oliveira@ilivehealth.com",
    phoneNumber: "(11) 99999-2222",
    profileImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    registrationNumber: "CRN-SP 54321",
    clinicIds: ["1", "2"]
  },
  {
    id: "3",
    name: "Dra. Paula Santos",
    specialty: "Fisioterapeuta",
    email: "paula.santos@ilivehealth.com",
    phoneNumber: "(11) 99999-3333",
    profileImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    registrationNumber: "CREFITO-SP 987654",
    clinicIds: ["2"]
  }
];

// Mock clinics
export const clinics: Clinic[] = [
  {
    id: "1",
    name: "Clínica Bem Estar",
    address: {
      street: "Av. Paulista",
      number: "1000",
      complement: "Sala 501",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100"
    },
    phoneNumber: "(11) 3333-4444",
    email: "contato@clinicabemestar.com",
    logo: "https://example.com/logos/bem-estar.svg",
    description: "Clínica especializada em serviços de saúde e bem-estar, com foco em atendimento personalizado e de qualidade.",
    openingHours: [
      { weekdays: "Segunda a Sexta", hours: "08:00 - 19:00" },
      { weekdays: "Sábado", hours: "09:00 - 13:00" }
    ],
    isOpen: true,
    rating: 4.8,
    reviewCount: 124,
    professionalIds: ["1", "2"]
  },
  {
    id: "2",
    name: "Centro Médico Saúde",
    address: {
      street: "Rua Augusta",
      number: "789",
      complement: "Andar 3",
      neighborhood: "Consolação",
      city: "São Paulo",
      state: "SP",
      zipCode: "01305-000"
    },
    phoneNumber: "(11) 3333-5555",
    email: "atendimento@centromedico.com",
    logo: "https://example.com/logos/centro-medico.svg",
    description: "Centro médico com diversas especialidades e equipamentos modernos para atender todas as necessidades dos pacientes.",
    openingHours: [
      { weekdays: "Segunda a Sexta", hours: "07:00 - 20:00" },
      { weekdays: "Sábado e Domingo", hours: "08:00 - 12:00" }
    ],
    isOpen: true,
    rating: 4.5,
    reviewCount: 98,
    professionalIds: ["2", "3"]
  }
];

// Mock patients
export const patients: Patient[] = [
  {
    id: "1",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@email.com",
    phoneNumber: "(11) 98765-4321",
    profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
    registrationNumber: "12345"
  },
  {
    id: "2",
    name: "Mariana Santos",
    email: "mariana.santos@email.com",
    phoneNumber: "(11) 98765-1234",
    profileImage: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
    registrationNumber: "12378"
  },
  {
    id: "3",
    name: "Pedro Souza",
    email: "pedro.souza@email.com",
    phoneNumber: "(11) 98765-5678",
    profileImage: "https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
    registrationNumber: "12390"
  }
];

// Mock service categories
export const serviceCategories: ServiceCategory[] = [
  { id: "1", name: "Consultas", slug: "consultations" },
  { id: "2", name: "Procedimentos", slug: "procedures" },
  { id: "3", name: "Exames", slug: "exams" },
  { id: "4", name: "Estética", slug: "aesthetics" },
  { id: "5", name: "Terapias", slug: "therapies" }
];

// Mock services
export const services: Service[] = [
  {
    id: "1",
    name: "Consulta Dermatológica",
    description: "Avaliação completa da pele, cabelo e unhas com recomendações personalizadas.",
    price: 250,
    duration: "30 minutos",
    category: "1", // Consultas
    professionalId: "1",
    clinicId: "1",
    active: true,
    tags: ["Primeira consulta", "Avaliação", "Convênio"]
  },
  {
    id: "2",
    name: "Limpeza de Pele",
    description: "Limpeza profunda para remover impurezas e cravos, com hidratação.",
    price: 180,
    duration: "60 minutos",
    category: "4", // Estética
    professionalId: "1",
    clinicId: "1",
    active: true,
    tags: ["Procedimento estético", "Pele"]
  },
  {
    id: "3",
    name: "Consulta Nutricional",
    description: "Elaboração de plano alimentar personalizado e orientações nutricionais.",
    price: 200,
    duration: "45 minutos",
    category: "1", // Consultas
    professionalId: "2",
    clinicId: "1",
    active: true,
    tags: ["Avaliação", "Plano alimentar", "Convênio"]
  },
  {
    id: "4",
    name: "Massagem Terapêutica",
    description: "Massagem para alívio de tensões e dores musculares.",
    price: 150,
    duration: "50 minutos",
    category: "5", // Terapias
    professionalId: "3",
    clinicId: "2",
    active: true,
    tags: ["Sessão", "Relaxamento", "Dores musculares"]
  }
];

// Mock appointments
export const appointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    patient: patients[0],
    professionalId: "1",
    professional: professionals[0],
    serviceId: "1",
    service: services[0],
    clinicId: "1",
    clinic: clinics[0],
    date: "2023-06-15",
    startTime: "09:30",
    endTime: "10:00",
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2023-06-10T14:30:00Z",
    updatedAt: "2023-06-10T15:00:00Z"
  },
  {
    id: "2",
    patientId: "2",
    patient: patients[1],
    professionalId: "1",
    professional: professionals[0],
    serviceId: "2",
    service: services[1],
    clinicId: "1",
    clinic: clinics[0],
    date: "2023-06-15",
    startTime: "11:00",
    endTime: "12:00",
    status: "scheduled",
    paymentStatus: "pending",
    createdAt: "2023-06-12T10:15:00Z",
    updatedAt: "2023-06-12T10:15:00Z"
  },
  {
    id: "3",
    patientId: "3",
    patient: patients[2],
    professionalId: "3",
    professional: professionals[2],
    serviceId: "4",
    service: services[3],
    clinicId: "2",
    clinic: clinics[1],
    date: "2023-06-15",
    startTime: "14:30",
    endTime: "15:20",
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2023-06-11T09:45:00Z",
    updatedAt: "2023-06-11T10:00:00Z"
  }
];

// Mock transactions
export const transactions: Transaction[] = [
  {
    id: "1",
    appointmentId: "1",
    patientId: "1",
    professionalId: "1",
    clinicId: "1",
    amount: 250,
    status: "completed",
    date: "2023-06-10T15:00:00Z",
    paymentMethod: "Credit Card",
    reference: "TRX123456789"
  },
  {
    id: "2",
    appointmentId: "3",
    patientId: "3",
    professionalId: "3",
    clinicId: "2",
    amount: 150,
    status: "completed",
    date: "2023-06-11T10:00:00Z",
    paymentMethod: "Credit Card",
    reference: "TRX987654321"
  },
  {
    id: "3",
    appointmentId: "2",
    patientId: "2",
    professionalId: "1",
    clinicId: "1",
    amount: 180,
    status: "pending",
    date: "2023-06-12T10:15:00Z",
    paymentMethod: "Pending",
    reference: "TRX456789123"
  }
];

// Mock statistics
export const statistics: Statistic[] = [
  {
    label: "Total de Agendamentos",
    value: 145,
    previousValue: 129,
    change: 12,
    changeType: "increase"
  },
  {
    label: "Receita Total",
    value: 24950,
    previousValue: 23100,
    change: 8,
    changeType: "increase"
  },
  {
    label: "Novos Clientes",
    value: 48,
    previousValue: 45,
    change: 6,
    changeType: "increase"
  },
  {
    label: "Taxa de Conversão",
    value: 75,
    previousValue: 77,
    change: 2,
    changeType: "decrease"
  }
];

// Mock revenue chart data
export const weeklyRevenueData = [
  { name: "Seg", value: 3500 },
  { name: "Ter", value: 4800 },
  { name: "Qua", value: 2700 },
  { name: "Qui", value: 3900 },
  { name: "Sex", value: 5400 },
  { name: "Sáb", value: 4500 },
  { name: "Dom", value: 3000 }
];

// Mock services pie chart data
export const servicesPieChartData: ChartData[] = [
  { name: "Consultas", value: 45 },
  { name: "Procedimentos", value: 30 },
  { name: "Exames", value: 25 }
];

// Mock activity feed
export const activityItems: ActivityItem[] = [
  {
    id: "1",
    type: "appointment_confirmed",
    date: "2023-06-15T08:45:00Z",
    message: "confirmou agendamento",
    userId: "1",
    userName: "Carlos Oliveira",
    userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
    entityId: "1",
    entityType: "appointment"
  },
  {
    id: "2",
    type: "service_added",
    date: "2023-06-15T07:30:00Z",
    message: "adicionou novo procedimento",
    userId: "1",
    userName: "Dra. Ana Silva",
    userAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    entityId: "5",
    entityType: "service"
  },
  {
    id: "3",
    type: "appointment_cancelled",
    date: "2023-06-14T18:22:00Z",
    message: "solicitou reagendamento",
    userId: "2",
    userName: "Mariana Santos",
    userAvatar: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
    entityId: "2",
    entityType: "appointment"
  },
  {
    id: "4",
    type: "appointment_cancelled",
    date: "2023-06-14T16:05:00Z",
    message: "cancelou agendamento",
    userId: "4",
    userName: "Juliana Pereira",
    userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
    entityId: "4",
    entityType: "appointment"
  },
  {
    id: "5",
    type: "payment_received",
    date: "2023-06-14T14:30:00Z",
    message: "Pagamento recebido de",
    userId: "5",
    userName: "Fernando Melo",
    userAvatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
    entityId: "4",
    entityType: "payment"
  }
];

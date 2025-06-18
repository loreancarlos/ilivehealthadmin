import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Send,
  Check,
  X,
  UserPlus,
  Clock,
  Mail,
  Phone,
  Badge as BadgeIcon,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Textarea } from "../components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { usePartnersStore } from "../store/partnersStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Clinic, Professional } from "../types";
import { useAuthStore } from "../store/authStore";
import { useClinicStore } from "../store/clinicStore";
import { useProfessionalStore } from "../store/professionalStore";

const partnershipRequestSchema = z.object({
  message: z.string().min(10, {
    message: "A mensagem deve ter pelo menos 10 caracteres.",
  }),
});

type PartnershipRequestValues = z.infer<typeof partnershipRequestSchema>;

const Partners = () => {
  const { clinic, professional } = useAuthStore();
  const {
    partnerships,
    isPartnersLoading,
    partnersError,
    fetchClinicsPartnerships,
    fetchProfessionalsPartnerships,
    sendPartnershipRequest,
    respondToClinicPartnershipRequest,
    respondToProfessionalPartnershipRequest,
    removePartner,
  } = usePartnersStore();

  const {
    professionals,
    fetchProfessionals,
    isProfessionalsLoading,
    professionalsError,
  } = useProfessionalStore();
  const { clinics, fetchClinics, isClinicsLoading, clinicsError } =
    useClinicStore();

  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("available");

  const form = useForm<PartnershipRequestValues>({
    resolver: zodResolver(partnershipRequestSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    !!clinic && fetchProfessionalsPartnerships();
    !!professional && fetchClinicsPartnerships();
    fetchClinics();
    fetchProfessionals();
  }, [clinic, professional]);

  useEffect(() => {
    if (isRequestDialogOpen && selectedProfessional) {
      form.setValue(
        "message",
        `Olá, ${selectedProfessional.name}! Gostaríamos de convidá-lo(a) para fazer parte da nossa rede de parceiros.`
      );
    }
  }, [isRequestDialogOpen, selectedProfessional]);

  useEffect(() => {
    if (isRequestDialogOpen && selectedClinic) {
      form.setValue(
        "message",
        `Olá, ${selectedClinic.fantasyName}! Gostaria de fazer parte da sua rede de parceiros.`
      );
    }
  }, [isRequestDialogOpen, selectedClinic]);

  const onSubmitRequest = async (f: PartnershipRequestValues) => {
    if (!!clinic) {
      if (!selectedProfessional) return;
      const data = {
        professionalId: selectedProfessional.id,
        clinicId: clinic?.id,
        clinicApproved: "approved",
        professionalApproved: "pending",
        message: f.message,
      };
      try {
        await sendPartnershipRequest(data);
        setIsRequestDialogOpen(false);
        setSelectedProfessional(null);
        form.reset();
      } catch (error) {
        console.error("Erro ao enviar solicitação:", error);
      }
    } else if (!!professional) {
      if (!selectedClinic) return;
      const data = {
        professionalId: professional?.id,
        clinicId: selectedClinic.id,
        clinicApproved: "pending",
        professionalApproved: "approved",
        message: f.message,
      };
      try {
        await sendPartnershipRequest(data);
        setIsRequestDialogOpen(false);
        setSelectedClinic(null);
        form.reset();
      } catch (error) {
        console.error("Erro ao enviar solicitação:", error);
      }
    }
  };

  const handleClinicRequestResponse = async (
    requestId: string,
    professionalApproved: "approved" | "rejected"
  ) => {
    try {
      await respondToClinicPartnershipRequest(requestId, professionalApproved);
    } catch (error) {
      console.error("Erro ao responder solicitação:", error);
    }
  };

  const handleProfessionalRequestResponse = async (
    requestId: string,
    clinicApproved: "approved" | "rejected"
  ) => {
    try {
      await respondToProfessionalPartnershipRequest(requestId, clinicApproved);
    } catch (error) {
      console.error("Erro ao responder solicitação:", error);
    }
  };

  const handleRemovePartner = async (professionalId: string) => {
    if (confirm("Tem certeza que deseja remover este parceiro?")) {
      try {
        /* await removePartner(professionalId); */
      } catch (error) {
        console.error("Erro ao remover parceiro:", error);
      }
    }
  };

  //Clinics

  const availableProfessionals = useMemo(() => {
    const requestedProfessionalIds = new Set(
      partnerships
        .filter((p) => p.clinicId === clinic?.id)
        .map((p) => p.professionalId)
    );

    return professionals.filter(
      (professional) => !requestedProfessionalIds.has(professional.id)
    );
  }, [professionals, partnerships, clinic]);

  const pendingProfessionals = useMemo(() => {
    return partnerships
      .filter(
        (p) =>
          p.professionalApproved === "pending" || p.clinicApproved === "pending"
      )
      .map((partnership) => {
        const professional = professionals.find(
          (pro) => pro.id === partnership.professionalId
        );

        return {
          partnership, // dados da solicitação (status, ids, etc.)
          professional, // dados completos do profissional
        };
      })
      .filter((item) => item.professional); // remove casos onde o profissional não foi encontrado
  }, [professionals, partnerships]);

  const professionalsPartners = useMemo(() => {
    return partnerships
      .filter(
        (p) =>
          p.professionalApproved === "approved" &&
          p.clinicApproved === "approved"
      )
      .map((partnership) => {
        const professional = professionals.find(
          (pro) => pro.id === partnership.professionalId
        );

        return {
          partnership, // dados da solicitação (status, ids, etc.)
          professional, // dados completos do profissional
        };
      })
      .filter((item) => item.professional); // remove casos onde o profissional não foi encontrado
  }, [professionals, partnerships]);

  const filteredAvailableProfessionals = useMemo(() => {
    return availableProfessionals.filter(
      (professional) =>
        professional.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        professional.specialty
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [availableProfessionals, searchQuery]);

  const filteredPendingProfessionals = useMemo(() => {
    return pendingProfessionals.filter(
      (partner) =>
        partner.professional?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        partner.professional?.specialty
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [pendingProfessionals, searchQuery]);

  const filteredProfessionalsPartners = useMemo(() => {
    return professionalsPartners.filter(
      (partner) =>
        partner.professional?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        partner.professional?.specialty
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [professionalsPartners, searchQuery]);

  //Professionals

  const availableClinics = useMemo(() => {
    const requestedClinicIds = new Set(
      partnerships
        .filter((p) => p.professionalId === professional?.id)
        .map((p) => p.clinicId)
    );

    return clinics.filter((clinic) => !requestedClinicIds.has(clinic.id));
  }, [clinics, partnerships, professional]);

  const pendingClinics = useMemo(() => {
    return partnerships
      .filter(
        (p) =>
          p.clinicApproved === "pending" || p.professionalApproved === "pending"
      )
      .map((partnership) => {
        const clinic = clinics.find(
          (clinic) => clinic.id === partnership.clinicId
        );

        return {
          partnership, // dados da solicitação (status, ids, etc.)
          clinic, // dados completos do profissional
        };
      })
      .filter((item) => item.clinic); // remove casos onde a clinica não foi encontrada
  }, [clinics, partnerships]);

  const clinicsPartners = useMemo(() => {
    return partnerships
      .filter(
        (p) =>
          p.clinicApproved === "approved" &&
          p.professionalApproved === "approved"
      )
      .map((partnership) => {
        const clinic = clinics.find(
          (clinic) => clinic.id === partnership.clinicId
        );

        return {
          partnership, // dados da solicitação (status, ids, etc.)
          clinic, // dados completos do profissional
        };
      })
      .filter((item) => item.clinic); // remove casos onde o profissional não foi encontrado
  }, [clinics, partnerships]);

  const filteredAvailableClinics = useMemo(() => {
    return availableClinics.filter(
      (clinic) =>
        clinic.cnpj.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.fantasyName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableClinics, searchQuery]);

  const filteredPendingClinics = useMemo(() => {
    return pendingClinics.filter(
      (partner) =>
        partner.clinic?.cnpj
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        partner.clinic?.fantasyName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [pendingClinics, searchQuery]);

  const filteredClinicsPartners = useMemo(() => {
    return clinicsPartners.filter(
      (partner) =>
        partner.clinic?.cnpj
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        partner.clinic?.fantasyName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [clinicsPartners, searchQuery]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pendente
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200">
            Aprovado
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200">
            Rejeitado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Visão geral</h2>
          <p className="text-sm text-gray-500">
            Gerencie parcerias com profissionais da saúde
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar profissionais..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">
            Disponíveis (
            {!!clinic
              ? filteredAvailableProfessionals.length
              : filteredAvailableClinics.length}
            )
          </TabsTrigger>
          <TabsTrigger value="requests">
            Solicitações (
            {!!clinic
              ? filteredPendingProfessionals.length
              : filteredPendingClinics.length}
            )
          </TabsTrigger>
          <TabsTrigger value="partners">
            Parceiros (
            {!!clinic
              ? filteredProfessionalsPartners.length
              : filteredClinicsPartners.length}
            )
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-4">
          {isPartnersLoading || isClinicsLoading || isProfessionalsLoading ? (
            <div className="p-8 text-center">
              {!!clinic && <p>Carregando profissionais...</p>}
              {!!professional && <p>Carregando clinicas...</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {!!clinic &&
                filteredAvailableProfessionals.map((professional) => (
                  <Card key={professional.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={professional.perfilImage}
                            alt={professional.name}
                          />
                          <AvatarFallback>
                            {getInitials(professional.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {professional.name}
                          </CardTitle>
                          <CardDescription>
                            {professional.specialty}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {professional.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {professional.phone}
                        </div>
                        <div className="flex items-center">
                          <BadgeIcon className="h-4 w-4 mr-2" />
                          {professional.registrationNumber
                            ? professional.nameOfRegistration +
                              " " +
                              professional.registrationNumber
                            : "Sem registro ou certificação"}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Dialog
                        open={isRequestDialogOpen}
                        onOpenChange={setIsRequestDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full"
                            onClick={() =>
                              setSelectedProfessional(professional)
                            }>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Solicitar Parceria
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Solicitar Parceria</DialogTitle>
                            <DialogDescription>
                              Envie uma solicitação de parceria para{" "}
                              {selectedProfessional?.name}
                            </DialogDescription>
                          </DialogHeader>

                          <Form {...form}>
                            <form
                              onSubmit={form.handleSubmit(onSubmitRequest)}
                              className="space-y-4">
                              <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Mensagem</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Descreva o motivo da parceria e como será a colaboração..."
                                        className="min-h-[120px]"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <DialogFooter>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setIsRequestDialogOpen(false);
                                    setSelectedProfessional(null);
                                    form.reset();
                                  }}>
                                  Cancelar
                                </Button>
                                <Button type="submit">
                                  <Send className="h-4 w-4 mr-2" />
                                  Enviar Solicitação
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}

              {!!professional &&
                filteredAvailableClinics.map((clinic) => (
                  <Card key={clinic.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={clinic.logo}
                            alt={clinic.fantasyName}
                          />
                          <AvatarFallback>
                            {getInitials(clinic.fantasyName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {clinic.fantasyName}
                          </CardTitle>
                          <CardDescription>
                            {clinic.address?.city}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {clinic.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {clinic.phone}
                        </div>
                        <div className="flex items-center">
                          <BadgeIcon className="h-4 w-4 mr-2" />
                          {clinic.cnpj}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Dialog
                        open={isRequestDialogOpen}
                        onOpenChange={setIsRequestDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full"
                            onClick={() => setSelectedClinic(clinic)}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Solicitar Parceria
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Solicitar Parceria</DialogTitle>
                            <DialogDescription>
                              Envie uma solicitação de parceria para{" "}
                              {selectedClinic?.fantasyName}
                            </DialogDescription>
                          </DialogHeader>

                          <Form {...form}>
                            <form
                              onSubmit={form.handleSubmit(onSubmitRequest)}
                              className="space-y-4">
                              <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Mensagem</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Descreva o motivo da parceria e como será a colaboração..."
                                        className="min-h-[120px]"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <DialogFooter>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setIsRequestDialogOpen(false);
                                    setSelectedClinic(null);
                                    form.reset();
                                  }}>
                                  Cancelar
                                </Button>
                                <Button type="submit">
                                  <Send className="h-4 w-4 mr-2" />
                                  Enviar Solicitação
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}

              {!!clinic &&
                !isProfessionalsLoading &&
                !isPartnersLoading &&
                filteredAvailableProfessionals.length === 0 && (
                  <div className="col-span-full p-8 text-center text-gray-500 border rounded-lg bg-gray-50">
                    Nenhum profissional disponível encontrado.
                  </div>
                )}
              {!!professional &&
                !isClinicsLoading &&
                !isPartnersLoading &&
                filteredAvailableClinics.length === 0 && (
                  <div className="col-span-full p-8 text-center text-gray-500 border rounded-lg bg-gray-50">
                    Nenhuma clinica disponível encontrado.
                  </div>
                )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="mt-4">
          <div className="space-y-4">
            {!!clinic &&
              filteredPendingProfessionals.map((request) => (
                <Card key={request.partnership.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={request.professional?.perfilImage}
                            alt={request.professional?.name}
                          />
                          <AvatarFallback>
                            {getInitials(request.professional?.name || "?")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {request.professional?.name}
                          </CardTitle>
                          <CardDescription>
                            {request.professional?.specialty}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(request.partnership.professionalApproved)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-3">
                      {request.partnership.message}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      Enviado em{" "}
                      {new Date(request.partnership.createdAt).toLocaleString()}
                    </div>
                  </CardContent>
                  {request.partnership.clinicApproved === "pending" && (
                    <CardFooter className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleProfessionalRequestResponse(
                            request.partnership.id,
                            "rejected"
                          )
                        }
                        className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <X className="h-4 w-4 mr-1" />
                        Rejeitar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleProfessionalRequestResponse(
                            request.partnership.id,
                            "approved"
                          )
                        }
                        className="bg-green-600 hover:bg-green-700">
                        <Check className="h-4 w-4 mr-1" />
                        Aprovar
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}

            {!!professional &&
              filteredPendingClinics.map((request) => (
                <Card key={request.partnership.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={request.clinic?.logo}
                            alt={request.clinic?.fantasyName}
                          />
                          <AvatarFallback>
                            {getInitials(request.clinic?.fantasyName || "?")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">
                            {request.clinic?.fantasyName}
                          </CardTitle>
                          <CardDescription>
                            {request.clinic?.address?.city}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(request.partnership.clinicApproved)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-3">
                      {request.partnership.message}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      Enviado em{" "}
                      {new Date(request.partnership.createdAt).toLocaleString()}
                    </div>
                  </CardContent>
                  {request.partnership.professionalApproved === "pending" && (
                    <CardFooter className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleClinicRequestResponse(
                            request.partnership.id,
                            "rejected"
                          )
                        }
                        className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <X className="h-4 w-4 mr-1" />
                        Rejeitar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleClinicRequestResponse(
                            request.partnership.id,
                            "approved"
                          )
                        }
                        className="bg-green-600 hover:bg-green-700">
                        <Check className="h-4 w-4 mr-1" />
                        Aprovar
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}

            {!!clinic &&
              !isProfessionalsLoading &&
              !isPartnersLoading &&
              filteredProfessionalsPartners.length === 0 && (
                <div className="col-span-full p-8 text-center text-gray-500 border rounded-lg bg-gray-50">
                  Nenhuma solicitação de parceria encontrada.
                </div>
              )}
            {!!professional &&
              !isClinicsLoading &&
              !isPartnersLoading &&
              filteredClinicsPartners.length === 0 && (
                <div className="col-span-full p-8 text-center text-gray-500 border rounded-lg bg-gray-50">
                  Nenhuma solicitação de parceria encontrada.
                </div>
              )}
          </div>
        </TabsContent>

        <TabsContent value="partners" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {!!clinic &&
              filteredProfessionalsPartners.map((partner) => (
                <Card key={partner.partnership.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={partner.professional?.perfilImage}
                          alt={partner.professional?.name}
                        />
                        <AvatarFallback>
                          {getInitials(partner.professional?.name || "?")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {partner.professional?.name}
                        </CardTitle>
                        <CardDescription>
                          {partner.professional?.specialty}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {partner.professional?.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {partner.professional?.phone}
                      </div>
                      <div className="flex items-center">
                        <BadgeIcon className="h-4 w-4 mr-2" />
                        {partner.professional?.registrationNumber}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="mt-2 bg-green-50 text-green-700 border-green-200">
                      Parceiro Ativo
                    </Badge>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleRemovePartner(partner.partnership.id)
                      }
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                      <X className="h-4 w-4 mr-2" />
                      Remover Parceria
                    </Button>
                  </CardFooter>
                </Card>
              ))}

            {!!professional &&
              filteredClinicsPartners.map((partner) => (
                <Card key={partner.partnership.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={partner.clinic?.logo}
                          alt={partner.clinic?.fantasyName}
                        />
                        <AvatarFallback>
                          {getInitials(partner.clinic?.fantasyName || "?")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {partner.clinic?.fantasyName}
                        </CardTitle>
                        <CardDescription>
                          {partner.clinic?.address?.city}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {partner.clinic?.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {partner.clinic?.phone}
                      </div>
                      <div className="flex items-center">
                        <BadgeIcon className="h-4 w-4 mr-2" />
                        {partner.clinic?.cnpj}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="mt-2 bg-green-50 text-green-700 border-green-200">
                      Parceiro Ativo
                    </Badge>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleRemovePartner(partner.partnership.id)
                      }
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                      <X className="h-4 w-4 mr-2" />
                      Remover Parceria
                    </Button>
                  </CardFooter>
                </Card>
              ))}

            {!!clinic && filteredProfessionalsPartners.length === 0 && (
              <div className="col-span-full p-8 text-center text-gray-500 border rounded-lg bg-gray-50">
                Nenhum parceiro encontrado.
              </div>
            )}

            {!!professional && filteredClinicsPartners.length === 0 && (
              <div className="col-span-full p-8 text-center text-gray-500 border rounded-lg bg-gray-50">
                Nenhum parceiro encontrado.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Partners;

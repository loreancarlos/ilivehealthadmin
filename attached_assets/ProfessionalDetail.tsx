import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { nearbyClinics, popularProfessionals } from "../data/mockData";
import { Professional } from "../types";
import { Badge } from "../components/ui/badge";
import { formatCurrency } from "../lib/utils";

const ProfessionalDetail: React.FC = () => {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  
  // Find the professional with the matching ID
  const professional = popularProfessionals.find(p => p.id === id);
  
  // Find all clinics where this professional works
  const clinicsForProfessional = nearbyClinics.filter(
    clinic => professional?.clinicIds.includes(clinic.id)
  );
  
  const [selectedClinic, setSelectedClinic] = useState(clinicsForProfessional[0]?.id);
  
  if (!professional) {
    return <div className="p-4">Profissional não encontrado</div>;
  }

  const handleScheduleAppointment = () => {
    navigate("/appointment");
  };

  return (
    <div className="pb-16">
      {/* Professional Profile Header */}
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-32"></div>
        <div className="px-4">
          <div className="relative -top-16 flex flex-col items-center">
            <img
              src={professional.profileImage}
              alt={professional.name}
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
            <h1 className="text-xl font-bold mt-2">{professional.name}</h1>
            <p className="text-gray-600">{professional.specialty}</p>
            <div className="flex items-center mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-sm font-medium">{professional.rating}</span>
              <span className="ml-1 text-sm text-gray-500">({professional.reviewCount} avaliações)</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {professional.registrationNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Professional Bio */}
      <div className="px-4 mt-2 mb-6">
        <h2 className="text-lg font-semibold mb-2">Sobre</h2>
        <p className="text-gray-600 text-sm">
          {professional.bio || 
            `${professional.name} é um(a) profissional com experiência na área de ${professional.specialty}. 
            Especialista em diversos procedimentos relacionados à sua área de atuação.`}
        </p>
      </div>

      {/* Clinics where the professional works */}
      {clinicsForProfessional.length > 0 && (
        <div className="px-4 mb-6 border-t border-gray-200 pt-4">
          <h2 className="text-lg font-semibold mb-3">Clínicas de atendimento</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {clinicsForProfessional.map(clinic => (
              <button
                key={clinic.id}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedClinic === clinic.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setSelectedClinic(clinic.id)}
              >
                {clinic.name}
              </button>
            ))}
          </div>
          
          {/* Selected clinic details */}
          {selectedClinic && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {clinicsForProfessional.find(c => c.id === selectedClinic)?.name}
                </h3>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-sm text-gray-500">
                    {clinicsForProfessional.find(c => c.id === selectedClinic)?.distance} km
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {clinicsForProfessional.find(c => c.id === selectedClinic)?.address.street}, 
                {clinicsForProfessional.find(c => c.id === selectedClinic)?.address.number} - 
                {clinicsForProfessional.find(c => c.id === selectedClinic)?.address.neighborhood}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Procedures */}
      <div className="px-4 mb-6 border-t border-gray-200 pt-4">
        <h2 className="text-lg font-semibold mb-3">Procedimentos</h2>
        
        <div className="space-y-3">
          {professional.procedures.map(procedure => (
            <div
              key={procedure.id}
              className="p-4 bg-white rounded-lg border border-gray-200"
              onClick={handleScheduleAppointment}
            >
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold">{procedure.name}</h3>
                <span className="font-medium text-primary">
                  {formatCurrency(procedure.price)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {procedure.duration}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {procedure.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant={tag.toLowerCase().includes('convênio') ? 'green' : 'blue'} 
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Availability/Schedule */}
      <div className="px-4 mb-6 border-t border-gray-200 pt-4">
        <h2 className="text-lg font-semibold mb-3">Disponibilidade</h2>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {professional.availability ? (
            professional.availability.slice(0, 6).map((avail, index) => {
              const date = new Date(avail.date);
              const day = date.getDate();
              const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date);
              
              return (
                <div key={index} className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-xs text-gray-500">{weekday.toUpperCase()}</span>
                  <span className="text-lg font-medium">{day}</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {avail.timeSlots.length} horários
                  </span>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-6 text-gray-500">
              Sem horários disponíveis no momento
            </div>
          )}
        </div>
        
        <button
          className="w-full bg-primary text-white py-3 rounded-lg font-medium"
          onClick={handleScheduleAppointment}
        >
          Agendar consulta
        </button>
      </div>
    </div>
  );
};

export default ProfessionalDetail;

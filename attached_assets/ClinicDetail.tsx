import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { nearbyClinics } from "../data/mockData";
import { Badge } from "../components/ui/badge";

const ClinicDetail: React.FC = () => {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  
  // Find the clinic with the matching ID
  const clinic = nearbyClinics.find(c => c.id === id);
  
  const [selectedTab, setSelectedTab] = useState<string>("all");
  
  if (!clinic) {
    return <div className="p-4">Clínica não encontrada</div>;
  }

  const scrollToProcedures = () => {
    document.getElementById("proceduresSection")?.scrollIntoView({ behavior: "smooth" });
  };

  const openMap = () => {
    // In a real app, this would open a map with the clinic's location
    alert("Abrir mapa com a localização da clínica.");
  };

  const callClinic = () => {
    // In a real app, this would initiate a phone call
    window.location.href = `tel:${clinic.phoneNumber}`;
  };

  const selectProcedure = (procedureId: string) => {
    navigate("/appointment");
  };

  const openGallery = () => {
    // In a real app, this would open a photo gallery
    alert("Abrir galeria de fotos.");
  };

  const handleProfessionalClick = (professionalId: string) => {
    navigate(`/professional/${professionalId}`);
  };

  return (
    <div id="clinicDetailScreen">
      {/* Clinic Images Gallery */}
      <div className="relative">
        <img
          src={clinic.images[0]}
          alt={`Fotos da ${clinic.name}`}
          className="w-full h-64 object-cover"
        />
        <button 
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"
          onClick={openGallery}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </button>
      </div>

      {/* Clinic Info */}
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold">{clinic.name}</h1>
        
        <div className="flex items-center mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="ml-1 font-medium text-sm">{clinic.rating}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-600">{clinic.reviewCount} avaliações</span>
          <span className="mx-2 text-gray-300">•</span>
          <div className={`flex items-center ${clinic.isOpen ? 'bg-green-50' : 'bg-red-50'} px-2 py-0.5 rounded-md`}>
            {clinic.isOpen ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-accent mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs font-medium text-accent">Aberto agora</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-xs font-medium text-red-500">Fechado agora</span>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
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
          <span>{`${clinic.address.street}, ${clinic.address.number} - ${clinic.address.neighborhood}, ${clinic.address.city}/${clinic.address.state}`}</span>
        </div>
        
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            {clinic.openingHours.map((schedule, index) => (
              <span key={index}>
                {schedule.weekdays}: {schedule.hours}
                {index < clinic.openingHours.length - 1 ? " • " : ""}
              </span>
            ))}
          </span>
        </div>

        <div className="mt-5 flex space-x-3">
          <button
            className="flex-1 bg-primary text-white py-3 rounded-lg font-medium"
            onClick={scrollToProcedures}
          >
            Agendar
          </button>
          <button
            className="flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg"
            onClick={openMap}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
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
          </button>
          <button
            className="flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg"
            onClick={callClinic}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Clinic Description */}
      <div className="px-4 py-4 border-t border-gray-200">
        <h2 className="text-lg font-semibold mb-2">Sobre a clínica</h2>
        <p className="text-gray-600 text-sm">
          {clinic.description || "Informações sobre a clínica não disponíveis."}
        </p>
      </div>

      {/* Available Procedures */}
      <div className="px-4 py-4 border-t border-gray-200" id="proceduresSection">
        <h2 className="text-lg font-semibold mb-4">Procedimentos disponíveis</h2>
        
        {/* Category filter tabs */}
        <div className="flex overflow-x-auto space-x-2 py-2 mb-4 scrollbar-hide">
          <button 
            className={`px-4 py-2 ${selectedTab === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'} text-sm font-medium rounded-full`}
            onClick={() => setSelectedTab('all')}
          >
            Todos
          </button>
          <button 
            className={`px-4 py-2 ${selectedTab === 'consultations' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'} text-sm font-medium rounded-full`}
            onClick={() => setSelectedTab('consultations')}
          >
            Consultas
          </button>
          <button 
            className={`px-4 py-2 ${selectedTab === 'exams' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'} text-sm font-medium rounded-full`}
            onClick={() => setSelectedTab('exams')}
          >
            Exames
          </button>
          <button 
            className={`px-4 py-2 ${selectedTab === 'aesthetics' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'} text-sm font-medium rounded-full`}
            onClick={() => setSelectedTab('aesthetics')}
          >
            Estética
          </button>
        </div>
        
        {/* Procedures list */}
        {clinic.professionals.flatMap(professional => professional.procedures).map((procedure, index) => (
          <div
            key={`${procedure.id}-${index}`}
            className="mb-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
            onClick={() => selectProcedure(procedure.id)}
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{procedure.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{procedure.duration}</p>
              </div>
              <div>
                <span className="font-medium text-primary">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(procedure.price)}
                </span>
              </div>
            </div>
            <div className="mt-4">
              {procedure.tags.map((tag, tagIndex) => (
                <Badge 
                  key={tagIndex} 
                  variant={tag.toLowerCase().includes('convênio') ? 'green' : 'blue'} 
                  className="mr-2"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Specialists section */}
      <div className="px-4 py-4 border-t border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Especialistas</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {clinic.professionals.map(professional => (
            <div
              key={professional.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
              onClick={() => handleProfessionalClick(professional.id)}
            >
              <img
                src={professional.profileImage}
                alt={`Foto do(a) ${professional.name}`}
                className="w-full h-28 object-cover"
              />
              <div className="p-3">
                <h3 className="font-medium text-base">{professional.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{professional.specialty}</p>
                <div className="mt-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-xs font-medium">{professional.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews section */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Avaliações</h2>
          <button className="text-primary text-sm font-medium">Ver todas</button>
        </div>
        
        {/* Overall rating */}
        <div className="flex items-center mb-4">
          <div className="text-4xl font-bold mr-4">{clinic.rating}</div>
          <div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${i < Math.floor(clinic.rating) ? "text-yellow-400" : "text-gray-300"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-1">Baseado em {clinic.reviewCount} avaliações</p>
          </div>
        </div>
        
        {/* Reviews list */}
        {clinic.reviews.map(review => (
          <div key={review.id} className="mb-4 pb-4 border-b border-gray-200">
            <div className="flex justify-between mb-2">
              <div className="font-medium">{review.userName}</div>
              <div className="text-sm text-gray-500">{review.date}</div>
            </div>
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClinicDetail;

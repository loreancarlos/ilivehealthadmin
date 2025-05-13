import { Appointment } from "../../types";
import { formatDate } from "../../lib/utils";

interface AppointmentsTableProps {
  appointments: Appointment[];
  title: string;
}

const AppointmentsTable = ({ appointments, title }: AppointmentsTableProps) => {
  // Function to render status badge
  const renderStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Confirmado</span>;
      case 'scheduled':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Aguardando</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Concluído</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Cancelado</span>;
      case 'no_show':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Não compareceu</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <button className="text-sm text-primary hover:underline">Ver todos</button>
      </div>
      
      <div className="border rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    {appointment.patient.profileImage ? (
                      <img 
                        src={appointment.patient.profileImage} 
                        alt={appointment.patient.name} 
                        className="h-8 w-8 rounded-full object-cover" 
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-sm">
                          {appointment.patient.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{appointment.patient.name}</div>
                      <div className="text-xs text-gray-500">ID: {appointment.patient.registrationNumber}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.service.name}</div>
                  <div className="text-xs text-gray-500">
                    {appointment.service.tags && appointment.service.tags.length > 0
                      ? appointment.service.tags[0]
                      : ''
                    }
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{`${appointment.startTime} - ${appointment.endTime}`}</div>
                  <div className="text-xs text-gray-500">{formatDate(appointment.date)}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {renderStatusBadge(appointment.status)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                  <button className="text-primary hover:underline">Detalhes</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsTable;

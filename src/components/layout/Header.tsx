import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Badge } from "../../components/ui/badge";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useAuthStore } from "../../store/authStore";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ setSidebarOpen }: HeaderProps) => {
  const [location] = useLocation();
  const { clinic, professional, logout } = useAuthStore();
  const [notificationCount] = useState(3);
  const [_, navigate] = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    switch (true) {
      case location === "/dashboard":
        return "Dashboard";
      case location.startsWith("/appointments"):
        return "Agendamentos";
      case location.startsWith("/partners"):
        return "Parceiros";
      case location.startsWith("/services"):
        return "Serviços";
      case location.startsWith("/clients"):
        return "Clientes";
      case location.startsWith("/finance"):
        return "Financeiro";
      case location.startsWith("/reports"):
        return "Relatórios";
      case location.startsWith("/settings"):
        return "Configurações";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="bg-white border-b border-border h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
      <div className="flex items-center">
        <button onClick={() => setSidebarOpen(true)} className="mr-4 lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full relative">
              <Bell className="h-6 w-6" />
              {notificationCount > 0 && (
                <Badge className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full p-0">
                  {notificationCount}
                </Badge>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col py-1">
                  <span className="font-medium text-sm">
                    Novo agendamento confirmado
                  </span>
                  <span className="text-xs text-gray-500">
                    Carlos Oliveira confirmou o agendamento para hoje às 09:30
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col py-1">
                  <span className="font-medium text-sm">
                    Agendamento cancelado
                  </span>
                  <span className="text-xs text-gray-500">
                    Mariana Santos cancelou o agendamento de amanhã
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col py-1">
                  <span className="font-medium text-sm">
                    Pagamento recebido
                  </span>
                  <span className="text-xs text-gray-500">
                    Pagamento de R$ 250,00 recebido de Fernando Melo
                  </span>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center">
              <span className="text-primary text-sm">
                Ver todas as notificações
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
              {professional?.perfilImage ? (
                <img
                  src={professional.perfilImage}
                  alt="Profile"
                  className="h-8 w-8 w-full h-full object-cover rounded-full"
                />
              ) : professional?.name ? (
                <span className="text-primary font-medium text-xs">
                  {professional.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              ) : clinic?.fantasyName ? (
                <span className="text-primary font-medium text-xs">
                  {clinic.fantasyName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              ) : (
                <span>?</span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {professional?.name || clinic?.fantasyName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                logout();
                navigate("/");
              }}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;

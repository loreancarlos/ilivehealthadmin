import { useLocation, Link } from "wouter";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location === path || 
          (path !== "/" && location.startsWith(path));
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)} 
        />
      )}

      <aside className={cn(
        "w-full lg:w-64 bg-white border-r border-border fixed inset-y-0 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-primary font-bold text-2xl">iLive<span className="text-accent text-lg">health</span></span>
            <span className="ml-2 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">ADMIN</span>
          </div>
          <button 
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          {user && (
            <div className="flex items-center space-x-3 mb-6">
              {user.professional?.profileImage ? (
                <img 
                  src={user.professional.profileImage} 
                  alt="Profile photo" 
                  className="h-10 w-10 rounded-full object-cover" 
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-medium text-sm">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-gray-500">{user.clinic?.name}</p>
              </div>
            </div>
          )}
          
          <nav className="space-y-1">
            <Link 
              href="/" 
              className={cn(
                "sidebar-item flex items-center space-x-3 p-2 rounded-md pl-3",
                isActive("/") || isActive("/dashboard") 
                  ? "active" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            
            <Link 
              href="/appointments" 
              className={cn(
                "sidebar-item flex items-center space-x-3 p-2 rounded-md pl-3",
                isActive("/appointments") 
                  ? "active" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Agendamentos</span>
            </Link>
            
            <Link 
              href="/services" 
              className={cn(
                "sidebar-item flex items-center space-x-3 p-2 rounded-md pl-3",
                isActive("/services") 
                  ? "active" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-sm font-medium">Serviços</span>
            </Link>
            
            <Link 
              href="/clients" 
              className={cn(
                "sidebar-item flex items-center space-x-3 p-2 rounded-md pl-3",
                isActive("/clients") 
                  ? "active" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-medium">Clientes</span>
            </Link>
            
            <Link 
              href="/finance" 
              className={cn(
                "sidebar-item flex items-center space-x-3 p-2 rounded-md pl-3",
                isActive("/finance") 
                  ? "active" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Financeiro</span>
            </Link>
            
            <Link 
              href="/reports" 
              className={cn(
                "sidebar-item flex items-center space-x-3 p-2 rounded-md pl-3",
                isActive("/reports") 
                  ? "active" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <span className="text-sm font-medium">Relatórios</span>
            </Link>
            
            <Link 
              href="/settings" 
              className={cn(
                "sidebar-item flex items-center space-x-3 p-2 rounded-md pl-3",
                isActive("/settings") 
                  ? "active" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Configurações</span>
            </Link>
            
            <button 
              onClick={logout}
              className="w-full sidebar-item flex items-center space-x-3 p-2 rounded-md pl-3 text-gray-700 hover:bg-gray-50 mt-8"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm font-medium">Sair</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

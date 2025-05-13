import { useState } from "react";
import { useLocation } from "wouter";

const Register: React.FC = () => {
  const [_, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    
    if (!termsAccepted) {
      alert("Você precisa aceitar os termos de uso para continuar.");
      return;
    }
    
    // In a real app, this would register the user
    navigate("/");
  };

  const showLogin = () => {
    navigate("/login");
  };

  return (
    <div className="px-4 py-8">
      <div className="flex justify-center mb-8">
        <span className="text-primary font-bold text-3xl">iLive<span className="text-accent text-lg">health</span></span>
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-6">Crie sua conta</h1>
      
      {/* Register Form */}
      <form onSubmit={handleRegister} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
          <input
            type="text"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <input
            type="tel"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="(00) 00000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirme sua senha</label>
          <input
            type="password"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-primary border-gray-300 rounded"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
            />
          </div>
          <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
            Concordo com os <a href="#" className="text-primary">Termos de Uso</a> e <a href="#" className="text-primary">Política de Privacidade</a>
          </label>
        </div>
        
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg font-medium mb-4"
        >
          Cadastrar
        </button>
      </form>
      
      <div className="flex items-center my-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="mx-4 text-sm text-gray-500">ou</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
      
      <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium flex justify-center items-center mb-4">
        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.501 12.2332C22.501 11.3699 22.4296 10.7399 22.2748 10.0865H12.2153V13.9832H18.12C18.001 14.9515 17.3582 16.4099 16.0296 17.3898L16.0055 17.5566L19.2027 20.0632L19.4343 20.0865C21.3106 18.1399 22.501 15.4665 22.501 12.2332Z" fill="#4285F4"/>
          <path d="M12.214 22.5C15.1068 22.5 17.5353 21.5667 19.4333 20.0867L16.0287 17.39C15.1069 18.0083 13.8501 18.4399 12.214 18.4399C9.38023 18.4399 6.97663 16.6083 6.11871 14.0767L5.96371 14.0883L2.6387 16.6966L2.56371 16.8483C4.45156 20.2633 8.0592 22.5 12.214 22.5Z" fill="#34A853"/>
          <path d="M6.12053 14.0767C5.89391 13.4234 5.76426 12.7233 5.76426 12.0001C5.76426 11.2767 5.89391 10.5767 6.10768 9.92339L6.10011 9.74339L2.75095 7.10339L2.56429 7.15172C1.8667 8.60339 1.46655 10.2567 1.46655 12.0001C1.46655 13.7434 1.8667 15.3967 2.56429 16.8484L6.12053 14.0767Z" fill="#FBBC05"/>
          <path d="M12.214 5.55997C14.2252 5.55997 15.583 6.41163 16.3569 7.12335L19.4176 4.23335C17.5231 2.53335 15.1068 1.5 12.214 1.5C8.05898 1.5 4.45135 3.73667 2.56348 7.15172L6.10687 9.92335C6.97663 7.39172 9.3802 5.55997 12.214 5.55997Z" fill="#EB4335"/>
        </svg>
        Continuar com Google
      </button>
      
      <p className="text-center text-sm text-gray-600 mt-6">
        Já tem uma conta? <button onClick={showLogin} className="text-primary font-medium">Entrar</button>
      </p>
    </div>
  );
};

export default Register;

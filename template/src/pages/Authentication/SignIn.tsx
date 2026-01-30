import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from '../../services/auth.service';
import { FaBrain, FaEnvelope, FaLock, FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

const SignIn: React.FC = () => {

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const signIn = async (event: any) => {

    event.preventDefault();


    const formData = new FormData(event.target);
    const data = {
      "email": formData.get('mail'),
      "password": formData.get('password')
    };



    const loginResponse = await LogIn(data);



    if (loginResponse.status >= 200 && loginResponse.status < 300) {
      const uuid = crypto.randomUUID();
      const uuidExpiryTime = new Date(Date.now() + 360000);
      const dataExpiry = {
        uid: uuid,
        expire: uuidExpiryTime
      };

      sessionStorage.setItem("mock-token", JSON.stringify(dataExpiry));

      setError(null);
      navigate("/skill");

    }
    else {
      setError(loginResponse.data?.message || 'Login failed');
    }


  };

  useEffect(() => {

    // console.log('trerertrrr');

    return () => {
      // setError("");
    }

  }, [error]);

  // Okay inona no eto
  // mila avadika zavatra hafa ny eto
  // asiana resaka state

  return (
    <>
      {/* <Breadcrumb pageName="Sign In" /> */}

      <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
        {/* Aesthetic Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/10 blur-[80px] rounded-full"></div>

        <div className="relative z-10 w-full max-w-[480px]">
          <div className="bg-[#121212]/80 backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-2xl overflow-hidden p-10 lg:p-12">
            <div className="flex flex-col items-center">
              {/* Logo section */}
              <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20">
                  <FaBrain className="text-3xl text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">Connexion</h1>
                <p className="text-gray-400 text-sm leading-relaxed max-w-[300px] mx-auto">
                  Connectez-vous à votre compte et gérez vos projets et progrès en toute simplicité.
                </p>
              </div>

              {/* Form Section */}
              <form onSubmit={(event) => signIn(event)} className="w-full space-y-4">
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                    <FaEnvelope className="text-sm" />
                  </div>
                  <input
                    name='mail'
                    type="email"
                    placeholder="Adresse e-mail"
                    className="w-full bg-[#1A1A1A] border border-white/5 rounded-full pl-14 pr-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:bg-[#222] transition-all duration-300"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors">
                    <FaLock className="text-sm" />
                  </div>
                  <input
                    name='password'
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    className="w-full bg-[#1A1A1A] border border-white/5 rounded-full pl-14 pr-14 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:bg-[#222] transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm animate-shake">
                    <FaExclamationCircle className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-full transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-blue-600/20 mt-2"
                >
                  Se connecter
                </button>
              </form>

              {/* Footer Section */}
              <div className="mt-10 text-center space-y-6">
                <div className="flex items-center justify-center gap-4">
                  <div className="h-[1px] w-12 bg-white/5"></div>
                  <span className="text-gray-600 text-xs uppercase tracking-widest">Ou continuer avec</span>
                  <div className="h-[1px] w-12 bg-white/5"></div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {['Google', 'Apple', 'Meta'].map((provider) => (
                    <button key={provider} className="bg-white/5 hover:bg-white/10 border border-white/5 py-2.5 rounded-xl transition-all duration-200">
                      <span className="text-[10px] text-gray-400 font-medium uppercase">{provider}</span>
                    </button>
                  ))}
                </div>

                <div className="text-sm">
                  <p className="text-gray-500">
                    Pas encore de compte ?{' '}
                    <Link to="#" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                      S'inscrire
                    </Link>
                  </p>
                  <Link to="#" className="text-gray-600 hover:text-gray-400 text-xs mt-4 block transition-colors">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default SignIn;

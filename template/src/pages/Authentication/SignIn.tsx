import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from '../../services/auth.service';
import { FaBrain, FaEnvelope, FaLock, FaExclamationCircle, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';

const SignIn: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const signIn = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.target);
    const data = {
      "email": formData.get('mail'),
      "password": formData.get('password')
    };

    try {
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
        navigate("/dashboard");
      } else {
        setError(loginResponse.data?.message || 'Login failed');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/25 rotate-3 hover:rotate-6 transition-transform duration-300">
            <FaBrain className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">TalentIA</h1>
          <p className="text-gray-600 text-lg">Gérez vos talents avec intelligence</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl shadow-blue-500/10 p-8">
          <form onSubmit={signIn} className="space-y-6">
            {/* Email Input */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <FaEnvelope className="text-sm" />
                </div>
                <input
                  name='mail'
                  type="email"
                  placeholder="vous@exemple.com"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <FaLock className="text-sm" />
                </div>
                <input
                  name='password'
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-12 pr-12 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-shake">
                <FaExclamationCircle className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <FaArrowRight className="text-sm" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-gray-500 text-xs uppercase tracking-wider">ou</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                <div className="w-5 h-5 bg-blue-600 rounded"></div>
                Google
              </button>
            </div>

            <div className="text-sm">
              <p className="text-gray-600">
                Pas encore de compte ?{' '}
                <Link to="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  S'inscrire
                </Link>
              </p>
              <Link to="#" className="text-gray-500 hover:text-gray-700 text-xs mt-2 block transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            © 2024 TalentIA. Tous droits réservés.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default SignIn;

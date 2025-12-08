import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from '../../services/auth.service';
import { FaBrain, FaEnvelope, FaLock, FaExclamationCircle, FaSignInAlt } from 'react-icons/fa';

const SignIn: React.FC = () => {

  const[error, setError] = useState<string|null>(null);
  const navigate = useNavigate();
  
  const signIn = async (event : any) => {

    event.preventDefault();


    const formData = new FormData(event.target);
    const data = {
      "email" : formData.get('mail'),
      "password" : formData.get('password')
    };

    
    
    const loginResponse = await LogIn(data);



    if( loginResponse.status >= 200 && loginResponse.status < 300 ){
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

  useEffect(()=>{

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

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-500 rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-6xl">
          <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-700 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
            <div className="flex flex-col lg:flex-row">
              {/* Left side - Branding */}
              <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 text-center">
                  <Link className="mb-8 inline-block transform transition-transform duration-300 hover:scale-110" to="/">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <FaBrain className="text-4xl text-white" />
                    </div>
                  </Link>

                  <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in">
                    TalentIA
                  </h1>

                  <p className="text-white/90 text-lg mb-8 animate-slide-up">
                    Seul l'apprentissage est le chemin pour un bon développement
                  </p>

                  <div className="relative animate-float">
                    <svg
                      width="300"
                      height="300"
                      viewBox="0 0 350 350"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-auto max-w-sm"
                    >
                      <path
                        d="M33.5825 294.844L30.5069 282.723C25.0538 280.414 19.4747 278.414 13.7961 276.732L13.4079 282.365L11.8335 276.159C4.79107 274.148 0 273.263 0 273.263C0 273.263 6.46998 297.853 20.0448 316.653L35.8606 319.429L23.5737 321.2C25.2813 323.253 27.1164 325.196 29.0681 327.019C48.8132 345.333 70.8061 353.736 78.1898 345.787C85.5736 337.838 75.5526 316.547 55.8074 298.235C49.6862 292.557 41.9968 288.001 34.2994 284.415L33.5825 294.844Z"
                        fill="rgba(255,255,255,0.1)"
                      />
                      <path
                        d="M62.8332 281.679L66.4705 269.714C62.9973 264.921 59.2562 260.327 55.2652 255.954L52.019 260.576L53.8812 254.45C48.8923 249.092 45.2489 245.86 45.2489 245.86C45.2489 245.86 38.0686 270.253 39.9627 293.358L52.0658 303.903L40.6299 299.072C41.0301 301.712 41.596 304.324 42.3243 306.893C49.7535 332.77 64.2336 351.323 74.6663 348.332C85.0989 345.341 87.534 321.939 80.1048 296.063C77.8019 288.041 73.5758 280.169 68.8419 273.123L62.8332 281.679Z"
                        fill="rgba(255,255,255,0.1)"
                      />
                      <path
                        d="M243.681 82.9153H241.762V30.3972C241.762 26.4054 240.975 22.4527 239.447 18.7647C237.918 15.0768 235.677 11.7258 232.853 8.90314C230.028 6.0805 226.674 3.84145 222.984 2.31385C219.293 0.786245 215.337 0 211.343 0H99.99C91.9222 0 84.1848 3.20256 78.48 8.90314C72.7752 14.6037 69.5703 22.3354 69.5703 30.3972V318.52C69.5703 322.512 70.3571 326.465 71.8859 330.153C73.4146 333.841 75.6553 337.192 78.48 340.015C81.3048 342.837 84.6582 345.076 88.3489 346.604C92.0396 348.131 95.9952 348.918 99.99 348.918H211.343C219.41 348.918 227.148 345.715 232.852 340.014C238.557 334.314 241.762 326.582 241.762 318.52V120.299H243.68L243.681 82.9153Z"
                        fill="rgba(255,255,255,0.1)"
                      />
                      <path
                        d="M212.567 7.9054H198.033C198.701 9.54305 198.957 11.3199 198.776 13.0793C198.595 14.8387 197.984 16.5267 196.997 17.9946C196.01 19.4625 194.676 20.6652 193.114 21.4967C191.552 22.3283 189.809 22.7632 188.039 22.7632H124.247C122.477 22.7631 120.734 22.3281 119.172 21.4964C117.61 20.6648 116.277 19.462 115.289 17.9942C114.302 16.5263 113.691 14.8384 113.511 13.079C113.33 11.3197 113.585 9.54298 114.254 7.9054H100.678C94.6531 7.9054 88.8749 10.297 84.6146 14.5542C80.3543 18.8113 77.9609 24.5852 77.9609 30.6057V318.31C77.9609 324.331 80.3543 330.105 84.6146 334.362C88.8749 338.619 94.6531 341.011 100.678 341.011H212.567C218.592 341.011 224.37 338.619 228.63 334.362C232.891 330.105 235.284 324.331 235.284 318.31V30.6053C235.284 24.5848 232.891 18.811 228.63 14.554C224.37 10.297 218.592 7.9054 212.567 7.9054Z"
                        fill="rgba(255,255,255,0.2)"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Right side - Login Form */}
              <div className="w-full lg:w-1/2 p-12 lg:p-16">
                <div className="max-w-md mx-auto">
                  <h2 className="text-3xl font-bold text-white mb-2 animate-fade-in">
                    Welcome Back
                  </h2>
                  <p className="text-gray-400 mb-8 animate-slide-up">
                    Sign in to your TalentIA account
                  </p>

                  <form onSubmit={(event) => signIn(event)} className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">
                        <FaEnvelope className="mr-2" />
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          name='mail'
                          type="email"
                          placeholder="Enter your email"
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:bg-gray-700/70"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors">
                          <FaEnvelope />
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-blue-400 transition-colors">
                        <FaLock className="mr-2" />
                        Password
                      </label>
                      <div className="relative">
                        <input
                          name='password'
                          type="password"
                          placeholder="Your password"
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:bg-gray-700/70"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors">
                          <FaLock />
                        </div>
                      </div>
                    </div>

                    { error && (
                      <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center space-x-2 animate-slide-down">
                        <FaExclamationCircle />
                        <span>{ error }</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        <FaSignInAlt className="mr-2" />
                        Sign In
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </form>

                  <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                      Forgot your password?{' '}
                      <Link to="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                        Reset it here
                      </Link>
                    </p>
                  </div>
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
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>  
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
        
      <style>{`
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
        
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default SignIn;

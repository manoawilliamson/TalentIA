import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/index';
import Header from '../components/Header/index';
import { Outlet, useNavigate } from 'react-router-dom';

const DefaultLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let sessionData: any = sessionStorage.getItem("mock-token");

    if (!sessionData || sessionData == null) navigate("/");
    try {
      sessionData = JSON.parse(sessionData);
      let now = new Date(Date.now());
      if (now > sessionData?.expire) navigate("/");
    } catch (e) {
      navigate("/");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-inter relative overflow-x-hidden">
      {/* Background Decorations */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10 animate-fade-in"></div>
      <div className="fixed bottom-20 right-20 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl -z-10 animate-fade-in"></div>
      
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden animate-fade-in">

        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden lg:ml-64 main-content">

          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className="flex-1 animate-fade-in">
            <Outlet />
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default DefaultLayout;

import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark text-primary selection:bg-indigo-500/30 relative">
      {/* Noise Texture Overlay */}
      <svg className="fixed inset-0 z-[-1] w-full h-full opacity-[0.15] pointer-events-none mix-blend-soft-light" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
      </svg>

      {/* Cinematic Glowing Backgrounds */}
      <div className="fixed inset-0 z-[-2] overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/20 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute top-[30%] left-[40%] w-[70%] h-[50%] bg-purple-600/10 rounded-full blur-[180px] mix-blend-screen" />
      </div>

      <Navbar />
      <main className="flex-grow z-10 w-full mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

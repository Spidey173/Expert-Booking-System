import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 glass rounded-none border-t-0 border-x-0 border-b-border bg-dark/60">
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-card border border-border p-2 rounded-xl">
                <Sparkles className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-secondary tracking-tight">
              ExpertHub
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-6">
            <Link 
              to="/experts" 
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                isActive('/experts')
                  ? 'text-white'
                  : 'text-secondary hover:text-primary hover:bg-white/5'
              }`}
            >
              {isActive('/experts') && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 bg-white/10 rounded-xl border border-white/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Users className="h-4 w-4 relative z-10" />
              <span className="hidden sm:inline relative z-10">Find Experts</span>
              <span className="sm:hidden text-xs relative z-10">Experts</span>
            </Link>

            <Link 
              to="/my-bookings" 
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                isActive('/my-bookings')
                  ? 'text-white'
                  : 'text-secondary hover:text-primary hover:bg-white/5'
              }`}
            >
              {isActive('/my-bookings') && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 bg-white/10 rounded-xl border border-white/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Calendar className="h-4 w-4 relative z-10" />
              <span className="hidden sm:inline relative z-10">My Bookings</span>
              <span className="sm:hidden text-xs relative z-10">Bookings</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

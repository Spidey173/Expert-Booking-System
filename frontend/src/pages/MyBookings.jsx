import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle, Sparkles, MapPin, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const location = useLocation();
  const initialEmail = location.state?.email || '';
  
  const [email, setEmail] = useState(initialEmail);
  const [searchEmail, setSearchEmail] = useState(initialEmail);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialEmail);

  useEffect(() => {
    if (initialEmail) {
      fetchBookings();
    }
  }, []);

  const fetchBookings = async () => {
    if (!searchEmail || !searchEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get(`/bookings?email=${searchEmail}`);
      setBookings(data);
      setHasSearched(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchEmail(email);
    fetchBookings();
  };

  const getStatusBadge = (status) => {
    const statusConfigs = {
      'Confirmed': { icon: CheckCircle2, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Confirmed' },
      'Pending': { icon: AlertCircle, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Pending' },
      'Completed': { icon: CheckCircle2, color: 'bg-white/5 text-secondary border-border', label: 'Completed' },
    };
    
    const config = statusConfigs[status] || statusConfigs['Confirmed'];
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-xs uppercase tracking-wider ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </div>
    );
  };

  const isUpcoming = (bookingDate) => {
    return new Date(bookingDate) > new Date();
  };

  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-36 border-b border-border">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-cyan-600/20 rounded-full blur-[150px] mix-blend-screen"
          />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 text-center mt-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4" />
              <span>Your Sessions</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold text-primary mb-6 tracking-tight">
              My Bookings
            </h1>
            <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
              Manage and track all your upcoming and past sessions with expert coaches.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 -mt-16 relative z-20 pb-32">
        {/* Search Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass p-6 sm:p-8 mb-16 rounded-3xl shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-400/20 flex items-center justify-center border border-white/10 flex-shrink-0">
              <Search className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="flex-grow w-full">
              <h2 className="text-xl font-bold text-primary mb-2">Find Your Bookings</h2>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <input
                    type="email"
                    placeholder="Enter the email address you used..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field w-full"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary whitespace-nowrap px-8"
                >
                  {loading ? 'Searching...' : 'Search Bookings'}
                </button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="card p-6 sm:p-8">
                <div className="flex gap-6">
                  <div className="skeleton w-20 h-20 rounded-2xl"></div>
                  <div className="flex-grow space-y-4">
                    <div className="skeleton h-6 w-1/3 rounded-lg"></div>
                    <div className="skeleton h-4 w-1/4 rounded-lg"></div>
                    <div className="flex gap-4">
                      <div className="skeleton h-4 w-1/5 rounded-lg"></div>
                      <div className="skeleton h-4 w-1/5 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : hasSearched ? (
          bookings.length > 0 ? (
            <AnimatePresence>
              <div className="space-y-16">
                {/* Upcoming Bookings */}
                {sortedBookings.some(b => isUpcoming(b.date)) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <CalendarIcon className="w-6 h-6 text-indigo-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-primary">Upcoming Sessions</h3>
                    </div>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[3.5rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:to-transparent">
                      {sortedBookings.filter(b => isUpcoming(b.date)).map((booking) => (
                        <BookingCard key={booking._id} booking={booking} getStatusBadge={getStatusBadge} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Past Bookings */}
                {sortedBookings.some(b => !isUpcoming(b.date)) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-border">
                        <Clock className="w-6 h-6 text-secondary" />
                      </div>
                      <h3 className="text-2xl font-bold text-primary opacity-80">Past Sessions</h3>
                    </div>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[3.5rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:to-transparent">
                      {sortedBookings.filter(b => !isUpcoming(b.date)).map((booking) => (
                        <BookingCard key={booking._id} booking={booking} getStatusBadge={getStatusBadge} isPast />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-16 text-center rounded-3xl"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/5 border border-border rounded-3xl mb-6 shadow-inner">
                <CalendarIcon className="w-12 h-12 text-secondary" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-3 tracking-tight">
                No bookings found
              </h3>
              <p className="text-secondary text-lg mb-8 max-w-md mx-auto">
                We couldn't find any bookings associated with <span className="font-semibold text-primary">"{searchEmail}"</span>. Try searching with a different email.
              </p>
              <button
                onClick={() => setHasSearched(false)}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Try Another Email
              </button>
            </motion.div>
          )
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-dark rounded-full mb-6 border border-border shadow-2xl relative">
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl"></div>
              <Search className="w-10 h-10 text-cyan-400 relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">
              Start searching
            </h3>
            <p className="text-secondary">
              Enter the email address you used during booking to view your sessions
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Booking Card Component
const BookingCard = ({ booking, getStatusBadge, isPast = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active ${isPast ? 'opacity-70 grayscale-[20%]' : ''}`}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-dark bg-cyan-400 text-dark shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-sm">
        <Video className="w-4 h-4" />
      </div>
      
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] card p-6 hover:border-cyan-400/50 transition-colors">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Expert Info */}
          <div className="flex items-start gap-4 flex-grow">
            <img
              src={booking.expertId.image}
              alt={booking.expertId.name}
              className="w-16 h-16 rounded-xl object-cover border border-white/10 shadow-lg flex-shrink-0"
            />
            <div className="flex-grow min-w-0">
              <h4 className="text-xl font-bold text-primary mb-1">
                {booking.expertId.name}
              </h4>
              <p className="text-sm text-cyan-400 font-semibold mb-4 uppercase tracking-wider">
                {booking.expertId.category}
              </p>

              {/* Date & Time */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm text-secondary bg-white/5 px-3 py-1.5 rounded-md border border-border">
                  <CalendarIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span className="font-medium">
                    {new Date(booking.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary bg-white/5 px-3 py-1.5 rounded-md border border-border">
                  <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="font-medium">{booking.timeSlot}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
          {getStatusBadge(booking.status)}
          
          <div className="text-right">
            <p className="text-xs text-secondary font-medium">Booked on</p>
            <p className="text-sm font-bold text-primary">
              {new Date(booking.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Notes Section */}
        {booking.notes && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
              Your Notes
            </p>
            <p className="text-sm text-secondary leading-relaxed bg-dark/50 p-3 rounded-lg border border-border">
              {booking.notes}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MyBookings;

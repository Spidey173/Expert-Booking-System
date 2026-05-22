import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Award, Calendar as CalendarIcon, Clock, ArrowRight, Quote, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import socket from '../socket/socket';
import toast from 'react-hot-toast';

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchExpert();

    socket.on('slotBooked', (data) => {
      if (data.expertId === id) {
        setExpert((prevExpert) => {
          if (!prevExpert) return prevExpert;
          
          const updatedSlots = prevExpert.availableSlots.map(day => {
            if (day.date === data.date) {
              return {
                ...day,
                slots: day.slots.filter(s => s !== data.timeSlot)
              };
            }
            return day;
          });
          
          return { ...prevExpert, availableSlots: updatedSlots };
        });
      }
    });

    return () => {
      socket.off('slotBooked');
    };
  }, [id]);

  const fetchExpert = async () => {
    try {
      const { data } = await api.get(`/experts/${id}`);
      setExpert(data);
      if (data.availableSlots && data.availableSlots.length > 0) {
        setSelectedDate(data.availableSlots[0].date);
      }
    } catch (error) {
      toast.error('Expert not found');
      navigate('/experts');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = (timeSlot) => {
    navigate('/book', {
      state: {
        expert,
        date: selectedDate,
        timeSlot,
      }
    });
  };

  if (loading) {
    return (
      <div className="max-w-[1700px] mx-auto px-6 lg:px-12 xl:px-16 2xl:px-24 py-12 lg:py-20">
        <div className="skeleton h-[500px] rounded-[2.5rem] mb-12 border border-border"></div>
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2 space-y-8">
            <div className="skeleton h-40 rounded-3xl border border-border"></div>
            <div className="skeleton h-80 rounded-3xl border border-border"></div>
          </div>
          <div className="skeleton h-[600px] rounded-3xl border border-border"></div>
        </div>
      </div>
    );
  }

  if (!expert) return null;

  const currentDaySlots = expert.availableSlots?.find(d => d.date === selectedDate);
  const availableSlotsCount = expert.availableSlots?.reduce((sum, day) => sum + day.slots.length, 0) || 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1700px] mx-auto px-6 lg:px-12 xl:px-16 2xl:px-24 py-12 lg:py-20"
    >
      {/* Profile Header Card */}
      <div className="relative mb-16 rounded-[2.5rem] overflow-hidden border border-border shadow-2xl group">
        {/* Cinematic Background Banner */}
        <div className="relative h-80 sm:h-[450px] bg-dark overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute -left-1/4 -top-1/4 w-[1000px] h-[1000px] bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full blur-[150px] mix-blend-screen animate-pulse"></div>
            <div className="absolute -right-1/4 -bottom-1/4 w-[1000px] h-[1000px] bg-gradient-to-tl from-cyan-600 to-teal-600 rounded-full blur-[150px] mix-blend-screen"></div>
          </div>
          <img 
            src={expert.image} 
            alt="background blur" 
            className="w-full h-full object-cover opacity-20 blur-xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative px-8 sm:px-16 pb-16 bg-dark/80 backdrop-blur-xl">
          {/* Image & Basic Info */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 -mt-32 md:-mt-40 mb-12 items-start md:items-end">
            {/* Profile Image */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group-hover:scale-105 transition-transform duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-3xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img
                src={expert.image}
                alt={expert.name}
                className="relative w-40 sm:w-56 h-40 sm:h-56 rounded-3xl object-cover border border-white/20 shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 glass px-4 py-2 rounded-xl flex items-center gap-2 shadow-glass border border-white/20">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                <span className="font-semibold text-primary text-sm tracking-wide">Online</span>
              </div>
            </motion.div>

            {/* Header Info */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex-grow flex flex-col justify-end"
            >
              <div className="flex flex-wrap items-center gap-4 mb-2">
                <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">
                  {expert.name}
                </h1>
                <span className="px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-lg text-indigo-400 text-sm font-bold uppercase tracking-wider">
                  Top Expert
                </span>
              </div>
              <p className="text-xl text-cyan-400 font-medium mb-6 uppercase tracking-widest">
                {expert.category}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 sm:gap-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                    <Star className="w-6 h-6 text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary font-medium tracking-wide">Rating</p>
                    <p className="text-2xl font-bold text-primary">{expert.rating}</p>
                  </div>
                </div>
                <div className="w-px h-12 bg-border hidden sm:block"></div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                    <Award className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary font-medium tracking-wide">Experience</p>
                    <p className="text-2xl font-bold text-primary">{expert.experience}y</p>
                  </div>
                </div>
                <div className="w-px h-12 bg-border hidden sm:block"></div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                    <CalendarIcon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary font-medium tracking-wide">Available</p>
                    <p className="text-2xl font-bold text-primary">{availableSlotsCount}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bio Section */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-t border-border pt-8 mt-8"
          >
            <div className="flex gap-4">
              <Quote className="w-8 h-8 text-indigo-500/50 flex-shrink-0 rotate-180" />
              <p className="text-lg sm:text-xl text-secondary leading-relaxed font-light">
                {expert.bio}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="card p-6 sm:p-10"
          >
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary flex items-center gap-4">
                <div className="w-3 h-8 bg-gradient-to-b from-indigo-500 to-cyan-400 rounded-full"></div>
                Select Session Time
              </h2>
            </div>

            {expert.availableSlots?.length > 0 ? (
              <div className="space-y-10">
                {/* Date Selection */}
                <div>
                  <h3 className="text-sm font-bold text-secondary uppercase tracking-widest mb-6">
                    Pick a Date
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {expert.availableSlots.map((day) => (
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        key={day.date}
                        onClick={() => setSelectedDate(day.date)}
                        className={`relative group p-4 rounded-2xl border transition-all duration-300 ${
                          selectedDate === day.date
                            ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/50 shadow-glow'
                            : 'bg-white/5 border-border hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="text-center relative z-10">
                          <p className={`text-sm font-bold mb-2 ${
                            selectedDate === day.date
                              ? 'text-primary'
                              : 'text-secondary group-hover:text-primary'
                          }`}>
                            {new Date(day.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                            selectedDate === day.date
                              ? 'bg-indigo-500 text-white'
                              : day.slots.length > 0
                                ? 'bg-white/10 text-cyan-400 group-hover:bg-white/20'
                                : 'bg-white/5 text-slate-500'
                          }`}>
                            {day.slots.length} slots
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Time Slots (Timeline Style) */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Available Times
                    </h3>
                    <p className="text-sm text-cyan-400 font-medium bg-cyan-400/10 px-3 py-1 rounded-full">
                      {new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {currentDaySlots?.slots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      <AnimatePresence>
                        {currentDaySlots.slots.map((slot, index) => (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            key={slot}
                            onClick={() => handleBookSlot(slot)}
                            className="group relative px-4 py-4 rounded-2xl bg-white/5 border border-border hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all duration-300 flex items-center justify-center overflow-hidden"
                          >
                            <span className="relative z-10 text-lg font-bold text-primary group-hover:text-cyan-400 transition-colors">
                              {slot}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass border border-border rounded-2xl p-12 text-center"
                    >
                      <CalendarIcon className="w-16 h-16 text-secondary mx-auto mb-4 opacity-50" />
                      <p className="text-lg text-primary font-bold mb-2">
                        No slots available on this date
                      </p>
                      <p className="text-secondary">
                        Please select another date from the calendar above
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 glass rounded-2xl">
                <CalendarIcon className="w-16 h-16 text-secondary mx-auto mb-4 opacity-50" />
                <p className="text-xl text-primary font-bold mb-2">No available sessions</p>
                <p className="text-secondary">
                  This expert currently has no available sessions schedule. Check back later.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sticky Sidebar */}
        <div className="lg:col-span-1">
          {currentDaySlots?.slots.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="glass p-8 sticky top-28 rounded-3xl shadow-2xl border border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-400/5 rounded-3xl pointer-events-none"></div>
              
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                Session Details
              </h3>
              
              <div className="space-y-6 mb-8 relative z-10">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-border">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    1
                  </div>
                  <div>
                    <p className="text-xs text-secondary uppercase tracking-widest font-bold mb-1">Duration</p>
                    <p className="text-lg font-bold text-primary">60 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-border">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    <img src={expert.image} alt={expert.name} className="w-full h-full object-cover rounded-xl opacity-80 mix-blend-luminosity" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary uppercase tracking-widest font-bold mb-1">With Expert</p>
                    <p className="text-lg font-bold text-primary">{expert.name}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6 mb-8 relative z-10">
                <p className="text-xs text-secondary uppercase tracking-widest font-bold mb-4">Why book this session?</p>
                <ul className="space-y-4">
                  {[
                    '1-on-1 personalized guidance',
                    'Actionable insights & strategies',
                    'Direct access to industry expertise',
                    'Post-session review notes'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-primary">
                      <div className="w-5 h-5 rounded-full bg-cyan-400/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center relative z-10">
                <p className="text-sm text-secondary font-medium bg-white/5 py-2 px-4 rounded-lg inline-block border border-border">
                  Select a time slot to continue <ArrowRight className="w-4 h-4 inline-block ml-1" />
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ExpertDetail;

import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, User, Mail, Phone, CheckCircle2, ArrowLeft, ShieldCheck, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import toast from 'react-hot-toast';

const InputField = ({ icon: Icon, label, type, name, value, onChange, focusedField, setFocusedField, errors }) => (
  <div className="relative z-0 w-full mb-8 group">
    <div className={`absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors duration-300 ${focusedField === name ? 'text-indigo-400' : 'text-secondary'}`}>
      <Icon className="w-5 h-5" />
    </div>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      onFocus={() => setFocusedField(name)}
      onBlur={() => setFocusedField(null)}
      className={`block py-4 pl-12 pr-4 w-full text-lg text-primary bg-transparent border-b-2 appearance-none focus:outline-none focus:ring-0 transition-all duration-300 peer ${
        errors[name] ? 'border-red-500' : 'border-border focus:border-indigo-500'
      }`}
      placeholder=" "
      autoComplete="off"
    />
    <label
      htmlFor={name}
      className={`absolute text-base duration-300 transform -translate-y-8 scale-75 top-4 left-12 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8 ${
        errors[name] ? 'text-red-500' : focusedField === name ? 'text-indigo-400' : 'text-secondary'
      }`}
    >
      {label} <span className="text-red-500">*</span>
    </label>
    {errors[name] && (
      <motion.p 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute -bottom-6 left-0 text-red-500 text-xs font-medium"
      >
        {errors[name]}
      </motion.p>
    )}
  </div>
);

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  if (!state || !state.expert || !state.date || !state.timeSlot) {
    return <Navigate to="/experts" replace />;
  }

  const { expert, date, timeSlot } = state;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/[-()\s]/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await api.post('/bookings', {
        expertId: expert._id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date,
        timeSlot,
        notes: formData.notes,
      });

      toast.success('Booking confirmed successfully!');
      navigate('/my-bookings', { state: { email: formData.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="max-w-[1700px] mx-auto px-6 lg:px-12 xl:px-16 2xl:px-24 py-12 lg:py-20">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-secondary hover:text-primary font-medium transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Expert
      </motion.button>

      <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
        {/* Left Side: Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3 order-2 lg:order-1"
        >
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-primary mb-4 tracking-tight">Confirm Your Details</h1>
            <p className="text-lg text-secondary">Please provide your contact information to secure the session.</p>
          </div>

          <form onSubmit={handleSubmit} className="glass p-8 sm:p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"></div>
            
            <div className="space-y-4 pt-4">
              <InputField 
                icon={User} 
                label="Full Name" 
                type="text" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                errors={errors}
              />
              <InputField 
                icon={Mail} 
                label="Email Address" 
                type="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                errors={errors}
              />
              <InputField 
                icon={Phone} 
                label="Phone Number" 
                type="tel" 
                name="phone" 
                value={formData.phone}
                onChange={handleChange}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                errors={errors}
              />

              {/* Notes */}
              <div className="relative z-0 w-full mb-8 group mt-6">
                <textarea
                  name="notes"
                  id="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('notes')}
                  onBlur={() => setFocusedField(null)}
                  rows="4"
                  className="block py-4 px-4 w-full text-base text-primary bg-dark/30 border border-border rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none peer"
                  placeholder="What would you like to discuss? Share any topics or goals..."
                ></textarea>
                <label
                  htmlFor="notes"
                  className={`absolute -top-3 left-3 px-2 bg-dark text-xs font-medium transition-colors ${
                    focusedField === 'notes' ? 'text-indigo-400' : 'text-secondary'
                  }`}
                >
                  Notes for {expert.name.split(' ')[0]} (Optional)
                </label>
                <p className="absolute -bottom-6 right-0 text-xs text-secondary font-medium">
                  {formData.notes.length}/500
                </p>
              </div>
            </div>

            {/* Terms & Submit */}
            <div className="mt-12 pt-8 border-t border-border">
              <label className="flex items-start gap-4 mb-8 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-1">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-secondary rounded overflow-hidden peer-checked:border-indigo-500 peer-checked:bg-indigo-500 transition-all duration-300 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white scale-0 peer-checked:scale-100 transition-transform duration-300" />
                  </div>
                </div>
                <span className="text-sm text-secondary group-hover:text-primary transition-colors leading-relaxed">
                  I agree to the terms and conditions. I understand this is a confirmed booking and cancellation policies apply.
                </span>
              </label>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Confirm Booking</span>
                  </>
                )}
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Right Side: Summary Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 order-1 lg:order-2 sticky top-28"
        >
          <div className="card overflow-hidden">
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-cyan-400/10 border-b border-border">
              <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                Session Summary
              </h2>
              
              <div className="flex items-start gap-4">
                <img
                  src={expert.image}
                  alt={expert.name}
                  className="w-20 h-20 rounded-2xl object-cover shadow-lg border border-white/10"
                />
                <div>
                  <h3 className="text-xl font-bold text-primary mb-1">{expert.name}</h3>
                  <p className="text-sm text-cyan-400 font-semibold mb-2">{expert.category}</p>
                  <div className="flex items-center gap-1.5 bg-white/5 inline-flex px-2 py-1 rounded-md border border-border">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-primary">{expert.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <CalendarIcon className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-secondary uppercase tracking-widest font-bold mb-1">Date</p>
                  <p className="text-base font-bold text-primary">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
                  <Clock className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-secondary uppercase tracking-widest font-bold mb-1">Time</p>
                  <p className="text-base font-bold text-primary">{timeSlot}</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-dark/50 border-t border-border flex items-center justify-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <p className="text-sm text-secondary font-medium">
                Secure & Encrypted Booking
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingPage;

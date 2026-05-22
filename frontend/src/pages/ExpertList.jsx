import { useState, useEffect } from 'react';
import { Search, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import ExpertCard from '../components/ExpertCard';
import toast from 'react-hot-toast';

const categories = ['All', 'Therapist', 'Life Coach', 'Nutritionist', 'Fitness Trainer', 'Yoga Instructor', 'Financial Advisor'];

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchExperts();
  }, [debouncedSearch, category, page]);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const categoryQuery = category === 'All' ? '' : category;
      const { data } = await api.get(`/experts?page=${page}&limit=10&search=${debouncedSearch}&category=${categoryQuery}`);
      setExperts(data.experts);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch experts');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24 pb-40 border-b border-border">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[150px] mix-blend-screen"
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-20%] left-1/4 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[150px] mix-blend-screen"
          />
        </div>

        <div className="relative max-w-[1800px] mx-auto px-6 lg:px-12 xl:px-16 2xl:px-24 text-center mt-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center relative"
          >
            {/* Spotlight Glow Behind Heading */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-500/30 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm font-bold uppercase tracking-widest mb-8 backdrop-blur-md relative z-10 shadow-glass">
              <Sparkles className="w-4 h-4" />
              <span>Discover Experts</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-primary mb-8 leading-tight tracking-tight max-w-6xl mx-auto relative z-10">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 mt-2">
                Guide to Greatness
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-secondary max-w-3xl mx-auto leading-relaxed relative z-10 font-light">
              Connect with world-class professionals for personalized guidance. Fast-track your journey with experts who have been there.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 xl:px-16 2xl:px-24 -mt-16 relative z-20 mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass p-6 sm:p-8 shadow-2xl max-w-5xl mx-auto"
        >
          <div className="flex flex-col gap-8">
            {/* Search Input */}
            <div className="relative group w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                <Search className="h-6 w-6 text-secondary group-focus-within:text-cyan-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search experts by name, role, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-16 py-5 text-xl rounded-2xl w-full bg-dark/60 focus:bg-dark border-white/10 focus:border-cyan-400/50"
              />
            </div>

            {/* Horizontal Category Pills */}
            <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 scrollbar-hide gap-3 sm:gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${
                    category === cat
                      ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 text-white border-transparent shadow-glow scale-105'
                      : 'bg-white/5 text-secondary border-border hover:bg-white/10 hover:text-primary hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 xl:px-16 2xl:px-24 pb-32">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 lg:gap-10">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <div key={n} className="card overflow-hidden">
                <div className="skeleton h-72 sm:h-80 m-4 rounded-xl border border-border"></div>
                <div className="p-6 space-y-4">
                  <div className="skeleton h-6 w-3/4 rounded-lg"></div>
                  <div className="skeleton h-4 w-1/2 rounded-lg"></div>
                  <div className="space-y-2 mt-6">
                     <div className="skeleton h-3 rounded-lg"></div>
                    <div className="skeleton h-3 w-5/6 rounded-lg"></div>
                  </div>
                  <div className="skeleton h-12 rounded-xl mt-6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : experts.length > 0 ? (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-10 flex justify-between items-end border-b border-white/5 pb-4"
            >
              <p className="text-base text-secondary font-medium">
                Showing <span className="font-bold text-primary">{experts.length}</span> experts 
                {search && <> matching "<span className="font-bold text-primary">{search}</span>"</>}
              </p>
            </motion.div>

            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 lg:gap-10 mb-20"
            >
              <AnimatePresence mode="popLayout">
                {experts.map((expert) => (
                  <ExpertCard key={expert._id} expert={expert} />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary flex items-center gap-2 px-8 py-4 text-base"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-border rounded-xl backdrop-blur-sm">
                  <span className="text-base font-medium text-secondary">Page</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={page}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1));
                      setPage(val);
                    }}
                    className="w-16 text-center bg-dark/50 border border-border rounded-lg py-1.5 text-base font-bold text-primary focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                  <span className="text-base font-medium text-secondary">of {totalPages}</span>
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-secondary flex items-center gap-2 px-8 py-4 text-base"
                >
                  <span>Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-20 text-center max-w-3xl mx-auto rounded-3xl"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/5 rounded-3xl mb-8 border border-border shadow-inner">
              <Search className="w-12 h-12 text-secondary" />
            </div>
            <h3 className="text-3xl font-bold text-primary mb-4 tracking-tight">
              No experts found
            </h3>
            <p className="text-secondary text-xl font-light">
              We couldn't find any experts matching your criteria. Try adjusting your search or category filters.
            </p>
            <button 
              onClick={() => { setSearch(''); setCategory('All'); }}
              className="mt-10 btn-secondary px-8 py-4 text-lg"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExpertList;

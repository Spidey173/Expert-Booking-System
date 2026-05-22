import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const ExpertCard = React.forwardRef(({ expert }, ref) => {
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="card group flex flex-col h-full relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
      
      {/* Image Container */}
      <div className="relative p-4 pb-0">
        <div className="relative h-72 sm:h-80 rounded-xl overflow-hidden shadow-lg border border-white/10 group-hover:border-indigo-500/30 transition-colors duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-cyan-400/20 mix-blend-overlay z-10"></div>
          <img
            src={expert.image}
            alt={expert.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent opacity-90 z-10"></div>
          
          {/* Rating Badge */}
          <div className="absolute top-4 right-4 glass px-3 py-1.5 flex items-center gap-1.5 z-20 shadow-glass">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
            <span className="font-bold text-primary text-sm">{expert.rating}</span>
          </div>

          {/* Availability Indicator */}
          <div className="absolute top-4 left-4 glass px-3 py-1.5 flex items-center gap-2 z-20 shadow-glass">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
            <span className="font-medium text-primary text-xs">Available Today</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col relative z-20">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-primary group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-cyan-400 transition-all duration-300">
            {expert.name}
          </h3>
          <p className="text-sm font-medium text-cyan-400 mt-1 uppercase tracking-wider">
            {expert.category}
          </p>
        </div>

        {/* Experience & Stats */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-2 text-xs text-secondary bg-white/5 rounded-lg px-3 py-2 border border-border">
            <Award className="w-4 h-4 text-indigo-400" />
            <span className="font-medium">{expert.experience}y Exp</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-secondary bg-white/5 rounded-lg px-3 py-2 border border-border">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="font-medium">Replies ~1h</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-secondary line-clamp-2 mb-8 flex-grow leading-relaxed">
          {expert.bio}
        </p>

        {/* CTA Button */}
        <Link
          to={`/experts/${expert._id}`}
          className="w-full btn-primary flex items-center justify-center gap-2 group/btn"
        >
          <span>View Profile</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
});

ExpertCard.displayName = 'ExpertCard';

export default ExpertCard;

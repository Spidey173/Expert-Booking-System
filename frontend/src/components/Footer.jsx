import React from 'react';
import { Sparkles } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-dark/50 backdrop-blur-md relative z-10">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 xl:px-16 2xl:px-24 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col items-start sm:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-card border border-border p-2 rounded-xl">
                <Sparkles className="h-5 w-5 text-cyan-400" />
              </div>
              <span className="font-bold text-xl text-primary tracking-tight">ExpertHub</span>
            </div>
            <p className="text-secondary text-sm leading-relaxed max-w-sm">
              Connect with world-class experts for personalized guidance and mentorship. Build your future today.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-primary mb-6 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-4 text-sm text-secondary">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Security</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-primary mb-6 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-4 text-sm text-secondary">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-secondary">
            &copy; {currentYear} ExpertHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0 text-sm text-secondary">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

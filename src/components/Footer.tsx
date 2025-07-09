import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <Layers size={24} />
              <span className="text-xl font-bold text-white">TraceChain</span>
            </Link>
            <p className="mt-4 max-w-md text-slate-400">
              Secure supply chain traceability with blockchain verification and zero-knowledge proofs.
              Ensuring transparency and authenticity across the entire product journey.
            </p>
            <div className="mt-6 flex space-x-4">
              <a 
                href="#" 
                className="text-slate-400 transition-colors hover:text-white"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="#" 
                className="text-slate-400 transition-colors hover:text-white"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-400 transition-colors hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/create" className="text-slate-400 transition-colors hover:text-white">Create</Link>
              </li>
              <li>
                <Link to="/scan" className="text-slate-400 transition-colors hover:text-white">Scan</Link>
              </li>
              <li>
                <Link to="/verify" className="text-slate-400 transition-colors hover:text-white">Verify</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-400 transition-colors hover:text-white">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-slate-400 transition-colors hover:text-white">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-slate-400 transition-colors hover:text-white">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
          <p>&copy; {year} TraceChain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
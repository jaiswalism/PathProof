import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Layers } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-teal-600 transition-colors hover:text-teal-700"
          >
            <Layers size={28} />
            <span className="text-xl font-bold">TraceChain</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-8">
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/create">Create</NavLink>
              </li>
              <li>
                <NavLink to="/scan">Scan</NavLink>
              </li>
              <li>
                <NavLink to="/verify">Verify</NavLink>
              </li>
            </ul>
          </nav>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="bg-white px-4 py-4 shadow-lg">
            <ul className="flex flex-col space-y-4">
              <li>
                <NavLink to="/" mobile>Home</NavLink>
              </li>
              <li>
                <NavLink to="/create" mobile>Create</NavLink>
              </li>
              <li>
                <NavLink to="/scan" mobile>Scan</NavLink>
              </li>
              <li>
                <NavLink to="/verify" mobile>Verify</NavLink>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  mobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, mobile }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`block py-1 font-medium transition-colors ${
        isActive 
          ? 'text-teal-600' 
          : 'text-slate-700 hover:text-teal-600'
      } ${mobile ? 'text-lg' : ''}`}
    >
      {children}
    </Link>
  );
};

export default Header;
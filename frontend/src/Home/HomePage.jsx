import { useState, useEffect } from 'react';
import Footer from '../Component/Footer';
import HeroSection from './Components/HeroSection';
import MetricesSection from './Components/MetricesSection';
import ServicesSection from './Components/ServicesSection';
import ProcessSection from './Components/ProcessSection';
import CTASection from './Components/CTASection';
import Navbar from '../Component/Navbar';


export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('track');
  const savedUser = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 

 

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@600;700&display=swap');
        
        * {
          font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .serif-font {
          font-family: 'IBM Plex Serif', Georgia, serif;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        
        .nav-border {
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }
        
        .subtle-shadow {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        }
        
        .elevated-shadow {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
      `}</style>

      {/* Navigation */}
      <Navbar user={savedUser}/>
      
      {/* Hero Section */}
      <HeroSection user={savedUser}/>

      {/* Metrics Section */}
      <MetricesSection/>

      {/* Services Section */}
      <ServicesSection/>

      {/* Process Section */}
      <ProcessSection/>

      {/* CTA Section */}
      <CTASection/>

      {/* Footer */}
      <Footer/>
    </div>
  );
}

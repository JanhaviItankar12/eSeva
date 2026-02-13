import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="6" fill="#1e40af"/>
                  <path d="M16 8L20 12H18V20H14V12H12L16 8Z" fill="white"/>
                  <rect x="10" y="21" width="12" height="2" fill="white"/>
                </svg>
                <span className="text-white font-semibold">eSeva</span>
              </div>
              <p className="text-sm text-slate-500">
                District-level e-governance platform for transparent certificate processing.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Birth Certificate</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Residence Certificate</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Income Certificate</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Caste Certificate</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Domicile Certificate</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">User Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Grievance Portal</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>Helpline: 1800-XXX-XXXX</li>
                <li>Email: support@eseva.gov.in</li>
                <li>Mon-Fri: 9:00 AM - 6:00 PM</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© 2026 eSeva. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>

  )
}

export default Footer
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const HeroSection = ({user}) => {
    const [activeTab, setActiveTab] = useState('track');
    const navigate=useNavigate();
    
    const handleNewApply=()=>{

      if(!user){
        navigate('/login');
      }
      else{
        navigate(`/citizen/new-application/${user.id}`)
      }
    }

    const handleTrack=()=>{

      if(!user){
        navigate('/login');
      }
      else{
        navigate(`/citizen/track-applications/${user.id}`)
      }
    }

  return (
     <section className="pt-32 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded text-xs font-medium text-blue-800 fade-in">
                Government of India Initiative
              </div>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight serif-font fade-in delay-1">
                District-Level E-Governance Platform
              </h1>
              
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl fade-in delay-2">
                A unified digital infrastructure for transparent certificate processing with hierarchical verification, real-time tracking, and comprehensive analytics across Gram, Tehsil, and District offices.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2 fade-in delay-3">
                <button onClick={handleNewApply} className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded transition-colors text-sm">
                  New Application
                </button>
                <button onClick={handleTrack} className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded border border-slate-300 transition-colors text-sm">
                  Track Application
                </button>
              </div>
              
              <div className="pt-6 border-t border-slate-200 fade-in delay-4">
                <div className="flex items-center space-x-8">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">24,405</div>
                    <div className="text-sm text-slate-600">Applications Processed</div>
                  </div>
                  <div className="h-12 w-px bg-slate-200"></div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">2.8 Days</div>
                    <div className="text-sm text-slate-600">Avg. Processing Time</div>
                  </div>
                  <div className="h-12 w-px bg-slate-200"></div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">94.7%</div>
                    <div className="text-sm text-slate-600">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-lg p-6 lg:p-8 fade-in delay-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-white">Application Dashboard</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setActiveTab('track')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      activeTab === 'track' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Track
                  </button>
                  <button 
                    onClick={() => setActiveTab('recent')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      activeTab === 'recent' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Recent
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-slate-800 rounded p-4 border-l-2 border-emerald-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400">#ESV-2026-00123</span>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded">Approved</span>
                  </div>
                  <div className="text-sm font-medium text-white mb-1">Income Certificate</div>
                  <div className="text-xs text-slate-400">District Office • Completed 2 hours ago</div>
                </div>
                
                <div className="bg-slate-800 rounded p-4 border-l-2 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400">#ESV-2026-00124</span>
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-medium rounded">In Review</span>
                  </div>
                  <div className="text-sm font-medium text-white mb-1">Birth Certificate</div>
                  <div className="text-xs text-slate-400">Tehsil Office • Processing</div>
                </div>
                
                <div className="bg-slate-800 rounded p-4 border-l-2 border-amber-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400">#ESV-2026-00125</span>
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-xs font-medium rounded">Pending</span>
                  </div>
                  <div className="text-sm font-medium text-white mb-1">Domicile Certificate</div>
                  <div className="text-xs text-slate-400">Gram Panchayat • Awaiting verification</div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Real-time synchronization</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span>Live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default HeroSection

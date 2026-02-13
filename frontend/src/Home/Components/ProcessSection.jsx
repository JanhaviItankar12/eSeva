import React from 'react'

const ProcessSection = () => {
  return (
    <section id="process" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 serif-font">Hierarchical Verification Process</h2>
              <p className="text-lg text-slate-300 mb-8">
                A transparent, three-tier verification system ensuring accuracy and accountability at every level of government administration.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Gram Panchayat Verification</h3>
                    <p className="text-sm text-slate-400">Initial document verification and preliminary approval at the village level</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Tehsil Office Review</h3>
                    <p className="text-sm text-slate-400">Secondary verification and detailed assessment at sub-district level</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">District Office Approval</h3>
                    <p className="text-sm text-slate-400">Final authorization and certificate generation at district headquarters</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-8">
              <h3 className="text-sm font-semibold text-slate-300 mb-6 uppercase tracking-wide">System Features</h3>
              
              <div className="space-y-6">
                <div className="border-l-2 border-blue-600 pl-4">
                  <h4 className="font-semibold text-white mb-1">Real-Time Tracking</h4>
                  <p className="text-sm text-slate-400">Monitor application status across all verification stages with instant updates</p>
                </div>
                
                <div className="border-l-2 border-slate-700 pl-4">
                  <h4 className="font-semibold text-white mb-1">Automated Notifications</h4>
                  <p className="text-sm text-slate-400">Receive alerts for approvals, corrections required, or rejections via SMS and email</p>
                </div>
                
                <div className="border-l-2 border-slate-700 pl-4">
                  <h4 className="font-semibold text-white mb-1">Analytics Dashboard</h4>
                  <p className="text-sm text-slate-400">Track processing delays, bottlenecks, and performance metrics at each level</p>
                </div>
                
                <div className="border-l-2 border-slate-700 pl-4">
                  <h4 className="font-semibold text-white mb-1">Role-Based Access</h4>
                  <p className="text-sm text-slate-400">Secure authentication and authorization for Gram, Tehsil, and District officials</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default ProcessSection
import React from 'react'

const ServicesSection = () => {

    const services = [
    { name: 'Birth Certificate', code: 'BC', applications: '5,234' },
    { name: 'Residence Certificate', code: 'RC', applications: '4,891' },
    { name: 'Income Certificate', code: 'IC', applications: '6,712' },
    { name: 'Caste Certificate', code: 'CC', applications: '3,445' },
    { name: 'Domicile Certificate', code: 'DC', applications: '4,123' }
  ];
  return (
    <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 serif-font">Certificate Services</h2>
            <p className="text-lg text-slate-600">
              Streamlined application process for essential government certificates with transparent tracking and verification.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div key={idx} className="group bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-6 transition-all hover:elevated-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-700 font-bold text-sm group-hover:bg-blue-700 group-hover:text-white transition-colors">
                    {service.code}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Applications</div>
                    <div className="text-lg font-bold text-slate-900">{service.applications}</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{service.name}</h3>
                <button className="text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors">
                  Apply Now →
                </button>
              </div>
            ))}
            
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <div className="text-slate-400 mb-3">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">More Services</h3>
              <p className="text-sm text-slate-500 mb-4">Additional certificates coming soon</p>
            </div>
          </div>
        </div>
      </section>
  )
}

export default ServicesSection

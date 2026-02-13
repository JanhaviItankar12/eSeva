import React from 'react'

const MetricesSection = () => {



  const metrics = [
    { label: 'Total Applications', value: '24,405', change: '+12.5%' },
    { label: 'Avg. Processing Time', value: '2.8 days', change: '-18%' },
    { label: 'Success Rate', value: '94.7%', change: '+3.2%' },
    { label: 'Active Districts', value: '12', change: '+2' }
  ];
  return (
    <section className="py-16 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, idx) => (
              <div key={idx} className="bg-white rounded p-6 subtle-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-sm font-medium text-slate-600">{metric.label}</div>
                  <span className={`text-xs font-medium ${
                    metric.change.startsWith('+') ? 'text-emerald-600' : 'text-blue-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-slate-900 serif-font">{metric.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default MetricesSection

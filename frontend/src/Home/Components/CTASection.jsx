import React from 'react'

const CTASection = () => {
  return (
    <section className="py-20 bg-blue-700">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 serif-font">
            Start Your Application Today
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of citizens benefiting from transparent, efficient certificate processing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-8 py-3 bg-white hover:bg-slate-100 text-blue-700 font-medium rounded transition-colors text-sm">
              Create Account
            </button>
            <button className="px-8 py-3 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded transition-colors text-sm">
              Download User Guide
            </button>
          </div>
        </div>
      </section>
  )
}

export default CTASection
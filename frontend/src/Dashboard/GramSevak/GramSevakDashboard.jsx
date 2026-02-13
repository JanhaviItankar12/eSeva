import { useState } from 'react';


export default function GramSevakDashboard() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('list');

  // All applications at Gram Sevak level with proper status flow
  const applications = [
    // BIRTH CERTIFICATES (Only Gram Sevak approval needed)
    {
      id: 'BC-2026-001',
      type: 'BIRTH',
      applicantName: 'Raj Kumar Sharma',
      childName: 'Aarav Sharma',
      dateOfBirth: '15 Jan 2026',
      appliedOn: '20 Jan 2026',
      currentStatus: 'AT_GRAM_SEVAK_VERIFICATION',
      priority: 'normal',
      documents: ['Birth Hospital Record', 'Parents Aadhaar', 'Address Proof'],
      hospital: 'District Hospital Jalgaon',
      parentContact: '9876543210',
      address: 'Shirpur Village, Jalgaon'
    },
    {
      id: 'BC-2026-002',
      type: 'BIRTH',
      applicantName: 'Sunita Devi Patil',
      childName: 'Divya Patil',
      dateOfBirth: '10 Jan 2026',
      appliedOn: '18 Jan 2026',
      currentStatus: 'AT_GRAM_SEVAK_VERIFICATION',
      priority: 'urgent',
      documents: ['Birth Hospital Record', 'Parents Aadhaar', 'Marriage Certificate'],
      hospital: 'Rural Primary Health Center',
      parentContact: '9123456789',
      address: 'Shirpur Village, Jalgaon'
    },
    {
      id: 'BC-2026-003',
      type: 'BIRTH',
      applicantName: 'Amit Kumar Yadav',
      childName: 'Riya Yadav',
      dateOfBirth: '05 Jan 2026',
      appliedOn: '25 Jan 2026',
      currentStatus: 'GRAMSEVAK_CORRECTION_REQUIRED',
      priority: 'normal',
      documents: ['Birth Hospital Record', 'Parents Aadhaar'],
      hospital: 'District Hospital Jalgaon',
      parentContact: '8765432109',
      address: 'Shirpur Village, Jalgaon',
      correctionNote: 'Address proof document missing'
    },
    {
      id: 'BC-2026-004',
      type: 'BIRTH',
      applicantName: 'Priya Mehta',
      childName: 'Krish Mehta',
      dateOfBirth: '28 Jan 2026',
      appliedOn: '29 Jan 2026',
      currentStatus: 'APPROVED',
      priority: 'normal',
      documents: ['Birth Hospital Record', 'Parents Aadhaar', 'Address Proof'],
      hospital: 'Private Nursing Home',
      parentContact: '7654321098',
      address: 'Shirpur Village, Jalgaon',
      approvedOn: '30 Jan 2026',
      certificateNumber: 'BC/2026/SHP/001'
    },

    // RESIDENCE CERTIFICATES (Gram Sevak → Sarpanch)
    {
      id: 'RC-2026-001',
      type: 'RESIDENCE',
      applicantName: 'Mohan Lal Verma',
      dateOfBirth: '12 Mar 1985',
      appliedOn: '22 Jan 2026',
      currentStatus: 'AT_GRAM_SEVAK_VERIFICATION',
      priority: 'normal',
      documents: ['Aadhaar Card', 'Ration Card', 'Electricity Bill', 'Property Tax Receipt'],
      parentContact: '9988776655',
      address: 'Plot No. 45, Shirpur Village',
      residingSince: '2010',
      purpose: 'Bank Loan Application'
    },
    {
      id: 'RC-2026-002',
      type: 'RESIDENCE',
      applicantName: 'Geeta Devi Singh',
      dateOfBirth: '05 Jul 1992',
      appliedOn: '20 Jan 2026',
      currentStatus: 'FORWARDED_TO_SARPANCH',
      priority: 'normal',
      documents: ['Aadhaar Card', 'Voter ID', 'Water Bill'],
      parentContact: '8877665544',
      address: 'House No. 12, Main Road, Shirpur',
      residingSince: '2015',
      purpose: 'College Admission',
      forwardedOn: '28 Jan 2026'
    },
    {
      id: 'RC-2026-003',
      type: 'RESIDENCE',
      applicantName: 'Rajesh Kumar Patil',
      dateOfBirth: '18 Sep 1988',
      appliedOn: '15 Jan 2026',
      currentStatus: 'SARPANCH_SENT_BACK_TO_GRAMSEVAK',
      priority: 'normal',
      documents: ['Aadhaar Card', 'Property Document'],
      parentContact: '7766554433',
      address: 'Ward No. 3, Shirpur',
      residingSince: '2012',
      purpose: 'Government Job Application',
      sarpanchNote: 'Need more residence proof - Add utility bills'
    },
    {
      id: 'RC-2026-004',
      type: 'RESIDENCE',
      applicantName: 'Anita Sharma',
      dateOfBirth: '22 Nov 1990',
      appliedOn: '18 Jan 2026',
      currentStatus: 'GRAMSEVAK_REVERIFYING',
      priority: 'urgent',
      documents: ['Aadhaar Card', 'Ration Card', 'Gas Connection Bill', 'School Certificate'],
      parentContact: '6655443322',
      address: 'Near Temple, Shirpur Village',
      residingSince: '2008',
      purpose: 'Scholarship Application',
      previousNote: 'Additional documents uploaded'
    },

    // INCOME CERTIFICATES (Gram Sevak → Tehsil Clerk → Tehsildar)
    {
      id: 'IC-2026-001',
      type: 'INCOME',
      applicantName: 'Suresh Kumar Yadav',
      dateOfBirth: '10 May 1980',
      appliedOn: '21 Jan 2026',
      currentStatus: 'AT_GRAM_SEVAK_VERIFICATION',
      priority: 'normal',
      documents: ['Aadhaar Card', 'Ration Card', 'Income Affidavit', 'Land Records', 'Bank Passbook'],
      parentContact: '9876123450',
      address: 'Agricultural Land, Shirpur',
      occupation: 'Farmer',
      annualIncome: '₹85,000',
      purpose: 'EWS Certificate for Housing Scheme'
    },
    {
      id: 'IC-2026-002',
      type: 'INCOME',
      applicantName: 'Kiran Devi Joshi',
      dateOfBirth: '25 Aug 1987',
      appliedOn: '19 Jan 2026',
      currentStatus: 'FORWARDED_TO_TEHSIL',
      priority: 'normal',
      documents: ['Aadhaar Card', 'Income Certificate from Employer', 'ITR', 'Salary Slips'],
      parentContact: '8765432198',
      address: 'House No. 78, Shirpur',
      occupation: 'Daily Wage Worker',
      annualIncome: '₹1,20,000',
      purpose: 'Children Education Scholarship',
      forwardedOn: '27 Jan 2026'
    },
    {
      id: 'IC-2026-003',
      type: 'INCOME',
      applicantName: 'Ramesh Chandra Mishra',
      dateOfBirth: '03 Feb 1975',
      appliedOn: '17 Jan 2026',
      currentStatus: 'GRAMSEVAK_CORRECTION_REQUIRED',
      priority: 'normal',
      documents: ['Aadhaar Card', 'Ration Card', 'Land Documents'],
      parentContact: '7654321987',
      address: 'Village Outskirts, Shirpur',
      occupation: 'Small Business Owner',
      annualIncome: '₹2,50,000',
      purpose: 'Business Loan',
      correctionNote: 'Income proof documents insufficient - Need business registration and tax documents'
    },

    // REJECTED APPLICATIONS
    {
      id: 'BC-2026-005',
      type: 'BIRTH',
      applicantName: 'Vijay Kumar Desai',
      childName: 'Aditya Desai',
      dateOfBirth: '10 Dec 2025',
      appliedOn: '15 Jan 2026',
      currentStatus: 'REJECTED',
      priority: 'normal',
      documents: ['Birth Hospital Record', 'Parents Aadhaar'],
      hospital: 'Unknown Clinic',
      parentContact: '9123456780',
      address: 'Temporary Address, Shirpur',
      rejectedOn: '26 Jan 2026',
      rejectionReason: 'Hospital record not verifiable. Birth certificate from unknown/unregistered medical facility.'
    },
    {
      id: 'RC-2026-005',
      type: 'RESIDENCE',
      applicantName: 'Sunil Rao',
      dateOfBirth: '14 Jun 1995',
      appliedOn: '12 Jan 2026',
      currentStatus: 'REJECTED',
      priority: 'normal',
      documents: ['Aadhaar Card'],
      parentContact: '8877665500',
      address: 'Rental Property, Shirpur',
      residingSince: '2024',
      purpose: 'Job Application',
      rejectedOn: '24 Jan 2026',
      rejectionReason: 'Insufficient residence proof. Applicant has been residing for less than 1 year, minimum requirement is 3 years for residence certificate.'
    },
    {
      id: 'IC-2026-004',
      type: 'INCOME',
      applicantName: 'Prakash Singh Chauhan',
      dateOfBirth: '20 Apr 1982',
      appliedOn: '10 Jan 2026',
      currentStatus: 'REJECTED',
      priority: 'normal',
      documents: ['Aadhaar Card', 'Bank Statement'],
      parentContact: '7766554411',
      address: 'New Settlement, Shirpur',
      occupation: 'Self-employed',
      annualIncome: '₹15,00,000',
      purpose: 'EWS Certificate',
      rejectedOn: '22 Jan 2026',
      rejectionReason: 'Income exceeds EWS category limit (₹8 lakhs per annum). Applicant does not qualify for EWS certificate.'
    }
  ];

  const stats = {
    pendingVerification: applications.filter(a => 
      a.currentStatus === 'AT_GRAM_SEVAK_VERIFICATION'
    ).length,
    waitingForCitizen: applications.filter(a => 
      a.currentStatus === 'GRAMSEVAK_CORRECTION_REQUIRED'
    ).length,
    sentBackBySenior: applications.filter(a => 
      a.currentStatus === 'SARPANCH_SENT_BACK_TO_GRAMSEVAK'
    ).length,
    reverifying: applications.filter(a => 
      a.currentStatus === 'GRAMSEVAK_REVERIFYING'
    ).length,
    forwarded: applications.filter(a => 
      a.currentStatus === 'FORWARDED_TO_SARPANCH' || 
      a.currentStatus === 'FORWARDED_TO_TEHSIL'
    ).length,
    approved: applications.filter(a => 
      a.currentStatus === 'APPROVED'
    ).length,
    rejected: applications.filter(a => 
      a.currentStatus === 'REJECTED'
    ).length,
    total: applications.length
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'AT_GRAM_SEVAK_VERIFICATION': { 
        label: 'Pending Verification', 
        color: 'bg-amber-100 text-amber-700',
        icon: '⏳'
      },
      'GRAMSEVAK_CORRECTION_REQUIRED': { 
        label: 'Correction Required', 
        color: 'bg-red-100 text-red-700',
        icon: '⚠️'
      },
      'FORWARDED_TO_SARPANCH': { 
        label: 'Forwarded to Sarpanch', 
        color: 'bg-blue-100 text-blue-700',
        icon: '➡️'
      },
      'SARPANCH_SENT_BACK_TO_GRAMSEVAK': { 
        label: 'Sent Back by Sarpanch', 
        color: 'bg-orange-100 text-orange-700',
        icon: '↩️'
      },
      'GRAMSEVAK_REVERIFYING': { 
        label: 'Re-verifying', 
        color: 'bg-purple-100 text-purple-700',
        icon: '🔄'
      },
      'FORWARDED_TO_TEHSIL': { 
        label: 'Forwarded to Tehsil', 
        color: 'bg-indigo-100 text-indigo-700',
        icon: '➡️'
      },
      'APPROVED': { 
        label: 'Approved', 
        color: 'bg-emerald-100 text-emerald-700',
        icon: '✅'
      },
      'REJECTED': { 
        label: 'Rejected', 
        color: 'bg-slate-100 text-slate-700',
        icon: '❌'
      }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700', icon: '•' };
  };

  const getCertificateTypeInfo = (type) => {
    const typeMap = {
      'BIRTH': { label: 'Birth Certificate', color: 'bg-pink-50 text-pink-700', icon: '👶' },
      'RESIDENCE': { label: 'Residence Certificate', color: 'bg-blue-50 text-blue-700', icon: '🏠' },
      'INCOME': { label: 'Income Certificate', color: 'bg-green-50 text-green-700', icon: '💰' }
    };
    return typeMap[type] || { label: type, color: 'bg-gray-50 text-gray-700', icon: '📄' };
  };

  const handleApprove = (app) => {
    if (app.type === 'BIRTH') {
      // Birth certificate can be approved directly by Gram Sevak
      console.log('Approved:', app.id);
      alert(`Birth Certificate ${app.id} approved and issued successfully!`);
    } else if (app.type === 'RESIDENCE') {
      // Residence needs to be forwarded to Sarpanch
      console.log('Forwarding to Sarpanch:', app.id);
      alert(`Application ${app.id} verified and forwarded to Sarpanch for final approval.`);
    } else if (app.type === 'INCOME') {
      // Income needs to be forwarded to Tehsil
      console.log('Forwarding to Tehsil:', app.id);
      alert(`Application ${app.id} verified and forwarded to Tehsil Office for further processing.`);
    }
  };

  const handleReject = (appId) => {
    const reason = prompt('Please enter reason for rejection:');
    if (reason) {
      console.log('Rejected:', appId, 'Reason:', reason);
      alert(`Application ${appId} rejected.`);
    }
  };

  const handleCorrection = (appId) => {
    const corrections = prompt('Please provide details of required corrections:');
    if (corrections) {
      console.log('Sent for correction:', appId, 'Details:', corrections);
      alert(`Correction request sent to applicant.`);
    }
  };

  const filteredApps = applications.filter(app => {
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'pending' && app.currentStatus === 'AT_GRAM_SEVAK_VERIFICATION') ||
      (filterStatus === 'sentback' && app.currentStatus === 'SARPANCH_SENT_BACK_TO_GRAMSEVAK') ||
      (filterStatus === 'reverifying' && app.currentStatus === 'GRAMSEVAK_REVERIFYING') ||
      (filterStatus === 'waiting' && app.currentStatus === 'GRAMSEVAK_CORRECTION_REQUIRED') ||
      (filterStatus === 'forwarded' && (app.currentStatus === 'FORWARDED_TO_SARPANCH' || app.currentStatus === 'FORWARDED_TO_TEHSIL')) ||
      (filterStatus === 'approved' && app.currentStatus === 'APPROVED') ||
      (filterStatus === 'rejected' && app.currentStatus === 'REJECTED');
    
    const typeMatch = filterType === 'all' || app.type === filterType;
    
    return statusMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .slide-down {
          animation: slideDown 0.3s ease-out;
        }
        
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }
      `}</style>

      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-700 rounded flex items-center justify-center text-white font-bold">
                GS
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Gram Sevak Workspace</h1>
                <p className="text-sm text-slate-600">Gram Panchayat - Shirpur</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">Ramesh Kumar Patil</p>
                <p className="text-xs text-slate-500">Gram Sevak</p>
              </div>
              <button className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded flex items-center justify-center transition-colors relative">
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-slate-200 min-h-screen p-4">
          <nav className="space-y-2">
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-2">Certificate Types</p>
              <button 
                onClick={() => setFilterType('all')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
                  filterType === 'all' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>All Applications</span>
                <span className="text-xs">{applications.length}</span>
              </button>
            </div>

            <button 
              onClick={() => setFilterType('BIRTH')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                filterType === 'BIRTH' ? 'bg-pink-50 text-pink-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-lg">👶</span>
              <span className="flex-1 text-left">Birth Certificates</span>
              <span className="text-xs">{applications.filter(a => a.type === 'BIRTH').length}</span>
            </button>
            
            <button 
              onClick={() => setFilterType('RESIDENCE')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                filterType === 'RESIDENCE' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-lg">🏠</span>
              <span className="flex-1 text-left">Residence Certificates</span>
              <span className="text-xs">{applications.filter(a => a.type === 'RESIDENCE').length}</span>
            </button>

            <button 
              onClick={() => setFilterType('INCOME')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                filterType === 'INCOME' ? 'bg-green-50 text-green-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-lg">💰</span>
              <span className="flex-1 text-left">Income Certificates</span>
              <span className="text-xs">{applications.filter(a => a.type === 'INCOME').length}</span>
            </button>

            <div className="pt-4 mt-4 border-t border-slate-200">
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Reports</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </a>
            </div>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-7 gap-3 mb-6">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">Pending</span>
                <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{stats.pendingVerification}</div>
              <div className="text-xs text-slate-500 mt-1">Action needed</div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">Sent Back</span>
                <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{stats.sentBackBySenior}</div>
              <div className="text-xs text-slate-500 mt-1">By senior</div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">Re-verifying</span>
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{stats.reverifying}</div>
              <div className="text-xs text-slate-500 mt-1">After fixes</div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">With Citizen</span>
                <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{stats.waitingForCitizen}</div>
              <div className="text-xs text-slate-500 mt-1">Waiting</div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">Forwarded</span>
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{stats.forwarded}</div>
              <div className="text-xs text-slate-500 mt-1">To senior</div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">Approved</span>
                <div className="w-8 h-8 bg-emerald-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{stats.approved}</div>
              <div className="text-xs text-slate-500 mt-1">Complete</div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">Rejected</span>
                <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{stats.rejected}</div>
              <div className="text-xs text-slate-500 mt-1">Denied</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center space-x-3 flex-wrap gap-2">
                <h2 className="text-lg font-bold text-slate-900">Applications</h2>
                <div className="flex space-x-2 flex-wrap">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      filterStatus === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus('pending')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      filterStatus === 'pending' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    Pending ({stats.pendingVerification})
                  </button>
                  <button
                    onClick={() => setFilterStatus('sentback')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      filterStatus === 'sentback' ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                    }`}
                  >
                    Sent Back ({stats.sentBackBySenior})
                  </button>
                  <button
                    onClick={() => setFilterStatus('reverifying')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      filterStatus === 'reverifying' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    Re-verifying ({stats.reverifying})
                  </button>
                  <button
                    onClick={() => setFilterStatus('waiting')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      filterStatus === 'waiting' ? 'bg-yellow-600 text-white' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                    }`}
                  >
                    With Citizen ({stats.waitingForCitizen})
                  </button>
                  <button
                    onClick={() => setFilterStatus('forwarded')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      filterStatus === 'forwarded' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    Forwarded ({stats.forwarded})
                  </button>
                  <button
                    onClick={() => setFilterStatus('approved')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      filterStatus === 'approved' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    Approved ({stats.approved})
                  </button>
                  <button
                    onClick={() => setFilterStatus('rejected')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      filterStatus === 'rejected' ? 'bg-slate-600 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Rejected ({stats.rejected})
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-3">
            {filteredApps.map((app) => {
              const statusInfo = getStatusInfo(app.currentStatus);
              const typeInfo = getCertificateTypeInfo(app.type);
              
              return (
                <div key={app.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{app.id}</span>
                          <span className={`status-badge ${typeInfo.color}`}>
                            {typeInfo.icon} {typeInfo.label}
                          </span>
                          {app.priority === 'urgent' && (
                            <span className="status-badge bg-red-100 text-red-700">
                              🚨 Urgent
                            </span>
                          )}
                          <span className={`status-badge ${statusInfo.color}`}>
                            {statusInfo.icon} {statusInfo.label}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                          {app.childName || app.applicantName}
                        </h3>
                        {app.childName && (
                          <p className="text-sm text-slate-600">Applicant: {app.applicantName}</p>
                        )}
                        
                        <div className="grid grid-cols-4 gap-4 mt-3 pt-3 border-t border-slate-100">
                          {app.type === 'BIRTH' && (
                            <>
                              <div>
                                <p className="text-xs text-slate-500">Date of Birth</p>
                                <p className="text-sm font-medium text-slate-900">{app.dateOfBirth}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Hospital</p>
                                <p className="text-sm font-medium text-slate-900">{app.hospital}</p>
                              </div>
                            </>
                          )}
                          {app.type === 'RESIDENCE' && (
                            <>
                              <div>
                                <p className="text-xs text-slate-500">Residing Since</p>
                                <p className="text-sm font-medium text-slate-900">{app.residingSince}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Purpose</p>
                                <p className="text-sm font-medium text-slate-900">{app.purpose}</p>
                              </div>
                            </>
                          )}
                          {app.type === 'INCOME' && (
                            <>
                              <div>
                                <p className="text-xs text-slate-500">Occupation</p>
                                <p className="text-sm font-medium text-slate-900">{app.occupation}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Annual Income</p>
                                <p className="text-sm font-medium text-slate-900">{app.annualIncome}</p>
                              </div>
                            </>
                          )}
                          <div>
                            <p className="text-xs text-slate-500">Applied On</p>
                            <p className="text-sm font-medium text-slate-900">{app.appliedOn}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Contact</p>
                            <p className="text-sm font-medium text-slate-900">{app.parentContact}</p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedApp(selectedApp === app.id ? null : app.id)}
                        className="ml-4 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      >
                        {selectedApp === app.id ? 'Close' : 'Review'}
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {selectedApp === app.id && (
                      <div className="mt-4 pt-4 border-t border-slate-200 slide-down">
                        {/* Show correction/sent back notes if present */}
                        {(app.correctionNote || app.sarpanchNote || app.previousNote) && (
                          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <h4 className="text-sm font-semibold text-orange-900 mb-2">
                              {app.currentStatus === 'GRAMSEVAK_CORRECTION_REQUIRED' ? '⚠️ Waiting for Citizen' : '↩️ Sent Back by Senior'}
                            </h4>
                            <p className="text-sm text-orange-800">
                              {app.correctionNote || app.sarpanchNote || app.previousNote}
                            </p>
                            {app.currentStatus === 'GRAMSEVAK_CORRECTION_REQUIRED' && (
                              <p className="text-xs text-orange-600 mt-2">
                                📋 Application is with the citizen for corrections. No action needed until they resubmit.
                              </p>
                            )}
                          </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-3">Documents Attached</h4>
                            <div className="space-y-2">
                              {app.documents.map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                                  <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm font-medium text-slate-700">{doc}</span>
                                  </div>
                                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                    View
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-3">Application Details</h4>
                            <div className="space-y-3">
                              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                                <p className="text-xs text-slate-500 mb-1">Full Address</p>
                                <p className="text-sm font-medium text-slate-900">{app.address}</p>
                              </div>
                              {app.type === 'INCOME' && (
                                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                                  <p className="text-xs text-slate-500 mb-1">Purpose</p>
                                  <p className="text-sm font-medium text-slate-900">{app.purpose}</p>
                                </div>
                              )}
                              {app.forwardedOn && (
                                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                                  <p className="text-xs text-blue-600 mb-1">Forwarded On</p>
                                  <p className="text-sm font-medium text-blue-900">{app.forwardedOn}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {(app.currentStatus === 'AT_GRAM_SEVAK_VERIFICATION' || 
                          app.currentStatus === 'GRAMSEVAK_REVERIFYING' ||
                          app.currentStatus === 'SARPANCH_SENT_BACK_TO_GRAMSEVAK') && (
                          <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-slate-200">
                            <button
                              onClick={() => handleReject(app.id)}
                              className="px-5 py-2 bg-red-50 text-red-700 font-medium rounded hover:bg-red-100 transition-colors text-sm"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleCorrection(app.id)}
                              className="px-5 py-2 bg-orange-50 text-orange-700 font-medium rounded hover:bg-orange-100 transition-colors text-sm"
                            >
                              Request Correction
                            </button>
                            <button
                              onClick={() => handleApprove(app)}
                              className="px-6 py-2 bg-emerald-600 text-white font-medium rounded hover:bg-emerald-700 transition-colors text-sm"
                            >
                              {app.type === 'BIRTH' ? 'Approve & Issue Certificate' : 
                               app.type === 'RESIDENCE' ? 'Verify & Forward to Sarpanch' : 
                               'Verify & Forward to Tehsil'}
                            </button>
                          </div>
                        )}

                        {/* Show waiting message for applications with citizen */}
                        {app.currentStatus === 'GRAMSEVAK_CORRECTION_REQUIRED' && (
                          <div className="flex items-center justify-center space-x-2 mt-6 pt-4 border-t border-slate-200 p-4 bg-yellow-50 rounded">
                            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-yellow-800 font-medium">
                              Waiting for citizen to upload corrected documents
                            </p>
                          </div>
                        )}

                        {app.currentStatus === 'APPROVED' && (
                          <div className="mt-6 pt-4 border-t border-slate-200">
                            <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded">
                              <div className="flex items-center space-x-3">
                                <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                  <p className="text-sm font-semibold text-emerald-900">Certificate Issued</p>
                                  <p className="text-xs text-emerald-700">
                                    {app.certificateNumber && `Certificate No: ${app.certificateNumber} • `}
                                    Approved on {app.approvedOn}
                                  </p>
                                </div>
                              </div>
                              <button className="px-4 py-2 bg-white text-emerald-700 font-medium rounded border border-emerald-300 hover:bg-emerald-50 transition-colors text-sm">
                                View Certificate
                              </button>
                            </div>
                          </div>
                        )}

                        {(app.currentStatus === 'FORWARDED_TO_SARPANCH' || app.currentStatus === 'FORWARDED_TO_TEHSIL') && (
                          <div className="mt-6 pt-4 border-t border-slate-200">
                            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded">
                              <div className="flex items-center space-x-3">
                                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                <div>
                                  <p className="text-sm font-semibold text-blue-900">Application Forwarded</p>
                                  <p className="text-xs text-blue-700">
                                    Forwarded to {app.currentStatus === 'FORWARDED_TO_SARPANCH' ? 'Sarpanch' : 'Tehsil Office'} on {app.forwardedOn}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {app.currentStatus === 'REJECTED' && (
                          <div className="mt-6 pt-4 border-t border-slate-200">
                            <div className="p-4 bg-slate-50 border border-slate-300 rounded">
                              <div className="flex items-start space-x-3">
                                <svg className="w-6 h-6 text-slate-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-slate-900 mb-1">Application Rejected</p>
                                  <p className="text-xs text-slate-600 mb-2">Rejected on {app.rejectedOn}</p>
                                  <div className="p-3 bg-white border border-slate-200 rounded">
                                    <p className="text-xs font-medium text-slate-700 mb-1">Reason for Rejection:</p>
                                    <p className="text-sm text-slate-900">{app.rejectionReason}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredApps.length === 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Applications Found</h3>
              <p className="text-slate-600">There are no applications matching your filters at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

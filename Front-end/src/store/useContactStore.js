import { create } from 'zustand';

export const useContactStore = create((set) => ({
  requests: [
    {
      id: 'CON-101',
      name: 'Alice Smith',
      email: 'alice@gmail.com',
      phone: '+919988776611',
      contactMethod: 'Email',
      subject: 'Do you deliver to Koramangala?',
      category: 'General Inquiry',
      description: 'Just wanted to verify if your tankers cover Koramangala 4th block for residential fuel drops.',
      date: '2026-06-16',
      status: 'New',
      leadPriority: 'Low',
      leadSource: 'Website Contact Form'
    },
    {
      id: 'CON-102',
      name: 'Rajesh Khanna',
      email: 'rajesh@reliancepetro.com',
      phone: '+919988776655',
      contactMethod: 'Phone',
      subject: 'Retail Bunk Partnership Proposal',
      category: 'Petrol Bunk Collaboration',
      description: 'We own 4 retail stations in South Bangalore HSR layout and want to collaborate as reload fuel depots for your fleet tankers.',
      companyName: 'Reliance Petro',
      businessType: 'Petrol Bunk',
      companyWebsite: 'https://reliancepetro.com',
      serviceRegion: 'Bangalore South',
      date: '2026-06-15',
      status: 'In Review',
      leadPriority: 'High',
      leadSource: 'Collaboration Request'
    },
    {
      id: 'CON-103',
      name: 'David Miller',
      email: 'david@vccapital.com',
      phone: '+1415998877',
      contactMethod: 'Email',
      subject: 'Series A funding interest',
      category: 'Business Proposal',
      description: 'Interested in discussing a strategic Series A VC investment round for scaling operations to Mumbai and Chennai.',
      companyName: 'VC Capital',
      businessType: 'Investor',
      companyWebsite: 'https://vccapital.com',
      serviceRegion: 'National',
      date: '2026-06-14',
      status: 'New',
      leadPriority: 'Critical',
      leadSource: 'Business Proposal'
    }
  ],

  addRequest: (request) => {
    // Automatically calculate Lead Priority and Lead Source based on Category
    let priority = 'Medium';
    if (['Partnership Request', 'Petrol Bunk Collaboration'].includes(request.category)) {
      priority = 'High';
    } else if (request.category === 'Business Proposal') {
      priority = 'Critical';
    } else if (request.category === 'Suggestion') {
      priority = 'Low';
    }

    let source = 'Website Contact Form';
    if (['Partnership Request', 'Petrol Bunk Collaboration'].includes(request.category)) {
      source = 'Collaboration Request';
    } else if (request.category === 'Business Proposal') {
      source = 'Business Proposal';
    }

    const newRequest = {
      id: 'CON-' + Math.floor(100 + Math.random() * 900),
      date: new Date().toISOString().split('T')[0],
      status: 'New',
      leadPriority: priority,
      leadSource: source,
      ...request
    };

    set((state) => ({
      requests: [newRequest, ...state.requests]
    }));
    return newRequest;
  },

  updateRequestStatus: (id, status) => {
    set((state) => ({
      requests: state.requests.map((r) => r.id === id ? { ...r, status } : r)
    }));
  },

  deleteRequest: (id) => {
    set((state) => ({
      requests: state.requests.filter((r) => r.id !== id)
    }));
  }
}));

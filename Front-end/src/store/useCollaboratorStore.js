import { create } from 'zustand';

export const useCollaboratorStore = create((set) => ({
  bunks: [
    {
      id: 1,
      name: 'HP Fuel Station - Koramangala',
      contact: 'Ramesh Kumar',
      phone: '+919876543001',
      email: 'hp.koramangala@hpcl.co.in',
      address: '80 Feet Rd, Koramangala 4th Block, Bangalore',
      serviceArea: 'Bangalore South',
      status: 'Active Partner', // Prospect, Active Partner, Suspended, Inactive
      stocks: { petrol: '14,200 Liters', diesel: '12,500 Liters', premiumPetrol: '8,400 Liters' },
      assignedDrivers: [
        { id: 'RF-928', name: 'Marcus Vance', task: 'Emergency Refueling' },
        { id: 'RF-774', name: 'Peter Parker', task: 'Idle' }
      ],
      stats: { deliveries: 342, purchased: '45,800 Gal', avgTime: '14 mins' },
      notes: 'Key partner station. Contract expires December 2026. High reliability rating.',
      contractDate: '2026-12-15',
      petrolPrice: '$3.45',
      dieselPrice: '$3.10',
      premiumPrice: '$4.15',
      priceLastUpdated: '2026-06-16 12:00'
    },
    {
      id: 2,
      name: 'Shell Petrol Station - HSR Layout',
      contact: 'Anjali Sharma',
      phone: '+919876543002',
      email: 'hsr.station@shell.in',
      address: 'Outer Ring Rd, HSR Layout Sector 3, Bangalore',
      serviceArea: 'Bangalore South',
      status: 'Active Partner',
      stocks: { petrol: '18,500 Liters', diesel: '16,200 Liters', premiumPetrol: '11,000 Liters' },
      assignedDrivers: [
        { id: 'RF-312', name: 'Diana Prince', task: 'Specialized Towing' }
      ],
      stats: { deliveries: 512, purchased: '62,400 Gal', avgTime: '12 mins' },
      notes: 'Premium fuels hub. Contract expires March 2027.',
      contractDate: '2027-03-20',
      petrolPrice: '$3.55',
      dieselPrice: '$3.20',
      premiumPrice: '$4.25',
      priceLastUpdated: '2026-06-16 11:30'
    },
    {
      id: 3,
      name: 'IOCL Station - MG Road',
      contact: 'Sanjay Dutt',
      phone: '+919876543003',
      email: 'iocl.mgroad@iocl.com',
      address: 'MG Road, near Trinity Metro, Bangalore',
      serviceArea: 'Bangalore Central',
      status: 'Suspended',
      stocks: { petrol: '0 Liters (Locked)', diesel: '0 Liters', premiumPetrol: '0 Liters' },
      assignedDrivers: [],
      stats: { deliveries: 128, purchased: '14,200 Gal', avgTime: '22 mins' },
      notes: 'Partnership suspended due to flow meter calibration discrepancy check.',
      contractDate: '2026-08-30',
      petrolPrice: '$3.40',
      dieselPrice: '$3.05',
      premiumPrice: '$4.05',
      priceLastUpdated: '2026-06-16 14:15'
    }
  ],

  addCollaborator: (bunk) => {
    const newBunk = {
      id: Date.now(),
      stocks: { petrol: '10,000 Liters', diesel: '10,000 Liters', premiumPetrol: '5,000 Liters' },
      assignedDrivers: [],
      stats: { deliveries: 0, purchased: '0 Gal', avgTime: 'N/A' },
      petrolPrice: '$3.50',
      dieselPrice: '$3.15',
      premiumPrice: '$4.20',
      priceLastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ...bunk
    };
    set((state) => ({
      bunks: [...state.bunks, newBunk]
    }));
    return newBunk;
  },

  updateCollaborator: (id, updatedData) => {
    set((state) => ({
      bunks: state.bunks.map((b) => b.id === id ? { ...b, ...updatedData } : b)
    }));
  },

  deleteCollaborator: (id) => {
    set((state) => ({
      bunks: state.bunks.filter((b) => b.id !== id)
    }));
  },

  convertFromLead: (lead) => {
    const newBunk = {
      id: Date.now(),
      name: lead.companyName || (lead.name + ' Petrol Station'),
      contact: lead.name,
      phone: lead.phone || '+919988776600',
      email: lead.email,
      address: lead.serviceRegion || 'Indiranagar, Bangalore',
      serviceArea: lead.serviceRegion || 'Bangalore South',
      status: 'Prospect',
      stocks: { petrol: '10,000 Liters', diesel: '10,000 Liters', premiumPetrol: '5,000 Liters' },
      assignedDrivers: [],
      stats: { deliveries: 0, purchased: '0 Gal', avgTime: 'N/A' },
      notes: `Converted from partnership proposal. Business sector: ${lead.businessType || 'Other'}. Proposal summary: ${lead.description}`,
      contractDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year contract
      petrolPrice: '$3.50',
      dieselPrice: '$3.15',
      premiumPrice: '$4.20',
      priceLastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    set((state) => ({
      bunks: [...state.bunks, newBunk]
    }));
    return newBunk;
  }
}));

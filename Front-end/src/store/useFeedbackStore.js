import { create } from 'zustand';

export const useFeedbackStore = create((set, get) => ({
  feedbacks: [
    {
      id: 'FB-101',
      orderId: 'NX-28941-F',
      customerId: 'usr_alex',
      customerName: 'Alex Mercer',
      providerId: 'RF-928',
      providerName: 'Marcus Vance',
      rating: 5,
      category: 'Delivery Speed',
      quality: 'Excellent',
      behaviour: 'Professional',
      experience: 'Very Fast',
      recommend: 'Yes',
      contactPermission: true,
      comment: 'Marcus arrived extremely quickly and helped refuel the car with absolute professionalism.',
      date: '2026-06-16',
      status: 'New'
    },
    {
      id: 'FB-102',
      orderId: 'NX-10294-A',
      customerId: 'usr_sarah',
      customerName: 'Sarah Connor',
      providerId: 'RF-312',
      providerName: 'Diana Prince',
      rating: 4,
      category: 'Service Quality',
      quality: 'Good',
      behaviour: 'Friendly',
      experience: 'On Time',
      recommend: 'Yes',
      contactPermission: false,
      comment: 'Very pleasant experience. The fuel pump process was fast and clean.',
      date: '2026-06-15',
      status: 'Reviewed'
    },
    {
      id: 'FB-103',
      orderId: 'NX-08172-B',
      customerId: 'usr_clark',
      customerName: 'Clark Kent',
      providerId: 'RF-928',
      providerName: 'Marcus Vance',
      rating: 2,
      category: 'Fuel Quality',
      quality: 'Poor',
      behaviour: 'Average',
      experience: 'Delayed',
      recommend: 'No',
      contactPermission: true,
      comment: 'The tanker was delayed by over 45 minutes and the driver was not apologetic.',
      date: '2026-06-14',
      status: 'Escalated'
    },
    {
      id: 'FB-104',
      orderId: 'NX-88273-K',
      customerId: 'usr_bruce',
      customerName: 'Bruce Wayne',
      providerId: 'RF-774',
      providerName: 'Peter Parker',
      rating: 5,
      category: 'Overall Experience',
      quality: 'Excellent',
      behaviour: 'Professional',
      experience: 'Very Fast',
      recommend: 'Yes',
      contactPermission: false,
      comment: 'Extremely fast response time, driver Peter Parker was highly skilled.',
      date: '2026-06-13',
      status: 'Resolved'
    }
  ],

  addFeedback: (feedback) => {
    const newFeedback = {
      id: 'FB-' + Math.floor(100 + Math.random() * 900),
      date: new Date().toISOString().split('T')[0],
      status: feedback.rating <= 2 ? 'Escalated' : 'New',
      ...feedback
    };
    set((state) => ({
      feedbacks: [newFeedback, ...state.feedbacks]
    }));
    return newFeedback;
  },

  updateFeedbackStatus: (id, status) => {
    set((state) => ({
      feedbacks: state.feedbacks.map((f) => f.id === id ? { ...f, status } : f)
    }));
  },

  archiveFeedback: (id) => {
    set((state) => ({
      feedbacks: state.feedbacks.map((f) => f.id === id ? { ...f, status: 'Resolved' } : f) // Resolve is archival equivalent
    }));
  }
}));

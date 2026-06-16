import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('nexfuel_user')) || null,
  token: localStorage.getItem('nexfuel_token') || null,
  isAuthenticated: !!localStorage.getItem('nexfuel_token'),
  role: localStorage.getItem('nexfuel_role') || null, // 'customer', 'responder', 'admin'
  loading: false,
  error: null,

  login: async (email, password, role = 'customer') => {
    set({ loading: true, error: null });
    try {
      // Temporary frontend mock login
      // In real backend integration, this will hit Node/Express JWT login endpoint
      const mockUser = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        name: role === 'admin' ? 'Operations Admin' : role === 'responder' ? 'Dispatch Rider John' : 'Alex Mercer',
        email,
        role,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${role}`,
      };

      const mockToken = 'mock_jwt_token_for_' + mockUser.id;

      localStorage.setItem('nexfuel_user', JSON.stringify(mockUser));
      localStorage.setItem('nexfuel_token', mockToken);
      localStorage.setItem('nexfuel_role', role);

      set({
        user: mockUser,
        token: mockToken,
        role,
        isAuthenticated: true,
        loading: false,
      });
      return mockUser;
    } catch (err) {
      set({ error: err.message || 'Login failed', loading: false });
      throw err;
    }
  },

  register: async (name, email, password, role = 'customer') => {
    set({ loading: true, error: null });
    try {
      // Mock Register
      const mockUser = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${role}`,
      };
      
      const mockToken = 'mock_jwt_token_for_' + mockUser.id;

      localStorage.setItem('nexfuel_user', JSON.stringify(mockUser));
      localStorage.setItem('nexfuel_token', mockToken);
      localStorage.setItem('nexfuel_role', role);

      set({
        user: mockUser,
        token: mockToken,
        role,
        isAuthenticated: true,
        loading: false,
      });
      return mockUser;
    } catch (err) {
      set({ error: err.message || 'Registration failed', loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('nexfuel_user');
    localStorage.removeItem('nexfuel_token');
    localStorage.removeItem('nexfuel_role');
    set({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      error: null,
    });
  },

  updateProfile: (updatedData) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...updatedData };
      localStorage.setItem('nexfuel_user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },
}));

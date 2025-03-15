// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock Expo Vector Icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: View,
  };
});

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
    useIsFocused: () => true,
  };
});

// Mock Redux hooks
jest.mock('../store', () => ({
  useAppDispatch: jest.fn(() => jest.fn()),
  useAppSelector: jest.fn((selector) => {
    // Default mock state
    const mockState = {
      auth: {
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      },
      theme: {
        mode: 'light',
        theme: {
          colors: {
            primary: '#007AFF',
            secondary: '#5856D6',
            background: '#F2F2F7',
            surface: '#FFFFFF',
            error: '#FF3B30',
            text: '#000000',
            disabled: '#C7C7CC',
            placeholder: '#8E8E93',
            backdrop: 'rgba(0, 0, 0, 0.5)',
            notification: '#FF3B30',
          },
        },
      },
    };
    return selector(mockState);
  }),
}));

// Mock Axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  })),
  defaults: {
    baseURL: '',
    headers: {
      common: {},
    },
  },
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
})); 
import { authService } from '../authService';
import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock the API and AsyncStorage
jest.mock('../api', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
}));

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user and store tokens', async () => {
      const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
      const mockResponse = {
        data: {
          user: mockUser,
          token: 'test-token',
          refresh_token: 'test-refresh-token',
        },
      };

      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const registerData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.register(registerData);

      expect(api.post).toHaveBeenCalledWith('/auth/register', registerData);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('auth_token', 'test-token');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('refresh_token', 'test-refresh-token');
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error if registration fails', async () => {
      const errorMessage = 'Registration failed';
      (api.post as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const registerData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(authService.register(registerData)).rejects.toThrow(errorMessage);
    });
  });

  describe('login', () => {
    it('should login a user and store tokens', async () => {
      const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
      const mockResponse = {
        data: {
          user: mockUser,
          token: 'test-token',
          refresh_token: 'test-refresh-token',
        },
      };

      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.login(loginData);

      expect(api.post).toHaveBeenCalledWith('/auth/login', loginData);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('auth_token', 'test-token');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('refresh_token', 'test-refresh-token');
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error if login fails', async () => {
      const errorMessage = 'Login failed';
      (api.post as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(authService.login(loginData)).rejects.toThrow(errorMessage);
    });
  });

  describe('logout', () => {
    it('should call logout endpoint and remove tokens', async () => {
      (api.post as jest.Mock).mockResolvedValue({});

      await authService.logout();

      expect(api.post).toHaveBeenCalledWith('/auth/logout');
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['auth_token', 'refresh_token']);
    });

    it('should still remove tokens if logout endpoint fails', async () => {
      (api.post as jest.Mock).mockRejectedValue(new Error('Logout failed'));

      await authService.logout();

      expect(api.post).toHaveBeenCalledWith('/auth/logout');
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['auth_token', 'refresh_token']);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('test-token');

      const result = await authService.isAuthenticated();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('auth_token');
      expect(result).toBe(true);
    });

    it('should return false if token does not exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await authService.isAuthenticated();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith('auth_token');
      expect(result).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should fetch current user profile', async () => {
      const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
      (api.get as jest.Mock).mockResolvedValue({ data: mockUser });

      const result = await authService.getCurrentUser();

      expect(api.get).toHaveBeenCalledWith('/users/me');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const mockUser = { id: '1', name: 'Updated User', email: 'test@example.com' };
      (api.put as jest.Mock).mockResolvedValue({ data: mockUser });

      const updateData = { name: 'Updated User' };
      const result = await authService.updateProfile(updateData);

      expect(api.put).toHaveBeenCalledWith('/users/me', updateData);
      expect(result).toEqual(mockUser);
    });
  });

  describe('changePassword', () => {
    it('should change user password', async () => {
      (api.put as jest.Mock).mockResolvedValue({});

      await authService.changePassword('oldPassword', 'newPassword');

      expect(api.put).toHaveBeenCalledWith('/auth/password', {
        oldPassword: 'oldPassword',
        newPassword: 'newPassword',
      });
    });
  });
}); 
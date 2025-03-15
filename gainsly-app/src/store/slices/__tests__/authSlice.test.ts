import authReducer, {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  updateUser,
  updateToken,
} from '../authSlice';
import { User } from '../../../types';

describe('Auth Slice', () => {
  const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle loginStart', () => {
    const nextState = authReducer(initialState, loginStart());
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBe(null);
  });

  it('should handle loginSuccess', () => {
    const user: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    };
    const token = 'test-token';

    const nextState = authReducer(initialState, loginSuccess({ user, token }));
    
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.user).toEqual(user);
    expect(nextState.token).toBe(token);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(null);
  });

  it('should handle loginFailure', () => {
    const error = 'Authentication failed';
    const nextState = authReducer(initialState, loginFailure(error));
    
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe(error);
  });

  it('should handle logout', () => {
    // Start with a logged-in state
    const loggedInState = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      token: 'test-token',
      refreshToken: 'test-refresh-token',
      loading: false,
      error: null,
    };

    const nextState = authReducer(loggedInState, logout());
    
    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.user).toBe(null);
    expect(nextState.token).toBe(null);
    expect(nextState.refreshToken).toBe(null);
  });

  it('should handle updateUser', () => {
    // Start with a logged-in state
    const loggedInState = {
      isAuthenticated: true,
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      token: 'test-token',
      refreshToken: 'test-refresh-token',
      loading: false,
      error: null,
    };

    const updatedUserData = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    const nextState = authReducer(loggedInState, updateUser(updatedUserData));
    
    expect(nextState.user).toEqual({
      id: '1',
      email: 'updated@example.com',
      name: 'Updated Name',
    });
  });

  it('should not update user if user is null', () => {
    const nextState = authReducer(initialState, updateUser({ name: 'New Name' }));
    expect(nextState.user).toBe(null);
  });
}); 
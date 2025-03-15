import themeReducer, { setThemeMode, setTheme } from '../themeSlice';
import { lightTheme, darkTheme, Theme } from '../../../styles/theme';

interface ThemeState {
  mode: 'light' | 'dark';
  theme: Theme;
}

describe('Theme Slice', () => {
  const initialState: ThemeState = {
    mode: 'light',
    theme: lightTheme, // Now initialized with lightTheme
  };

  it('should return the initial state', () => {
    expect(themeReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setThemeMode with light mode', () => {
    const nextState = themeReducer(initialState, setThemeMode('light'));
    expect(nextState.mode).toBe('light');
  });

  it('should handle setThemeMode with dark mode', () => {
    const nextState = themeReducer(initialState, setThemeMode('dark'));
    expect(nextState.mode).toBe('dark');
  });

  it('should handle setTheme with light theme', () => {
    const nextState = themeReducer(initialState, setTheme(lightTheme));
    expect(nextState.theme).toEqual(lightTheme);
  });

  it('should handle setTheme with dark theme', () => {
    const nextState = themeReducer(initialState, setTheme(darkTheme));
    expect(nextState.theme).toEqual(darkTheme);
  });

  it('should handle changing from light to dark mode', () => {
    let state = themeReducer(initialState, setThemeMode('light'));
    state = themeReducer(state, setTheme(lightTheme));
    
    // Now change to dark mode
    state = themeReducer(state, setThemeMode('dark'));
    expect(state.mode).toBe('dark');
    
    // Set dark theme
    state = themeReducer(state, setTheme(darkTheme));
    expect(state.theme).toEqual(darkTheme);
  });
}); 
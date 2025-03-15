import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme, lightTheme } from '../../styles/theme';

interface ThemeState {
  mode: 'light' | 'dark';
  theme: Theme;
}

const initialState: ThemeState = {
  mode: 'light',
  theme: lightTheme, // Initialize with the light theme
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
  },
});

export const { setThemeMode, setTheme } = themeSlice.actions;

export default themeSlice.reducer; 
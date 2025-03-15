# Gainsly Mobile App

A fitness tracking mobile application built with React Native and Expo.

## Features

- User authentication (register, login, logout)
- Profile management
- Workout tracking
- Nutrition tracking
- Progress monitoring

## Backend Integration

The app is now connected to the Gainsly backend API. Key integration points:

- Authentication services (register, login, logout, token refresh)
- User profile management
- Secure token handling with automatic refresh

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   cd gainsly-app
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

### Configuration

The app is configured to connect to the backend API at `http://localhost:5000/api`. To change this:

1. Update the `API_URL` in `src/services/api.ts`
2. Set `USE_MOCK_API` to `true` if you want to use mock data instead of the real API

## Project Structure

- `/src/components` - Reusable UI components
- `/src/navigation` - Navigation configuration
- `/src/screens` - App screens
- `/src/services` - API and authentication services
- `/src/store` - Redux store and slices
- `/src/styles` - Theme and styling
- `/src/utils` - Utility functions

## Authentication Flow

1. User registers or logs in
2. Auth tokens are stored in AsyncStorage
3. API requests include the auth token
4. Tokens are automatically refreshed when expired
5. On logout, tokens are cleared from storage

## Error Handling

The app includes comprehensive error handling:
- API errors are parsed and displayed with user-friendly messages
- Network errors are detected and appropriate messages shown
- Authentication errors trigger automatic logout when necessary

## Technical Implementation

### Authentication
- The app currently uses a mock authentication system for development
- User data is stored in AsyncStorage for persistence
- Login and registration are fully functional with validation

### Navigation
- Bottom tab navigation for main app sections
- Stack navigation for authentication flows

### State Management
- Redux with Redux Toolkit for global state management
- Slices for auth, theme, and other features

## Development

### Mock API
During Phase 1, the app uses a mock API implementation that simulates backend functionality:

- User registration and login
- Profile management
- Token-based authentication

This allows for testing the full authentication flow without a real backend. The mock API can be disabled by setting `USE_MOCK_API = false` in `src/services/api.ts` when a real backend is available.

### Running the App

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── navigation/       # Navigation configuration
├── providers/        # Context providers
├── screens/          # App screens
│   ├── auth/         # Authentication screens
│   └── home/         # Main app screens
├── services/         # API and other services
├── store/            # Redux store and slices
│   └── slices/       # Redux slices
├── styles/           # Global styles and themes
└── types/            # TypeScript type definitions
```

## Tech Stack

- React Native
- TypeScript
- Redux Toolkit for state management
- React Navigation for routing
- React Native Paper for UI components
- Axios for API requests
- AsyncStorage for local storage

## Development

### Code Style

This project uses ESLint and Prettier for code formatting and linting. Run the following commands to ensure your code meets the project's standards:

```
npm run lint
npm run format
```

### Testing

Run tests with:

```
npm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/) 
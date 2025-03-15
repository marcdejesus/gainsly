import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set test environment
process.env.NODE_ENV = 'test';

// Mock JWT functions
jest.mock('../utils/jwt', () => ({
  generateAccessToken: jest.fn().mockReturnValue('test-access-token'),
  generateRefreshToken: jest.fn().mockReturnValue('test-refresh-token'),
  verifyAccessToken: jest.fn().mockReturnValue({ id: 'test-user-id' }),
  verifyRefreshToken: jest.fn().mockReturnValue({ id: 'test-user-id' }),
  getRefreshTokenExpirationDate: jest.fn().mockReturnValue(new Date()),
}));

// Connect to test database before tests
beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/gainsly-test';
  
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to test database');
  } catch (error) {
    console.error('Error connecting to test database:', error);
    process.exit(1);
  }
});

// Clear all collections after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Disconnect from test database after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  console.log('Disconnected from test database');
}); 
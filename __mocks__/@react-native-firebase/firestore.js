// __mocks__/@react-native-firebase/firestore.js
export default () => ({
    collection: jest.fn(() => ({
      add: jest.fn(),
      orderBy: jest.fn(() => ({
        onSnapshot: jest.fn(),
      })),
      onSnapshot: jest.fn(),
    })),
  });
  
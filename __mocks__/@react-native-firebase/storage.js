// __mocks__/@react-native-firebase/storage.js
export default () => ({
    ref: jest.fn(() => ({
      putFile: jest.fn(),
      getDownloadURL: jest.fn(),
    })),
  });
  
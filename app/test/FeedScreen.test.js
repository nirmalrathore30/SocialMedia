import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import firestore from '@react-native-firebase/firestore';
import FeedScreen from '../screens/FeedScreen';
import renderWithNavigation from './testUtils'; // Adjust the path if necessary

jest.mock('@react-native-firebase/firestore');

describe('FeedScreen', () => {
  const navigateMock = jest.fn();

 
  it('renders loading indicator initially', () => {
    const { getByTestId } = renderWithNavigation(<FeedScreen navigation={{ navigate: jest.fn() }} />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders posts after loading', async () => {
    // Mock Firestore
    firestore().collection.mockReturnValue({
      orderBy: jest.fn().mockReturnValue({
        onSnapshot: jest.fn(callback => {
          callback({
            forEach: jest.fn(cb => {
              cb({ id: '1', data: () => ({ title: 'Post 1', description: 'Description 1', mediaURL: 'test_url', mediaType: 'image', timestamp: { seconds: 1234567890 }, likes: 10 }) });
            }),
          });
        }),
      }),
    });

    const { findByText } = renderWithNavigation(<FeedScreen navigation={{ navigate: jest.fn() }} />);
    
    await waitFor(() => expect(findByText('Post 1')).toBeTruthy());
  });
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });
});

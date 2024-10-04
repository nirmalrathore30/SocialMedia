import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import CreatePostScreen from '../screens/CreatePostScreen';
import renderWithNavigation from './testUtils';

jest.mock('@react-native-firebase/firestore');
jest.mock('@react-native-firebase/storage');
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));
global.alert = jest.fn();


describe('CreatePostScreen', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<CreatePostScreen navigation={{ navigate: jest.fn() }} />);
    expect(getByPlaceholderText('Title')).toBeTruthy();
    expect(getByPlaceholderText('Description')).toBeTruthy();
    expect(getByText('Pick Media')).toBeTruthy();
  });

  it('allows text input for title and description', () => {
    const { getByPlaceholderText } = render(<CreatePostScreen navigation={{ navigate: jest.fn() }} />);
    const titleInput = getByPlaceholderText('Title');
    const descriptionInput = getByPlaceholderText('Description');

    fireEvent.changeText(titleInput, 'New Post Title');
    fireEvent.changeText(descriptionInput, 'Post Description');

    expect(titleInput.props.value).toBe('New Post Title');
    expect(descriptionInput.props.value).toBe('Post Description');
  });

  it('handles media selection', async () => {
    launchImageLibrary.mockImplementation((options, callback) => {
      callback({
        didCancel: false,
        assets: [{ uri: 'test_uri', type: 'image/jpeg' }],
      });
    });

    const { getByText, findByText } = render(<CreatePostScreen navigation={{ navigate: jest.fn() }} />);
    
    fireEvent.press(getByText('Pick Media'));
    await waitFor(() => expect(findByText('Uploading:')).toBeTruthy());
  });

  // it('submits the post and resets fields', async () => {
  //   const navigateMock = jest.fn();
  //   const { getByPlaceholderText, getByText } = renderWithNavigation(<CreatePostScreen navigation={{ navigate: navigateMock }} />);
    
  //   // Mock the image upload to Firebase
  //   storage().ref.mockReturnValue({
  //     putFile: jest.fn().mockResolvedValueOnce({}),
  //     getDownloadURL: jest.fn().mockResolvedValueOnce('https://example.com/media'),
  //   });
    
  //   // Mock Firestore
  //   firestore().collection.mockReturnValue({
  //     add: jest.fn().mockResolvedValueOnce({}),
  //   });

  //   fireEvent.changeText(getByPlaceholderText('Title'), 'New Post Title');
  //   fireEvent.changeText(getByPlaceholderText('Description'), 'Post Description');
    
  //   await waitFor(() => fireEvent.press(getByText('Submit Post')));
    
  //   expect(navigateMock).toHaveBeenCalledWith('Feed');
  //   expect(getByPlaceholderText('Title').props.value).toBe('');
  //   expect(getByPlaceholderText('Description').props.value).toBe('');
  // });
});

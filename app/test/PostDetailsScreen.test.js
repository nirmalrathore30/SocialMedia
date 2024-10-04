import React from 'react';
import { render } from '@testing-library/react-native';
import PostDetailsScreen from '../screens/PostDetailsScreen';
import renderWithNavigation from './testUtils';

describe('PostDetailsScreen', () => {
  it('renders post details correctly', () => {
    const post = {
      title: 'Post Title',
      description: 'Post Description',
      mediaURL: 'test_url',
      mediaType: 'image',
      timestamp: { seconds: 1234567890 },
      likes: 10,
    };

    const { getByText, getByTestId } = renderWithNavigation(<PostDetailsScreen route={{ params: { post } }} navigation={{ goBack: jest.fn() }} />);
    
    expect(getByText('Post Title')).toBeTruthy();
    expect(getByText('Post Description')).toBeTruthy();
  });
});

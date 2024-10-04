import React from 'react';
import { render } from '@testing-library/react-native';
import UserProfileScreen from '../screens/ProfileScreen';

describe('UserProfileScreen', () => {
  it('should render the user avatar', () => {
    const { getByTestId } = render(<UserProfileScreen />);
    const avatar = getByTestId('avatar');
    expect(avatar).toBeTruthy();
  });

  it('should display the username', () => {
    const { getByText } = render(<UserProfileScreen />);
    const username = getByText('Nirmal Rathore');
    expect(username).toBeTruthy();
  });

  it('should display the user bio', () => {
    const { getByText } = render(<UserProfileScreen />);
    const bio = getByText('Just a simple guy who loves photography.');
    expect(bio).toBeTruthy();
  });

  it('should display the follower count and post count', () => {
    const { getByText } = render(<UserProfileScreen />);
    const stats = getByText('1500 Followers • 30 Posts');
    expect(stats).toBeTruthy();
  });

  it('should render a grid of user posts', () => {
    const { getAllByTestId } = render(<UserProfileScreen />);
    const posts = getAllByTestId('user-post');
    expect(posts.length).toBe(30); // Check if there are 30 posts
  });

  it('should match the snapshot', () => {
    const { toJSON } = render(<UserProfileScreen />);
    expect(toJSON()).toMatchSnapshot();
  });
});

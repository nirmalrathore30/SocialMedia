import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';

const userProfile = {
  id: '1',
  username: 'Nirmal Rathore',
  userAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  bio: 'Just a simple guy who loves photography.',
  followers: 1500,
  postsCount: 30,
};

const userPosts = Array.from({ length: 30 }, (_, index) => ({
  id: (index + 1).toString(),
  mediaURL: `https://picsum.photos/id/${(index % 100)}/400/300`, // Random images from Picsum
}));

const UserProfileScreen = () => {
  const renderPostItem = ({ item }) => (
    <Image testID='user-post' source={{ uri: item.mediaURL }} style={styles.postImage} />
  );

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Avatar.Image testID='avatar' source={{ uri: userProfile.userAvatar }} size={80} />
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{userProfile.username}</Text>
          <Text  style={styles.bio}>{userProfile.bio}</Text>
          <Text style={styles.stats}>
            {userProfile.followers} Followers • {userProfile.postsCount} Posts
          </Text>
        </View>
      </View>

      {/* User Posts Grid */}
      <FlatList
        data={userPosts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        numColumns={3} // Display posts in a grid with 3 columns
        style={styles.postsGrid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    marginHorizontal: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 14,
    color: 'gray',
  },
  stats: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  postsGrid: {
    marginTop: 10,
  },
  postImage: {
    width: '33.33%', // Each image takes up a third of the screen width
    height: 120, // Set a fixed height for images
    aspectRatio: 1, // Maintain aspect ratio for images
  },
});

export default UserProfileScreen;

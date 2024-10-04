import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import Video from 'react-native-video';

const PostDetailsScreen = ({ route }) => {
  const { post } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image size={50} source={{ uri: post.userAvatar }} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.timestamp}>
            {new Date(post.timestamp.seconds * 1000).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {post.mediaType.includes('image') ? (
        <Image style={styles.media} source={{ uri: post.mediaURL }} />
      ) : (
        <Video source={{ uri: post.mediaURL }} style={styles.media} controls />
      )}

      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.description}>{post.description}</Text>

      <Button onPress={() => alert('Liked!')}>Like</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    marginLeft: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    color: 'gray',
  },
  media: {
    width: '100%',
    height: 300,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default PostDetailsScreen;

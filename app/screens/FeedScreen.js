import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import {Avatar, Card, Button} from 'react-native-paper';
import Video from 'react-native-video';
import {useIsFocused} from '@react-navigation/native';

const FeedScreen = ({navigation}) => {
  const [allPosts, setAllPosts] = useState([]); // All fetched posts
  const [displayedPosts, setDisplayedPosts] = useState([]); // Posts to display
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); // Loading state for more posts
  const isFocused = useIsFocused();
  const [itemsToShow, setItemsToShow] = useState(10); // Number of items to display initially

  // Function to generate dummy posts
  const generateDummyPosts = () => {
    return Array.from({length: 200}, (_, index) => ({
      id: (index + 1).toString(),
      username: `user_${index + 1}`,
      userAvatar: `https://randomuser.me/api/portraits/men/${index}.jpg`,
      mediaURL: `https://picsum.photos/id/${index % 100}/400/300`,
      mediaType: index % 2 === 0 ? 'image' : 'video',
      title: `Post Title ${index + 1}`,
      description: `This is the description for post number ${index + 1}.`,
      timestamp: new Date(Date.now() - index * 1000 * 60 * 60 * 24),
      likes: Math.floor(Math.random() * 500),
    }));
  };

  useEffect(() => {
    let unsubscribe;
    if (isFocused) {
      setLoading(true); // Set loading to true when fetching data
      // Fetch posts from Firestore
      unsubscribe = firestore()
        .collection('posts')
        .orderBy('timestamp', 'desc')
        .onSnapshot(
          querySnapshot => {
            const postsArray = [];
            querySnapshot.forEach(doc => {
              postsArray.push({id: doc.id, ...doc.data()});
            });

            // Generate dummy posts and combine with fetched posts
            const dummyPosts = generateDummyPosts();
            setAllPosts([...postsArray, ...dummyPosts]);
            setDisplayedPosts([
              ...postsArray.slice(0, itemsToShow),
              ...dummyPosts.slice(0, itemsToShow),
            ]);
            setLoading(false); // Set loading to false after data is fetched
          },
          error => {
            console.error('Error fetching posts: ', error);
            setLoading(false); // Ensure loading is set to false on error
          },
        );
    }

    return () => unsubscribe && unsubscribe();
  }, [isFocused]);

  const loadMoreItems = () => {
    if (displayedPosts.length < 200 && !loadingMore) {
      setLoadingMore(true); // Set loading more to true
      setTimeout(() => {
        setItemsToShow(prev => Math.min(prev + 10, 200)); // Increase by 10, but not more than 200
        const newPosts = allPosts.slice(0, itemsToShow + 10); // Get new posts to display
        setDisplayedPosts(newPosts); // Update displayed posts
        setLoadingMore(false); // Set loading more to false
      }, 2000); // Wait for 2 seconds before loading more items
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('FeedStack', {
          screen: 'PostDetails',
          params: {post: item},
        })
      }>
      <Card style={{marginBottom: 20}}>
        <Card.Title
          title={item.username ? item.username : 'Post 1'}
          left={() => (
            <Avatar.Image
              size={40}
              source={{
                uri: item.userAvatar
                  ? item.userAvatar
                  : 'https://randomuser.me/api/portraits/men/3.jpg',
              }} // Display user avatar
            />
          )}
        />
        <Card.Content>
          {item.mediaType.includes('image') ? (
            <FastImage
              style={{width: '100%', height: 300}}
              source={{uri: item.mediaURL}}
            />
          ) : (
            <Video
              source={{uri: item.mediaURL}}
              style={{width: '100%', height: 300}}
              controls
            />
          )}
          <Text style={{marginTop: 10}}>{item.title}</Text>
          <Text>{item.description}</Text>
          <Text>
            {item.timestamp?.seconds &&
              new Date(item.timestamp.seconds * 1000).toLocaleDateString()}
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => alert('Liked!')}>Like</Button>
        </Card.Actions>
      </Card>
    </TouchableOpacity>
  );

  return loading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator  testID="loading-indicator" size="large" color="#0000ff" />
    </View>
  ) : (
    <View style={{flex: 1}}>
      <FlatList
        data={displayedPosts} // Render the displayed posts
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={loadMoreItems} // Load more items when scrolled to the end
        onEndReachedThreshold={0.5} // Threshold for triggering load more
      />
      {loadingMore && (
        <View style={{padding: 20, alignItems: 'center'}}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text>Loading more items...</Text>
        </View>
      )}
    </View>
  );
};

export default FeedScreen;

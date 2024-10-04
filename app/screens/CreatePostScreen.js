import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Image,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {Avatar} from 'react-native-paper';

const CreatePostScreen = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleMediaPicker = () => {
    launchImageLibrary({mediaType: 'mixed'}, response => {
      if (!response.didCancel && !response.error) {
        setMedia(response.assets[0].uri);
        setMediaType(response.assets[0].type);
      }
    });
  };

  const uploadMediaToFirebase = async () => {
    if (media) {
      setUploading(true);
      const filename = media.substring(media.lastIndexOf('/') + 1);
      const uploadTask = storage().ref(filename).putFile(media);

      uploadTask.on('state_changed', taskSnapshot => {
        setProgress(
          (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100,
        );
      });

      try {
        await uploadTask;
        const downloadURL = await storage().ref(filename).getDownloadURL();
        setUploading(false);
        return downloadURL;
      } catch (e) {
        console.error(e);
        setUploading(false);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (title && description) {
        const mediaURL = await uploadMediaToFirebase();
        if (mediaURL) {
          await firestore().collection('posts').add({
            title,
            description,
            mediaURL,
            mediaType,
            timestamp: firestore.FieldValue.serverTimestamp(),
            userId: 'currentUserId', // Replace with actual logged in user ID
            likes: 0,
            username: `Nirmal Rathore`,
            userAvatar: `https://randomuser.me/api/portraits/men/1.jpg`,
          });
          // Clear the post data
          setTitle('');
          setDescription('');
          setMedia(null);
          setMediaType(null);
          setProgress(0);
          alert('Post created successfully!');
          navigation.navigate('Feed');
        } else {
          alert('Please select media.');
        }
      } else {
        alert('Please fill all fields.');
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Image
          source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}}
          size={40}
        />
        <Text style={styles.username}>Nirmal Rathore</Text>
      </View>

      <TextInput
        placeholder="Title"
        onChangeText={setTitle}
        value={title}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        onChangeText={setDescription}
        value={description}
        style={[styles.input, styles.descriptionInput]}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.mediaButton} onPress={handleMediaPicker}>
        <Text style={styles.mediaButtonText}>Pick Media</Text>
      </TouchableOpacity>
      {media && mediaType?.includes('image') && (
        <Image source={{uri: media}} style={styles.mediaPreview} />
      )}
      {uploading ? (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.uploadingText}>
            Uploading: {Math.round(progress)}%
          </Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Post</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top', // Start text from the top
  },
  mediaButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  mediaButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  mediaPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  uploadingText: {
    marginLeft: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreatePostScreen;

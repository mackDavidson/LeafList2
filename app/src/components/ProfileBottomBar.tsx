import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router'; // Import Link
import { Feather } from '@expo/vector-icons';

type ProfileBottomBarProps = {
  plantID: number;
  activeRoute: 'profile' | 'logs' | 'gallery';
};

const ProfileBottomBar: React.FC<ProfileBottomBarProps> = ({ plantID, activeRoute }) => {
  return (
    <View style={styles.container}>
      <Link
        href={`/profiles/${plantID}`}
        style={[
          styles.button,
          activeRoute === 'profile' && styles.activeButton,
        ]}
        asChild // Make the TouchableOpacity the actual Link
      >
        <TouchableOpacity>
          <Feather name="user" size={20} color="#1B5E20" style={styles.icon} />
          <Text style={[styles.buttonText, activeRoute === 'profile' && styles.activeButtonText]}>Profile</Text>
        </TouchableOpacity>
      </Link>
      <Link
        href={`/plantLogs/${plantID}`}
        style={[styles.button, activeRoute === 'logs' && styles.activeButton]}
        asChild
      >
        <TouchableOpacity>
          <Feather name="list" size={20} color="#1B5E20" style={styles.icon} />
          <Text style={[styles.buttonText, activeRoute === 'logs' && styles.activeButtonText]}>Logs</Text>
        </TouchableOpacity>
      </Link>
      <Link
        href={`/plantImages/${plantID}`}
        style={[styles.button, activeRoute === 'gallery' && styles.activeButton]}
        asChild
      >
        <TouchableOpacity>
          <Feather name="image" size={20} color="#1B5E20" style={styles.icon} />
          <Text style={[styles.buttonText, activeRoute === 'gallery' && styles.activeButtonText]}>Gallery</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5F5DC', // Beige background
    paddingVertical: 12,
    borderTopWidth: 0,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,              
    left: 0,
    right: 0,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#A5D6A7', // Light green active button
  },
  buttonText: {
    fontSize: 16,
    color: '#1B5E20', // Dark green text
    fontWeight: '600',
    marginLeft: 8,
  },
  activeButtonText: {
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 5,
  },
});

export default ProfileBottomBar;
import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Icons = ({ type, active }) => {

  let imageSource;
  let iconStyle = [styles.icon];

  switch (type) {
    case 'home':
      imageSource = require('../assets/icons/home.png');
      active && iconStyle.push(styles.active);
      break;
    case 'community':
      imageSource = require('../assets/icons/community.png');
      active && iconStyle.push(styles.active);
      break;
    case 'event':
      imageSource = require('../assets/icons/event.png');
      active && iconStyle.push(styles.active);
      break;
    case 'profile':
      imageSource = require('../assets/icons/profile.png');
      active && iconStyle.push(styles.active);
      break;
    case 'arrow':
        imageSource = require('../assets/icons/arrow.png');
    break;
    case 'back':
        imageSource = require('../assets/icons/back.png');
    break;
    case 'add':
        imageSource = require('../assets/icons/add.png');
    break;
    case 'calendar':
        imageSource = require('../assets/icons/calendar.png');
    break;
    case 'done':
        imageSource = require('../assets/icons/done.png');
    break;
  }

  return (
    <Image 
      source={imageSource} 
      style={iconStyle} 
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  active: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    tintColor: '#fff',
  },
  color: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    tintColor: '#8454ff',
  }
});

export default Icons;

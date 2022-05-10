import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import axios from 'axios';

export default function Comments() {
  return (
    <View>
      <Text>hello comments</Text>
    </View>
  );
}

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

export default function Task({task, navigation}) {
  return (
    <TouchableOpacity style={style.taskVue}>
      <View style={style.task}>
        <Text> {task.subject } </Text>
        <Text> {task.description } </Text>

      </View>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  taskVue: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderBottomWidth: 2,
    borderColor: '#eee',
  },
  task: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
  },
});
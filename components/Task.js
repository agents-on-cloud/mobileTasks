import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

export default function Task({task, navigation, type}) {
  const goTask = id => {
    console.log(id);
    navigation.navigate('TaskFullView', {
      task_id: id,
      type,
    });
  };
  return (
    <TouchableOpacity
      style={style.taskVue}
      onPress={() => {
        goTask(task.task_id);
      }}>
      <View style={style.task}>
        <View style={style.leftSide}>
          <Text style={style.mrl}>By: {task.creator_name}</Text>
          <Text style={style.mrl}>{task.subject}</Text>
          <Text style={[style.mrl, style.smallText]}>
            Created : {task.created}
          </Text>
        </View>
        <View style={style.rightSide}>
          <Text style={style.mrl}>work status : {task.status}</Text>
          <View style={[style.priority, style.mrl]}>
            <Text style={{color: 'rgb(0, 0, 0)'}}>Priority :</Text>
            <Text
              style={
                task.priority === 1
                  ? style.high
                  : task.priority === 2
                  ? style.meduim
                  : style.low
              }>
              {task.priority === 1
                ? ' High'
                : task.priority === 2
                ? ' Meduim'
                : ' Low'}
            </Text>
          </View>
          <Text style={[style.mrl, style.smallText]}>
            Dead line : {task.deadline}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  taskVue: {
    marginTop: 15,
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderBottomWidth: 2,
    borderColor: '#eee',
  },
  task: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSide: {
    width: '50%',
  },
  rightSide: {
    width: '50%',
  },
  priority: {
    flexDirection: 'row',
  },
  mrl: {
    marginVertical: 7,
    color: '#000000',
  },
  smallText: {
    fontSize: 12,
    color: '#000000',
  },
  high: {
    color: '#ff5252',
  },
  meduim: {
    color: '#fb8c00',
  },
  low: {
    color: '#4caf50',
  },
});

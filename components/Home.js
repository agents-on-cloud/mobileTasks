import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {
  getTaskas,
  getTodayTasks,
  getAllTasks,
  getTomorrowTasks,
  getThisWeek,
  getLastWeek,
} from '../reducers/tasks';

import Task from './Task';
import axios from 'axios';

export default function Home({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('assigned');
  const [checked, setChecked] = useState('All');

  const dispatch = useDispatch();

  ////////
  const state = useSelector(state => {
    return {
      token: state.login.token,
      user_id: state.login.user_id,
      user_name: state.login.user_name,
      tasks: state.tasks.tasks,
    };
  });
  ///////

  useEffect(() => {
    if (state.user_id) {
      console.log(state.user_id);
      getAssigned();
    }
  }, [state.user_id]);

  useEffect(() => {
    setModalVisible(false);
    if (checked === 'All') {
      dispatch(getAllTasks());
    } else if (checked === 'Today') {
      dispatch(getTodayTasks());
    } else if (checked === 'Tomorrow') {
      dispatch(getTomorrowTasks());
    } else if (checked === 'This week') {
      dispatch(getThisWeek());
    } else if (checked === 'Last week') {
      dispatch(getLastWeek());
    }
  }, [checked]);

  const getAssigned = async () => {
    try {
      console.log('send request');
      const data = await axios.get(
        `http://192.168.85.37:30122/tasks/assignedToMe/${state.user_id}`,
      );
      // console.log(data.data);
      data.data.forEach(element => {
        element.created =
          element.created_date.split('-').reverse().join('-') +
          ' at ' +
          element.created_time;
        element.deadline =
          element.due_date.split('-').reverse().join('-') +
          ' at ' +
          element.due_time;
      });
      dispatch(getTaskas(data.data));
    } catch (error) {
      console.log('error here');
    }
  };
  const getGeneral = async () => {
    const data = await axios.get(
      `http://192.168.85.37:30122/tasks/generalTasks/${state.user_id}`,
    );
    data.data.forEach(element => {
      element.created =
        element.created_date.split('-').reverse().join('-') +
        ' at ' +
        element.created_time;
      element.deadline =
        element.due_date.split('-').reverse().join('-') +
        ' at ' +
        element.due_time;
    });
    const res = await axios.get(
      'http://192.168.85.37:30122/tasks/allGeneralTasks/',
    );
    res.data.forEach(element => {
      element.created =
        element.created_date.split('-').reverse().join('-') +
        ' at ' +
        element.created_time;
      element.deadline =
        element.due_date.split('-').reverse().join('-') +
        ' at ' +
        element.due_time;
    });
    dispatch(getTaskas([...data.data, ...res.data]));
  };

  const getCreated = async () => {
    const data = await axios.get(
      `http://192.168.85.37:30122/tasks/myTasks/${state.user_id}`,
    );
    data.data.forEach(element => {
      element.created =
        element.created_date.split('-').reverse().join('-') +
        ' at ' +
        element.created_time;
      element.deadline =
        element.due_date.split('-').reverse().join('-') +
        ' at ' +
        element.due_time;
    });
    const res = await axios.get(
      `http://192.168.85.37:30122/tasks/myCompletedTasks/${state.user_id}`,
    );
    res.data.forEach(element => {
      element.created =
        element.created_date.split('-').reverse().join('-') +
        ' at ' +
        element.created_time;
      element.deadline =
        element.due_date.split('-').reverse().join('-') +
        ' at ' +
        element.due_time;
    });
    dispatch(getTaskas([...data.data, ...res.data]));
  };

  const changeTab = str => {
    setSelectedCategory(str);
    setModalVisible(false);
    setChecked('All');
    if (str === 'assigned') {
      getAssigned();
    } else if (str === 'general') {
      getGeneral();
    } else if (str === 'created') {
      getCreated();
    }
  };

  const createTask = () => {
    navigation.navigate('createTask');
  };

  return (
    <ScrollView  >
      <View style={style.container}>
        {/* <View>
          <TouchableOpacity style={style.filter} onPress={() => {
              setModalVisible(!modalVisible)
          }}>
            <View>
              <Text style={style.filterText}> Time Filter </Text>
            </View>
          </TouchableOpacity>
        </View> */}
        <View style={style.tabs}>
          <TouchableOpacity
            style={
              selectedCategory === 'assigned'
                ? [style.tabView, style.activeTab]
                : style.tabView
            }
            onPress={() => {
              changeTab('assigned');
            }}>
            <View style={style.tab}>
              <Text style={style.tabText}> Assigned to me </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              selectedCategory === 'general'
                ? [style.tabView, style.activeTab]
                : style.tabView
            }
            onPress={() => {
              changeTab('general');
            }}>
            <View style={style.tab}>
              <Text style={style.tabText}> General Tasks </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              selectedCategory === 'created'
                ? [style.tabView, style.activeTab]
                : style.tabView
            }
            onPress={() => {
              changeTab('created');
            }}>
            <View style={style.tab}>
              <Text style={style.tabText}> Created by me </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={style.title}>
          <Text> number of tasks is : {state.tasks.length} </Text>
          <View style={style.icons}>
            <Text
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              {' '}
              {checked}{' '}
            </Text>
            <Icon
              name="filter"
              size={30}
              color="#009688"
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            />
            <Icon name="plus" size={30} color="#009688" onPress={createTask} />
          </View>
        </View>
        <ScrollView horizontal={true} contentContainerStyle={{flex: 1}}>
          <FlatList
            style={{flex: 1}}
            data={state.tasks}
            renderItem={({item}) => {
              return (
                <Task
                  task={item}
                  type={selectedCategory}
                  navigation={navigation}
                />
              );
            }}
            keyExtractor={item => item.id}
          />
        </ScrollView>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={style.centeredView2}>
            <View style={style.modalView}>
              <Pressable
                style={style.button}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={style.textStyle}>Close</Text>
              </Pressable>
              <Text style={style.modalText}>Select Time Filter</Text>
              <View>
                <RadioButton.Group
                  onValueChange={value => setChecked(value)}
                  value={checked}>
                  <RadioButton.Item
                    label="All"
                    value="All"
                    style={style.radio}
                  />
                  <RadioButton.Item
                    label="Today"
                    value="Today"
                    style={style.radio}
                  />
                  <RadioButton.Item
                    label="Tomorrow"
                    value="Tomorrow"
                    style={style.radio}
                  />
                  <RadioButton.Item
                    label="This week"
                    value="This week"
                    style={style.radio}
                  />
                  <RadioButton.Item
                    label="Last week"
                    value="Last week"
                    style={style.radio}
                  />
                </RadioButton.Group>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  tabs: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
  },
  tabView: {
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 5,
    paddingLeft: 5,
    backgroundColor: '#04b9a7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#04b9a7',
  },
  activeTab: {
    backgroundColor: '#009688',
    borderColor: '#009688',
  },

  filter: {
    marginLeft: 5,
    marginLeft: 5,
    marginTop: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 5,
    paddingLeft: 5,
    backgroundColor: '#009688',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#009688',
  },

  filterText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
  },

  tabText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  centeredView2: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 22,
  },

  title: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  icons: {
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    paddingTop: 20,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    width: '90%',
    backgroundColor: 'red',
    marginRight: 10,
    marginLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'red',
  },
  textStyle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  modalText: {
    width: '100%',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 15,
    textAlign: 'center',
  },
  radio: {
    flexDirection: 'row-reverse',
  },
});

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
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {getAssignedTaskas, getGeneralTaskas} from '../reducers/tasks';
import Task from './Task';
import axios from 'axios';

export default function Home({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
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

  const getAssigned = async () => {
    const data = await axios.get(
      `http://192.168.1.129:30122/tasks/assignedToMe/${state.user_id}`,
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
    dispatch(getAssignedTaskas(data.data));
  };
  const getGeneral = async () => {
    const data = await axios.get(
      `http://192.168.1.129:30122/tasks/generalTasks/${state.user_id}`,
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
      'http://192.168.1.129:30122/tasks/allGeneralTasks/',
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
    dispatch(getGeneralTaskas([...data.data, ...res.data]));
  };

  const getCreated = async () => {
    const data = await axios.get(
      `http://192.168.1.129:30122/tasks/myTasks/${state.user_id}`,
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
      `http://192.168.1.129:30122/tasks/myCompletedTasks/${state.user_id}`,
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
    dispatch(getGeneralTaskas([...data.data, ...res.data]));
  };

  const changeTab = str => {
    if (str === 'assigned') {
      getAssigned();
    } else if (str === 'general') {
      getGeneral();
    } else if (str === 'created') {
      getCreated();
    }
  };

  return (
    <ScrollView>
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
            style={style.tabView}
            onPress={() => {
              changeTab('assigned');
            }}>
            <View style={style.tab}>
              <Text style={style.tabText}> Assigned to me </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.tabView}
            onPress={() => {
              changeTab('general');
            }}>
            <View style={style.tab}>
              <Text style={style.tabText}> General Tasks </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={style.tabView}
            onPress={() => {
              changeTab('created');
            }}>
            <View style={style.tab}>
              <Text style={style.tabText}> Created by me </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={style.title}>
          <Text> tasks is {state.tasks.length} </Text>
          <Icon
            name="filter"
            size={30}
            color="#009688"
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          />
        </View>
        <ScrollView horizontal={true} contentContainerStyle={{flex: 1}}>
          <FlatList
            style={{flex: 1}}
            data={state.tasks}
            renderItem={({item}) => {
              return <Task task={item} navigation={navigation} />;
            }}
            keyExtractor={item => item.id}
          />
        </ScrollView>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={style.centeredView2}>
            <View style={style.modalView}>
              <Text style={style.modalText}>Hello World!</Text>
              <Pressable
                style={[style.button, style.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={style.textStyle}>Hide Modal</Text>
              </Pressable>
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
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: '#009688',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#009688',
  },

  filter: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
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

  tab: {},
  tabText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
  centeredView2: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 22,
  },

  title: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalView: {
    width: '100%',
    // margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

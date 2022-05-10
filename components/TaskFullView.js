import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  LogBox,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setDeleteTask} from '../reducers/tasks';
import DropDownPicker from 'react-native-dropdown-picker';
import {RadioButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Comments from './Comments';
import axios from 'axios';

export default function TaskFullView({route, navigation}) {
  const [task, setTask] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selctedUsers, setSelctedUsers] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [checked, setChecked] = useState('');
  const [seeMore, setSeeMore] = useState(false);

  const dispatch = useDispatch();
  let {task_id, type} = route.params;
  const state = useSelector(state => {
    return {
      token: state.login.token,
      user_id: state.login.user_id,
      user_name: state.login.user_name,
      tasks: state.tasks.tasks,
    };
  });
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    getTaskInfo();
    getAssignedUsers();
    const getUsers = async () => {
      const res = await axios.get(
        'https://62207663ce99a7de195a41c3.mockapi.io/users/users',
      );
      setUsers(res.data);
    };
    getUsers();
  }, []);

  useEffect(() => {
    const arr = [];
    selctedUsers.forEach(element => {
      const user = users.find(ele => {
        return element === ele.user_id;
      });
      arr.push(user);
    });
    setAssigned(arr);
    console.log(selctedUsers);
  }, [selctedUsers]);

  const getTaskInfo = async () => {
    try {
      const res = await axios.get(
        `http://192.168.85.37:30122/tasks/oneTask/${task_id}`,
      );
      setTask(res.data);
      setChecked(res.data.status);
    } catch (error) {
      console.log('error');
    }
  };
  const getAssignedUsers = async () => {
    try {
      const res = await axios.get(
        `http://192.168.85.37:30122/tasks/task/assign/${task_id}`,
      );
      setAssignedUsers(res.data);
      setAssigned(res.data);
      const arr = [];
      res.data.forEach(ele => {
        arr.push(ele.user_id);
      });
      setSelctedUsers(arr);
    } catch (error) {
      console.log('error');
    }
  };

  const claimeTask = async () => {
    try {
      const res = await axios.put(
        `http://192.168.85.37:30122/tasks/task/claimme/${task_id}`,
        {
          userId: state.user_id,
          user_name: state.user_name,
        },
      );
      if (res.status === 200) {
        getTaskInfo();
        getAssignedUsers();
        navigation.navigate('TaskFullView', {
          task_id: task_id,
          type: 'assigned',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openDialogDeleteTask = () => {
    Alert.alert('Delete this task', `Do you want to delete this task ?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'Yes', onPress: deleteTask},
    ]);
  };
  const deleteTask = async () => {
    try {
      const res = await axios.delete(
        `http://192.168.85.37:30122/tasks/deleteTask/${task_id}`,
      );
      if (res.status === 200) {
        dispatch(setDeleteTask(task_id));
        // navigation.navigate('Home');
        Alert.alert(`Task was deleted Successfully`, '', [
          {
            text: 'Go Home',
            onPress: () => navigation.navigate('Home'),
            style: 'cancel',
          },
        ]);
      }
    } catch (error) {
      console.log('error');
    }
  };

  const openStatusDialog = () => {
    setStatusModalVisible(true);
  };
  const changeStatus = async () => {
    console.log(checked);
    const res = await axios.put(
      `http://192.168.85.37:30122/tasks/task/changeStatus/${task_id}`,
      {
        newStatus: checked,
      },
    );
    getTaskInfo();
    setStatusModalVisible(false);
  };

  const handleReassigne = async () => {
    setModalVisible(false);
    console.log('assigned', assigned);
    console.log(task.claimed);
    const users_id = [];
    assigned.forEach(element => {
      users_id.push({id: element.user_id, name: element.user_name});
    });
    if (task.claimed || (!task.claimed && users_id.length === 1)) {
      const res = await axios.post(
        'http://192.168.85.37:30122/tasks/task/assigneUser',
        {
          task_id: task_id,
          user_id: users_id,
        },
      );
      if (res.status === 201) {
        getAssignedUsers();
      }
    } else {
      const newTask = {
        creator: state.user_id,
        creator_name: state.user_name,
        subject: task.subject,
        description: task.description,
        status: 'New',
        claimed: task.claimed,
        priority: task.priority,
        created_date: task.created_date,
        created_time: task.created_time,
        due_date: task.due_date,
        due_time: task.due_time,
        estimated_time: task.estimated_time,
        work_status: 'created',
        attachment: task.attachment,
        refrenced: task.refrenced,
      };
      const resData = await axios.get(
        `http://192.168.85.37:30122/tasks/task/assign/${task_id}`,
      );
      const oldAssignedUsers = [];
      resData.data.forEach(ele => {
        oldAssignedUsers.push(ele.user_id);
      });

      let chick = false;
      users_id.forEach(async ele => {
        if (!oldAssignedUsers.includes(ele.id)) {
          const res = await axios.post(
            'http://192.168.85.37:30122/tasks',
            newTask,
          );
          const as = await axios.post(
            'http://192.168.85.37:30122/tasks/task/assigneUser',
            {task_id: res.data.task_id, user_id: [ele]},
          );
        } else {
          chick = true;
          await axios.post(
            'http://192.168.85.37:30122/tasks/task/assigneUser',
            {
              task_id: task_id,
              user_id: [ele],
            },
          );
        }
        if (!chick) {
          await axios.post(
            `http://192.168.85.37:30122/tasks/task/resetAssign`,
            {
              task_id: task_id,
            },
          );
        }
      });
      getAssignedUsers();
    }
  };

  return (
    <ScrollView>
      {task ? (
        <View style={style.container}>
          <View style={style.headrs}>
            <Text style={style.subject_text}> {task?.subject} </Text>
            <View style={style.actions}>
              {type === 'general' ? (
                <TouchableOpacity style={style.claim_btn} onPress={claimeTask}>
                  <View>
                    <Text style={style.deleteText}> Claime </Text>
                  </View>
                </TouchableOpacity>
              ) : null}
              {state.user_id === task.creator ? (
                <TouchableOpacity
                  style={style.delete_btn}
                  onPress={openDialogDeleteTask}>
                  <View>
                    <Text style={style.deleteText}> Delete </Text>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* -------------------------------- body ------------------------------------------------ */}

          <View style={style.body}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <View style={{flexDirection: 'row', width: '48%'}}>
                <Text style={{color: 'rgb(0, 0, 0)', fontSize: 15}}>By : </Text>
                <Text style={{color: 'rgb(0, 0, 0)', fontSize: 15}}>
                  {` ${task.creator_name}`}
                </Text>
              </View>
              <View style={{flexDirection: 'row', width: '51%'}}>
                <Text style={{color: 'rgb(0, 0, 0)', fontSize: 13}}>
                  Created at :
                </Text>
                <Text style={{color: 'rgb(0, 0, 0)', fontSize: 13}}>
                  {` ${task.created_date} at ${task.created_time}`}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <View style={{flexDirection: 'row', width: '48%'}}>
                <Text style={{color: 'rgb(0, 0, 0)', fontSize: 15}}>
                  Priority :
                </Text>
                <Text
                  style={
                    task.priority === 1
                      ? style.high
                      : task.priority === 2
                      ? style.meduim
                      : style.low
                  }>
                  {task.priority === 1
                    ? '  High'
                    : task.priority === 2
                    ? '  Meduim'
                    : '  Low'}
                </Text>
              </View>
              <View style={{flexDirection: 'row', width: '51%'}}>
                <Text style={{color: 'rgb(0, 0, 0)', fontSize: 13}}>
                  Deadline :
                </Text>
                <Text style={{color: 'rgb(0, 0, 0)', fontSize: 13}}>
                  {` ${task.due_date} at ${task.due_time}`}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '48%',
                }}>
                <Text style={{color: 'rgb(0, 0, 0)', fontSize: 15}}>
                  Status :
                </Text>
                <Text
                  style={{color: 'rgb(0, 0, 0)', fontSize: 15, marginRight: 5}}
                  onPress={openStatusDialog}>
                  {` ${task.status}`}
                </Text>
                <Icon
                  name="pencil"
                  size={15}
                  color="#009688"
                  onPress={openStatusDialog}
                />
              </View>
              <View style={{flexDirection: 'row', width: '51%'}}>
                <Text style={{color: 'rgb(0, 0, 0)', fontSize: 15}}>
                  Activity status :
                </Text>
                <Text style={{color: 'rgb(0, 0, 0)', fontSize: 15}}>
                  {task.work_status}
                </Text>
              </View>
            </View>
            <View style={{marginVertical: 20}}>
              <Text
                style={{color: 'rgb(0, 0, 0)', fontSize: 16, marginBottom: 15}}>
                Description :
              </Text>
              {seeMore ? (
                <View>
                  <Text>
                    {task.description}
                    <Text
                      style={{color: 'blue', fontWeight: 'bold'}}
                      onPress={() => {
                        setSeeMore(false);
                      }}>
                      see less
                    </Text>
                  </Text>
                </View>
              ) : task.description.split(' ').length > 30 ? (
                <View>
                  <Text>
                    {task.description.split(' ').slice(0, 30).join(' ')}
                    <Text
                      style={{color: 'blue', fontWeight: 'bold'}}
                      onPress={() => {
                        setSeeMore(true);
                      }}>
                      see more
                    </Text>
                  </Text>
                </View>
              ) : (
                <Text>
                  {task.description.split(' ').slice(0, 30).join(' ')}
                </Text>
              )}
            </View>
          </View>
          {/* ---------------------------- assigned users  ---------------------------------------------------- */}
          
          <View style={style.assinee_con}>
            <View style={style.assigned_heades}>
              <Text style={style.assigned_text}>Assigned to :</Text>
              {state.user_id === task.creator ? (
                <TouchableOpacity
                  style={style.reassigne_btn}
                  onPress={() => {
                    setModalVisible(true);
                  }}>
                  <View>
                    <Text style={style.reassigneText}> Reassigne </Text>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={style.assigned_Con}>
              {assignedUsers.length ? (
                assignedUsers.map((ele, i) => {
                  return (
                    <View key={i} style={style.oneUser}>
                      <Text style={style.oneUser_text}> {ele.user_name} </Text>
                    </View>
                  );
                })
              ) : (
                <Text>There is no user assigned to this task</Text>
              )}
            </View>
          </View>

          {/* -------------------------------- comments  ------------------------------------------------ */}

          <View>
            <Comments
              navigation={navigation}
              id={task.task_id}
              type="task"
              taskCreator={task.creator}
              userId={state.user_id}
              userName={state.user_name}
            />
          </View>

          {/* --------------------------------- Modal ----------------------------------------------- */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}>
            <View style={style.centeredView2}>
              <View style={style.modalView}>
                <View style={style.button_con}>
                  <Pressable style={style.button} onPress={handleReassigne}>
                    <Text style={style.textStyle}>Save</Text>
                  </Pressable>
                </View>
                <View style={style.assignedCon}>
                  <View style={style.assignedPicker}>
                    <DropDownPicker
                      open={open}
                      value={selctedUsers}
                      items={users}
                      setOpen={setOpen}
                      setValue={setSelctedUsers}
                      setItems={setUsers}
                      multiple={true}
                      min={0}
                      schema={{
                        label: 'user_name',
                        value: 'user_id',
                      }}
                      placeholder="Select Users"
                      searchable={true}
                      searchPlaceholder="Search by user name"
                      badgeStyle={{
                        padding: 5,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                      }}
                      badgeColors={['white']}
                      badgeDotColors={['red']}
                      badgeTextStyle={{
                        fontStyle: 'italic',
                        color: 'blue',
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={statusModalVisible}>
            <View style={style.centeredView2}>
              <View style={style.modalViewStatus}>
                <View style={style.button_con}>
                  <Pressable style={style.button} onPress={changeStatus}>
                    <Text style={style.textStyle}>Save</Text>
                  </Pressable>
                </View>
                <View style={{padding: 10}}>
                  <RadioButton.Group
                    onValueChange={value => setChecked(value)}
                    value={checked}>
                    <RadioButton.Item
                      label="on hold"
                      value="on hold"
                      style={style.radio}
                    />
                    <RadioButton.Item
                      label="progress"
                      value="progress"
                      style={style.radio}
                    />
                    <RadioButton.Item
                      label="completed"
                      value="completed"
                      style={style.radio}
                    />
                  </RadioButton.Group>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      ) : null}
    </ScrollView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
  },
  headrs: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 25,
    borderBottomWidth: 2,
    borderColor: '#eee',
  },
  subject_text: {
    width: '50%',
    fontSize: 22,
    color: 'black',
  },
  actions: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  delete_btn: {
    paddingTop: 5,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: '#ff5252',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ff5252',
  },
  claim_btn: {
    marginRight: 20,
    paddingTop: 5,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: '#2A416A',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#2A416A',
  },
  deleteText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
  },
  /* ------------------------- body ------------------------------------- */

  body: {
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderColor: '#eee',
  },

  high: {
    color: '#ff5252',
    fontSize: 15,
  },
  meduim: {
    color: '#fb8c00',
    fontSize: 15,
  },
  low: {
    color: '#4caf50',
    fontSize: 15,
  },

  /* -------------------------------------------------------------- */
  assinee_con: {
    marginTop: 25,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderColor: '#eee',
  },

  reassigne_btn: {
    marginTop: 5,
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 6,
    paddingLeft: 6,
    backgroundColor: '#2A416A',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#2A416A',
  },
  reassigneText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  assigned_heades: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assigned_text: {
    width: '73%',
    fontSize: 18,
    color: 'black',
    margin: 4,
  },
  assigned_Con: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // paddingHorizontal: 10,
  },
  oneUser: {
    padding: 5,
    margin: 4,
    backgroundColor: '#1867c0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#1867c0',
  },
  oneUser_text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  /* ---------------------------------------------------------- */
  centeredView2: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '100%',
    height: 550,
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
  modalViewStatus: {
    width: '100%',
    height: 280,
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
  button_con: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '90%',
    backgroundColor: '#009688',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#009688',
  },
  textStyle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  assignedCon: {
    width: '100%',
    // flex: 1,
    marginTop: 15,
    paddingBottom: 20,
    height: 500,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  assignedPicker: {
    width: '90%',
  },
  /* ---------------------------------------------------------- */
});

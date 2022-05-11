import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import axios from 'axios';

export default function CommentReplay({
  replay,
  comments,
  setComments,
  taskCreator,
  userId,
}) {
  const [updateText, setUpdateText] = useState(false);
  const [str, setStr] = useState('');

  useEffect(() => {
    setStr(replay.comment);
  }, [replay]);

  const handleInput = text => {
    setStr(text);
  };

  const openDialogDeleteReplay = () => {
    Alert.alert('Delete this replay', `Do you want to delete this replay ?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'Yes', onPress: deleteReplay},
    ]);
  };

  /* ---------------------------------- delete replay --------------------------- */

  const deleteReplay = async () => {
    try {
      const response = await axios.delete(
        `http://192.168.85.37:30122/comments/deleteReplay/${replay.replay_id}`,
      );
      if (response.status === 200) {
        const arr = comments.map(ele => {
          if (ele.comment.comment_id === replay.comment_id) {
            console.log('iam here');
            return {
              ...ele,
              replays: ele.replays.filter(el => {
                return el.replay_id !== replay.replay_id;
              }),
            };
          } else {
            return ele;
          }
        });
        setComments(arr);
      }
    } catch (error) {}
  };

  /* ---------------------------------- update replay --------------------------- */

  const updateReplay = async () => {
    try {
      const res = await axios.put(
        `http://192.168.85.37:30122/comments/updateReplay/${replay.replay_id}`,
        {newComment: str},
      );
      if (res.status === 200) {
        const arr = comments.map(ele => {
          if (ele.comment.comment_id === replay.comment_id) {
            return {
              ...ele,
              replays: ele.replays.map(item => {
                if (item.replay_id === replay.replay_id) {
                  console.log('here');
                  console.log(item);
                  return {...item, comment: str};
                } else {
                  return item;
                }
              }),
            };
          } else {
            return ele;
          }
        });
        setUpdateText(false);
        setComments(arr);
      }
    } catch (error) {}
  };

  /* ----------------------------------------------------------------------------------------------- */

  return (
    <View style={style.comment}>
      <View
        style={{
          width: '22%',
        }}>
        <Image
          style={{width: 50, height: 50, borderRadius: 25, marginTop: 5}}
          source={{
            uri: `https://randomuser.me/api/portraits/men/10.jpg`,
          }}
        />
      </View>
      <View style={{width: '70%'}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={style.userName}> {replay.user_name} </Text>
          <View style={{flexDirection: 'row'}}>
            {userId === replay.user_id ? (
              <>
                <Icon
                  name="pencil"
                  style={{marginRight: 15}}
                  size={18}
                  color="#009688"
                  onPress={() => {
                    setUpdateText(!updateText);
                  }}
                />
                <Icon
                  name="close"
                  size={18}
                  style={{color: 'red'}}
                  onPress={openDialogDeleteReplay}
                />
              </>
            ) : null}
          </View>
        </View>
        {!updateText ? (
          <Text style={style.text}> {replay.comment} </Text>
        ) : (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: '70%'}}>
              <TextInput
                onChangeText={handleInput}
                value={str}
                placeholder="new comment"
              />
            </View>
            <Icon
              name="check"
              size={20}
              style={{color: 'blue'}}
              onPress={updateReplay}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  comment: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    // alignItems: 'center',
    minHeight: 90,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderColor: '#eee',
  },
  userName: {
    width: '80%',
    fontSize: 14,
    color: 'black',
  },
  text: {
    marginTop: 10,
    color: 'black',
    fontSize: 12,
  },
});

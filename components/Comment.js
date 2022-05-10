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

export default function Comment({
  comment,
  comments,
  setComments,
  taskCreator,
  userId,
}) {
  const [updateText, setUpdateText] = useState(false);
  const [str, setStr] = useState('');

  useEffect(() => {
    if (comment) {
      setStr(comment.comment.comment);
      console.log(taskCreator);
      console.log(userId);
    }
  }, [comment]);

  const handleInput = text => {
    setStr(text);
  };

  /* -------------------------- delte task ----------------------------------- */

  const openDialogDeleteComment = () => {
    Alert.alert('Delete this comment', `Do you want to delete this comment ?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'Yes', onPress: deleteComment},
    ]);
  };

  const deleteComment = async () => {
    try {
      const response = await axios.delete(
        `http://192.168.85.37:30122/comments/deleteComment/${comment.comment.comment_id}`,
      );
      if (response.status === 200) {
        setComments(
          comments.filter(ele => {
            return comment.comment.comment_id !== ele.comment.comment_id;
          }),
        );
      }
    } catch (error) {
      console.log('error');
    }
  };

  /* ---------------------------- update comment -------------------------------------------- */

  const updateComment = async () => {
    try {
      console.log('clicked');
      const response = await axios.put(
        `http://192.168.85.37:30122/comments/updateComment/${comment.comment.comment_id}`,
        {
          newComment: str,
        },
      );
      if (response.status === 200) {
        const arr = comments.map((ele, i) => {
          if (comment.comment.comment_id === ele.comment.comment_id) {
            return {...ele, comment: {...ele.comment, comment: str}};
          } else {
            return ele;
          }
        });
        setComments(arr);
        setUpdateText(false);
      }
    } catch (error) {
      console.log('error');
    }
  };

  return (
    <View style={style.comment}>
      <View
        style={{width: '22%', justifyContent: 'center', alignItems: 'center'}}>
        <Image
          style={{width: 60, height: 60, borderRadius: 30}}
          source={{
            uri: `https://randomuser.me/api/portraits/men/10.jpg`,
          }}
        />
      </View>
      <View style={{width: '70%'}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={style.userName}> {comment.comment.user_name} </Text>
          <View style={{flexDirection: 'row'}}>
            {userId === taskCreator ? (
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
                  onPress={openDialogDeleteComment}
                />
              </>
            ) : null}
          </View>
        </View>
        {!updateText ? (
          <Text style={style.text}> {comment.comment.comment} </Text>
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
              onPress={updateComment}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  comment: {
    backgroundColor:"white",
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    minHeight: 90,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderColor: '#eee',
  },
  userName: {
    width: '80%',
    fontSize: 16,
    color: 'black',
  },
  text: {
    marginTop: 10,
    color: 'black',
    fontSize: 13,
  },
});

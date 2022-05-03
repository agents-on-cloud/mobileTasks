const initialState = {
  token: '',
  user_id: "user_id 1",
  user_name: "user_name 1 ",
};

export const setToken = (token, user_id, user_name) => {
  return {
    type: 'SET_TOKEN',
    payload: {token, user_id, user_name},
  };
};

const login = (state = initialState, {type, payload}) => {
  switch (type) {
    case 'SET_TOKEN':
      return {
        token: payload.token,
        user_id: payload.user_id,
        user_name: payload.user_name,
      };
    default:
      return state;
  }
};

export default login;

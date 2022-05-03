const initialState = {
  fixTasks: [],
  fixSearchTasks: [],
  tasks: [],
};

export const getAssignedTaskas = data => {
  console.log(data.length);
  return {
    type: 'GET_ASSIGNED',
    payload: {data: data},
  };
};

export const getGeneralTaskas = data => {
  console.log(data.length);
  return {
    type: 'GET_GENERAL',
    payload: {data: data},
  };
};

const tasks = (state = initialState, {type, payload}) => {
  switch (type) {
    case 'GET_ASSIGNED':
      return {
        fixTasks: payload.data,
        fixSearchTasks: payload.data,
        tasks: payload.data,
      };
    case 'GET_GENERAL':
      return {
        fixTasks: payload.data,
        fixSearchTasks: payload.data,
        tasks: payload.data,
      };
    default:
      return state;
  }
};

export default tasks;

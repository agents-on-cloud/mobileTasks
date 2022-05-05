const initialState = {
  fixTasks: [],
  fixSearchTasks: [],
  tasks: [],
};

export const getTaskas = data => {
  console.log(data.length);
  return {
    type: 'SET_TASKS',
    payload: {data: data},
  };
};

export const getAllTasks = () => {
  return {
    type: 'SET_ALL_TASKS',
    payload: {},
  };
};

export const getTodayTasks = () => {
  let todayDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .substr(0, 10);

  return {
    type: 'SET_FILTER_TASKS',
    payload: {data: todayDate},
  };
};

export const getTomorrowTasks = () => {
  const todayDate = new Date(
    Date.now() - new Date().getTimezoneOffset() * 60000,
  )
    .toISOString()
    .substr(0, 10);
  let dateOffset = 24 * 60 * 60 * 1000 * 1;
  let myDate = new Date(todayDate);
  let tomorrow = new Date(myDate.setTime(myDate.getTime() + dateOffset))
    .toISOString()
    .substr(0, 10);
  return {
    type: 'SET_FILTER_TASKS',
    payload: {data: tomorrow},
  };
};

export const getThisWeek = () => {
  const todayDate = new Date(
    Date.now() - new Date().getTimezoneOffset() * 60000,
  )
    .toISOString()
    .substr(0, 10);
  let dateOffset = 24 * 60 * 60 * 1000 * 7;
  let myDate = new Date(todayDate);
  let thisWeak = new Date(myDate.setTime(myDate.getTime() + dateOffset))
    .toISOString()
    .substr(0, 10);
  return {
    type: 'SET_THIS_WEEK',
    payload: {todayDate, thisWeak},
  };
};

export const getLastWeek = () => {
  const todayDate = new Date(
    Date.now() - new Date().getTimezoneOffset() * 60000,
  )
    .toISOString()
    .substr(0, 10);
  let dateOffset = 24 * 60 * 60 * 1000 * 7;
  let myDate = new Date(todayDate);
  let lastWeak = new Date(myDate.setTime(myDate.getTime() - dateOffset))
    .toISOString()
    .substr(0, 10);
  return {
    type: 'SET_LAST_WEEK',
    payload: {todayDate, lastWeak},
  };
};

const tasks = (state = initialState, {type, payload}) => {
  switch (type) {
    case 'SET_TASKS':
      return {
        fixTasks: payload.data,
        fixSearchTasks: payload.data,
        tasks: payload.data,
      };
    case 'SET_FILTER_TASKS':
      const arr = state.fixTasks.filter(element => {
        return element.due_date === payload.data;
      });
      return {
        tasks: arr,
        fixSearchTasks: arr,
        fixTasks: state.fixTasks,
      };
    case 'SET_ALL_TASKS':
      return {
        tasks: state.fixTasks,
        fixSearchTasks: state.fixTasks,
        fixTasks: state.fixTasks,
      };
    case 'SET_THIS_WEEK':
      const filterThisWeek = state.fixTasks.filter(element => {
        return (
          payload.todayDate <= element.due_date &&
          payload.thisWeak >= element.due_date
        );
      });
      return {
        tasks: filterThisWeek,
        fixSearchTasks: filterThisWeek,
        fixTasks: state.fixTasks,
      };
    case 'SET_LAST_WEEK':
      const filterLastWeek = state.fixTasks.filter(element => {
        return (
          element.due_date >= payload.lastWeak &&
          element.due_date < payload.todayDate
        );
      });
      return {
        tasks: filterLastWeek,
        fixSearchTasks: filterLastWeek,
        fixTasks: state.fixTasks,
      };
    default:
      return state;
  }
};

export default tasks;

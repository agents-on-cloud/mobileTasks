// import {createStore, combineReducers} from 'redux';
import {combineReducers} from 'redux';

import {configureStore} from '@reduxjs/toolkit';

import login from './login';
import tasks from './tasks';

const reducers = combineReducers({login, tasks});
// const store = createStore(reducers);
const store = configureStore({
  reducer: reducers,
});

export default store;

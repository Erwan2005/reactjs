import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import axios from 'axios';
import apiService from '../APIService';

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("http://127.0.0.1:8000/authenticate/", user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};
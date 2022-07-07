import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import { addPub,addUsers, addStory } from "./allRedux"
import { publicRequest } from '../requestMethods';

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("authenticate/", user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};

export const getpublication = async (dispatch) => {
  try {
    const res = await publicRequest.get("userapp/publication?page=1");
    res.data.results && res.data.results.map(pub =>{
      dispatch(addPub(pub));
    })
  } catch (err) {
    console.log(err)
  }
};

export const getUsers = async (dispatch) => {
  try {
    const res = await publicRequest.get("userapp/users");
    res.data && res.data.map(user =>{
      dispatch(addUsers(user));
    })
  } catch (err) {
    console.log(err)
  }
};

export const getStory = async (dispatch) => {
  try {
    const res = await publicRequest.get("userapp/story");
    res.data && res.data.map(story =>{
      dispatch(addStory(story));
    })
  } catch (err) {
    console.log(err)
  }
};

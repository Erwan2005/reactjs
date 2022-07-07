import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import { addPub } from "./pubRedux"
import { publicRequest,userRequest } from '../requestMethods';

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
    const res = await userRequest.get("userapp/publication?page=1");
    res.data.results && res.data.results.map(pub =>{
      dispatch(addPub(pub));
    })
  } catch (err) {
    console.log(err)
  }
};
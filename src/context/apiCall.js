import { loginFailure, loginStart, loginSuccess } from "./userRedux";
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
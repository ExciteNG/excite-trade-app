/** @format */
import { combineReducers } from "redux";
import { LoginReducer, RegisterReducer, UserInfoReducer } from "./UserReducer";

const rootReducer = combineReducers({
  registerReducer: RegisterReducer,
  loginReducer: LoginReducer,
  userReducer: UserInfoReducer,
});

export default rootReducer;

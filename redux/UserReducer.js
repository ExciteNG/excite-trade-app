/** @format */

export const RegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case "SIGN_UP_REQUEST":
      return {
        loading: true,
      };
    case "SIGN_UP_SUCCESS":
      return {
        loading: false,
        success: true,
        userInfo: action.payload,
      };
    case "SIGN_UP_FAIL":
      return {
        loading: false,
        success: false,
        userInfo: null,
        error: action.payload,
      };
    case "SIGN_UP_RESET":
      return {
        loading: false,
        success: false,
        userInfo: null,
        error: null,
      };
    default:
      return state;
  }
};

export const LoginReducer = (state = {}, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return {
        loading: true,
      };
    case "LOGIN_SUCCESS":
      return {
        loading: false,
        success: true,
        userInfo: action.payload,
      };
    case "LOGIN_FAIL":
      return {
        loading: false,
        success: false,
        userInfo: null,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        userInfo: null,
        accessToken: null,
      };
    default:
      return state;
  }
};

export const UserInfoReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_USER_REQUEST":
      return {
        loading: true,
      };
    case "GET_USER_SUCCESS":
      return {
        loading: false,
        userInfo: action.payload,
      };
    case "GET_USER_FAIL":
      return {
        loading: false,
        error: action.payload,
        userInfo: null,
      };
    case "GET_USER_RESET":
      return {
        loading: false,
        error: null,
        userInfo: null,
      };
    default:
      return state;
  }
};

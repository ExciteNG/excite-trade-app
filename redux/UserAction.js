/** @format */
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import url from "../screens/url";

// ? get user profile
export const GetUserProfile = () => async (dispatch) => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const token = JSON.parse(accessToken);

  try {
    dispatch({ type: "GET_USER_REQUEST" });
    const { data } = await axios.get(`${url}/user/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    dispatch({ type: "GET_USER_SUCCESS", payload: data?.payload });
  } catch (error) {
    console.log(error);
    dispatch({
      type: "GET_USER_FAIL",
      payload:
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred",
    });
  }
};

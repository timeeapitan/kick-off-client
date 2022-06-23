import axios from "axios";
import AuthenticationService from "./AuthenticationService";

export const loginUser = async (username, password) => {
  await loginUserWithToken(username, password);

  const token = sessionStorage.getItem("token");

  return axios
    .get("http://localhost:8080/user/login/?username=" + username, {
      headers: { Authorization: token },
    })
    .then((res) => {
      console.log(res);
      AuthenticationService.registerSuccessfulLogin(username);
      getUserInfo();
      return res;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const loginUserWithToken = async (username, password) => {
  return axios
    .post("http://localhost:8080/authenticate", {
      username: username,
      password: password,
    })
    .then((response) => {
      sessionStorage.setItem("username", username);
      let token = "Bearer " + response.data.token;
      sessionStorage.setItem("token", token);
      return response;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const registerUser = async (
  firstName,
  lastName,
  email,
  username,
  password
) => {
  return axios
    .post("http://localhost:8080/register", {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: password,
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const sendEmail = async (toEmail, subject, body) => {
  const token = sessionStorage.getItem("token");

  return axios
    .post("http://localhost:8080/email/contact-us-message", null, {
      params: { toEmail, subject, body },
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

const getUserInfo = async () => {
  const token = sessionStorage.getItem("token");

  await axios
    .get(
      "http://localhost:8080/user/getUserByUsername?username=" +
        sessionStorage.getItem("username"),
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((response) => {
      sessionStorage.setItem(
        "fullName",
        response.data.firstName + " " + response.data.lastName
      );
    })
    .catch((err) => {
      throw new Error(err);
    });
};

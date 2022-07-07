import { Component } from "react";

class AuthenticationService extends Component {
  isUserLoggedIn() {
    let user = sessionStorage.getItem("authenticatedUser");
    if (user === null) {
      return false;
    }
    return true;
  }

  logout() {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("authenticatedUser");
    sessionStorage.removeItem("fullName");
  }

  registerSuccessfulLogin(username) {
    sessionStorage.setItem("authenticatedUser", username);
  }
}

export default new AuthenticationService();

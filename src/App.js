import { createTheme, ThemeProvider } from "@material-ui/core";
import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Chat from "./components/Chat.js";
import EditMatchForm from "./components/EditMatchForm.js";
import MatchForm from "./components/MatchForm.js";
import Notification from "./components/Notification.js";
import ContactPage from "./pages/ContactPage";
import ExplorePage from "./pages/ExplorePage";
import FriendProfilePage from "./pages/FriendProfilePage.js";
import FriendsPage from "./pages/FriendsPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage.js";
import MatchesPage from "./pages/MatchesPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage.js";
import TeamsPage from "./pages/TeamsPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4169E1",
    },
    secondary: {
      main: "#006064",
    },
  },
  typography: {
    fontFamily: "Quicksand",
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route exact path="/">
            <LoginPage />
          </Route>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/register">
            <RegisterPage />
          </Route>
          <Route exact path="/contact-us">
            <ContactPage />
          </Route>
          <Route exact path="/about">
            <HomePage />
          </Route>
          <Route exact path="/explore">
            <ExplorePage />
          </Route>
          <Route exact path="/matches">
            <MatchesPage />
          </Route>
          <Route exact path="/teams">
            <TeamsPage />
          </Route>
          <Route exact path="/schedule">
            <MatchForm />
          </Route>
          <Route exact path="/edit-match/:id">
            <EditMatchForm />
          </Route>
          <Route exact path="/profile">
            <ProfilePage />
          </Route>
          <Route exact path="/friends">
            <FriendsPage />
          </Route>
          <Route exact path="/chat-try-room">
            <Chat />
          </Route>
          <Route exact path="/notification">
            <Notification />
          </Route>
          <Route exact path="/friend-profile/:id">
            <FriendProfilePage />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;

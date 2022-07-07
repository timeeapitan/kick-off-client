import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import logo from "../assets/logo/logo.png";
import new_logo from "../assets/logo/new_logo.png";
import AuthenticationService from "../service/AuthenticationService";
import Notifications from "react-notifications-menu";
import soccerball_notif from "../assets/logo/soccerball_notif.png";

const pages = ["About", "Explore", "Matches", "Teams", "Contact us"];
const settings = ["Profile", "Friends", "Logout"];
const loginRegisterPages = ["Login", "Register"];

const MyAppBar = () => {
  const history = useHistory();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    sessionStorage.getItem("authenticatedUser") != null
  );

  const [fullName, setFullName] = useState(sessionStorage.getItem("fullName"));
  const [userId, setUserId] = useState(null);
  const [fakePictureSrc, setFakePictureSrc] = useState("");
  const [hasProfilePicture, setHasProfilePicture] = useState(true);
  const token = sessionStorage.getItem("token");
  const [currentUser, setCurrentUser] = useState("");
  const [username, setUsername] = useState(sessionStorage.getItem("username"));
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [displayedNotifications, setDisplayedNotifications] = useState([]);

  useEffect(() => {
    getUser(username);
  }, [username != null]);

  useEffect(() => {
    if (userId != null) {
      handleGetImage();
    }
  }, [userId]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getAllNotifications();
  //   }, 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [currentUser]);

  const getUser = async (username) => {
    await axios
      .get(
        "http://localhost:8080/user/getUserByUsername?username=" + username,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setCurrentUser(response.data);
        setUserId(response.data.id);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const getAllNotifications = async () => {
    await axios
      .get("http://localhost:8080/notification/getAll", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setNotifications(response.data);
        populateNotifications(response.data);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  function populateNotifications(notifications) {
    var displayedNotif = [];
    for (const notif of notifications) {
      let date = new Date(notif.date);
      let dateNow = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDay();
      let hours = notif.time.slice(0, -6);
      if (
        dateNow.getFullYear() - year === 0 &&
        dateNow.getMonth() - month === 0 &&
        dateNow.getDay() - day === 0
      ) {
        if (
          hours - dateNow.getHours() >= 0 &&
          hours - dateNow.getHours() <= 1
        ) {
          let newNotif = {
            image: "http://127.0.0.1:8887/logo/soccerball_notif.png",
            message: notif.message,
          };
          displayedNotif.push(newNotif);
        }
      }
    }
    setDisplayedNotifications(displayedNotif);
  }

  const handleGetImage = () => {
    return axios
      .get("http://localhost:8080/user/getProfilePicture?id=" + userId, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setFakePictureSrc(response.data);
        console.log(fakePictureSrc);
        setHasProfilePicture(true);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    if (page === "Contact us") {
      history.push("/contact-us");
    } else if (page === "About") {
      history.push("/about");
    } else if (page === "Explore") {
      history.push("/explore");
    } else if (page === "Matches") {
      history.push("/matches");
    } else if (page === "Teams") {
      history.push("/Teams");
    }
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLoginButton = () => {
    history.push("/login");
  };

  const handleLogoutButton = () => {
    AuthenticationService.logout();
    setIsUserLoggedIn(false);
    history.push("/login");
  };

  const handleRegisterButton = () => {
    history.push("/register");
  };

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: "#89CFF0",
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="img"
            sx={{ height: 50, display: "flex" }}
            alt="LOGO"
            src={new_logo}
          />

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}>
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => handleCloseNavMenu(page.toString())}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleCloseNavMenu(page.toString())}
                sx={{ my: 2, color: "white", display: "block" }}>
                {page}
              </Button>
            ))}
          </Box>

          {isUserLoggedIn && (
            <>
              <div
                style={{
                  marginRight: 10,
                }}>
                <Notifications
                  data={displayedNotifications}
                  header={{
                    title: "Your notifications",
                    option: {},
                  }}
                  markAsRead={(displayedNotifications) => {
                    setInterval(
                      () => console.log(displayedNotifications),
                      5000
                    );
                  }}
                  // icon={"http://127.0.0.1:8887/logo/notification.png"}
                />
              </div>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {hasProfilePicture && (
                      <Avatar src={currentUser.tablePictureSrc} />
                    )}
                    {!hasProfilePicture && (
                      <Avatar {...stringAvatar(fullName)} />
                    )}
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}>
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => {
                        if (setting === "Profile") {
                          history.push("/profile");
                          handleCloseUserMenu();
                        } else if (setting === "Friends") {
                          history.push("/friends");
                          handleCloseUserMenu();
                        } else if (setting === "Logout") {
                          handleCloseUserMenu();
                          handleLogoutButton();
                        }
                      }}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </>
          )}

          {!isUserLoggedIn && (
            <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "flex" } }}>
              <Button
                onClick={handleLoginButton}
                sx={{ my: 2, color: "white", display: "block" }}>
                {loginRegisterPages[0]}
              </Button>
              <Button
                onClick={handleRegisterButton}
                sx={{ my: 2, color: "white", display: "block" }}>
                {loginRegisterPages[1]}
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default MyAppBar;

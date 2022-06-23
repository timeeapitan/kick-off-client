import Divider from "@material-ui/core/Divider";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import SendIcon from "@material-ui/icons/Send";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Button, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    height: "63vh",
    flexBasis: "100%",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "50vh",
    overflowY: "auto",
  },
  paper: {
    display: "flex",
    justifyContent: "left",
    alignItems: "left",
    textAlign: "left",
    verticalAlign: "left",
    boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: "25px",
    backgroundColor: "blue",
  },
});

const Chat = (props) => {
  const classes = useStyles();
  const [chat, setChat] = useState([]);
  const [rendered, setRendered] = useState(false);
  const [chatAdmin, setChatAdmin] = useState("");
  const [message, setMessage] = useState("");
  const [team, setTeam] = useState("");
  const [refresh, setRefresh] = useState(false);
  const reference = useRef(null);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!rendered) {
      getChatForTeam(props.id);
      setRendered(true);
    }
  }, [chat]);

  useEffect(() => {
    if (reference.current) {
      reference.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [chat]);

  useEffect(() => {
    getChatForTeam(props.id);
  }, [refresh]);

  useEffect(() => {
    getUserByUsername();
  }, []);

  useEffect(() => {
    getTeamById(props.id);
  }, []);

  const getUserByUsername = async () => {
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
        setChatAdmin(response.data);
        console.log(chatAdmin);
      });
  };

  const getChatForTeam = async (id) => {
    await axios
      .get("http://localhost:8080/chat/get-chat?id=" + id, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setChat(response.data);
        console.log(chat.sender);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  };

  const getTeamById = async (id) => {
    await axios
      .get("http://localhost:8080/team/getTeamById?id=" + id, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setTeam(response.data);
        console.log("This is the team: " + team);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  };

  const onSendClick = async () => {
    await axios
      .post(
        "http://localhost:8080/chat/save-chat",
        {
          message: message,
          sender: chatAdmin,
          teamId: team,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setMessage("");
        setRefresh(!refresh);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  return (
    <div>
      <Grid container>
        <Grid item>
          <Grid container component={Paper} className={classes.chatSection}>
            <Grid item xs={9} style={{ flexBasis: "100%", maxWidth: "100%" }}>
              <List className={classes.messageArea}>
                {chat.map((chatInfo, i) => (
                  <ListItem key={chatInfo.id}>
                    <Grid container style={{ flexBasis: "100%" }}>
                      <Grid item xs={12}>
                        <ListItemText
                          align={
                            chatAdmin.username === chatInfo.sender.username
                              ? "right"
                              : "left"
                          }
                          secondary={chatInfo.sender.firstName}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <ListItemText
                          align={
                            chatAdmin.username === chatInfo.sender.username
                              ? "right"
                              : "left"
                          }
                          primary={
                            <Typography
                              variant="body2"
                              color="textPrimary"
                              component="span">
                              {chatInfo.message}
                            </Typography>
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <ListItemText
                          align={
                            chatAdmin.username === chatInfo.sender.username
                              ? "right"
                              : "left"
                          }
                          secondary={chatInfo.time}
                        />
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
                <ListItem ref={reference} />
              </List>
              <Divider />
              <Grid
                container
                style={{ padding: "20px" }}
                alignItems="center"
                spacing={1}>
                <Grid item xs={10}>
                  <TextField
                    label="Type Something"
                    fullWidth
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                  />
                </Grid>
                <Grid item xs={1} alignItems="right">
                  <Button onClick={onSendClick}>
                    <Fab color="primary">
                      <SendIcon />
                    </Fab>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <IconButton size="medium" onClick={props.closeChat}>
            <CloseRoundedIcon
              style={{
                backgroundColor: "red",
                borderRadius: 30,
                fill: "white",
              }}
              fontSize="large"
            />
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
};

export default Chat;

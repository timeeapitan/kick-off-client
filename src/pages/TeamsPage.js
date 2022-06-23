import {
  Button,
  Collapse,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/system";
import CircleIcon from "@mui/icons-material/Circle";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../components/MainLayout";
import Team from "../components/Team";
import Chat from "../components/Chat";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

const useStyles = makeStyles({
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    margin: 30,
  },
  field: {
    marginTop: 20,
    marginBottom: 20,
    display: "block",
  },
  icon: {
    marginRight: 10,
    fontSize: "medium",
  },
  paper: {
    padding: 20,
    margin: 4,
    elevation: 5,
    width: 350,
  },
  box: {
    height: 50,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    margin: 0,
  },
});

const TeamsPage = () => {
  const classes = useStyles();
  const formRef = useRef();

  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");

  const [isClicked, setIsClicked] = useState(false);
  const [color, setColor] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teams, setTeams] = useState([]);
  const [rendered, setRendered] = useState(false);
  const [goToChat, setGoToChat] = useState(false);
  const [teamId, setTeamId] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!rendered) {
      getAllTeams();
      setRendered(true);
    }
  }, [teams, refresh]);

  useEffect(() => {
    getAllTeams();
  }, [refresh, currentUser]);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
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
        console.log(response);
        setCurrentUser(response.data);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const getAllTeams = async () => {
    const token = sessionStorage.getItem("token");
    await axios
      .get(
        "http://localhost:8080/team/getTeamsByAdmin?adminId=" + currentUser.id,
        {
          headers: { Authorization: token },
        }
      )
      .then((response) => {
        setTeams(response.data);
        console.log(response.data);
      });
  };

  const addTeam = async () => {
    await axios
      .post(
        "http://localhost:8080/team/addTeam",
        {
          admin: currentUser,
          name: teamName,
          color: color,
        },
        {
          headers: { Authorization: token },
        }
      )
      .then((response) => {
        console.log(response);
        setRefresh(!refresh);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const handleOnClickButton = () => {
    setIsClicked(!isClicked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleSubmitForm = (event) => {
    event.preventDefault();

    if (formRef.current.reportValidity()) {
      addTeam();
      setIsClicked(false);
      setTeamName("");
      setColor("");
    }
  };

  const handleOnChangeColor = (event) => {
    setColor(event.target.value);
  };

  const handleOnChangeTeamName = (event) => {
    setTeamName(event.target.value);
  };

  const onGoToChatClick = (teamId, openChat) => {
    setGoToChat(openChat);
    setTeamId(teamId);
  };

  return (
    <MainLayout>
      <Grid container className={classes.buttonContainer}>
        <Button
          variant="contained"
          style={{ color: "white" }}
          onClick={handleOnClickButton}>
          Add a new team
        </Button>
      </Grid>
      <Grid container className={classes.buttonContainer}>
        <Collapse in={isClicked}>
          <Container>
            <Paper className={classes.paper}>
              <form
                autoComplete="on"
                onSubmit={handleSubmit}
                required
                ref={formRef}>
                <Typography
                  variant="h6"
                  color="textSecondary"
                  component="h2"
                  gutterBottom
                  className={classes.field}>
                  Team name
                </Typography>
                <TextField
                  onChange={handleOnChangeTeamName}
                  className={classes.field}
                  fullWidth
                  label="Team name"
                  variant="outlined"
                  required
                  value={teamName}
                />
                <Typography
                  variant="h6"
                  color="textSecondary"
                  component="h2"
                  gutterBottom
                  className={classes.field}>
                  Team Color
                </Typography>
                <FormControl className={classes.field} fullWidth required>
                  <InputLabel>Color</InputLabel>
                  <Select
                    label="Color"
                    value={color}
                    onChange={handleOnChangeColor}>
                    <MenuItem value={"white"}>
                      <CircleOutlinedIcon className={classes.icon} />
                      White
                    </MenuItem>
                    <MenuItem value={"yellow"}>
                      <CircleIcon
                        style={{ fill: "yellow" }}
                        className={classes.icon}
                      />
                      Yellow
                    </MenuItem>
                    <MenuItem value={"orange"}>
                      <CircleIcon
                        style={{ fill: "orange" }}
                        className={classes.icon}
                      />
                      Orange
                    </MenuItem>
                    <MenuItem value={"red"}>
                      <CircleIcon
                        style={{ fill: "red" }}
                        className={classes.icon}
                      />
                      Red
                    </MenuItem>
                    <MenuItem value={"violet"}>
                      <CircleIcon
                        style={{ fill: "violet" }}
                        className={classes.icon}
                      />
                      Violet
                    </MenuItem>
                    <MenuItem value={"blue"}>
                      <CircleIcon
                        style={{ fill: "blue" }}
                        className={classes.icon}
                      />
                      Blue
                    </MenuItem>
                    <MenuItem value={"green"}>
                      <CircleIcon
                        style={{ fill: "green" }}
                        className={classes.icon}
                      />
                      Green
                    </MenuItem>
                    <MenuItem value={"black"}>
                      <CircleIcon
                        style={{ fill: "black" }}
                        className={classes.icon}
                      />
                      Black
                    </MenuItem>
                  </Select>
                </FormControl>
                <Box
                  component="span"
                  m={1}
                  className={classes.box}
                  style={{ margin: "0px" }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    onClick={handleSubmitForm}>
                    Done
                  </Button>
                </Box>
              </form>
            </Paper>
          </Container>
        </Collapse>
      </Grid>
      <Grid container>
        <Grid
          container
          justifyContent="space-around"
          style={{ display: "flex" }}
          xs={12}
          md={6}
          lg={6}>
          {teams.map((team) => (
            <div key={team.id}>
              <Grid item xs={12} md={6} lg={6} p={2}>
                <Container style={{ width: 500 }}>
                  <Team
                    key={team.id}
                    teamId={team.id}
                    name={team.name}
                    goToChat={() => onGoToChatClick(team.id, true)}
                    shirt={team.shirt}
                    isExplorePage={false}
                    isTeamsPage={true}
                  />
                </Container>
              </Grid>
            </div>
          ))}
        </Grid>
        <Grid container xs={12} md={6} lg={6}>
          {goToChat && (
            <Chat id={teamId} closeChat={() => setGoToChat(false)} />
          )}
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default TeamsPage;

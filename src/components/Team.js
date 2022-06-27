import { makeStyles } from "@material-ui/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import DialogContentText from "@mui/material/DialogContentText";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import MemberComponent from "./MemberComponent";

const useStyles = makeStyles({
  field: {
    marginTop: 20,
    marginBottom: 20,
    display: "block",
  },
  title: {
    marginTop: 50,
    textDecoration: "underline",
  },
  box: {
    height: 50,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    margin: 0,
  },
  dialogPaper: {
    minHeight: "70vh",
    maxHeight: "70vh",
    minWidth: "80vh",
    maxWidth: "80vh",
  },
});

const Team = (props) => {
  const classes = useStyles();

  const username = sessionStorage.getItem("username");
  const token = sessionStorage.getItem("token");

  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teamAdmin, setTeamAdmin] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(false);

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      getFriends();
    }

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      populateRows(friends);
    }
    return () => {
      ignore = true;
    };
  }, [friends]);

  useEffect(() => {
    getPlayersFromTeam();
    getTeamAdmin();
  }, [refresh]);

  const handleOpenDialog = (event) => {
    setOpen(true);
  };

  const handleCloseDialog = (event, reason) => {
    if (reason && reason == "backdropClick") {
      return;
    }
    setOpen(false);
  };

  const handleOnOpenPopUp = () => {
    setOpenPopUp(true);
  };

  const handleClosePopUp = () => {
    setOpenPopUp(false);
  };

  const getUserId = () => {
    return axios
      .get(
        "http://localhost:8080/user/getUserByUsername?username=" + username,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setId(response.data.id);
      });
  };

  const getFriends = async () => {
    return axios
      .get("http://localhost:8080/friendship/listFriends/?id=" + id, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        const friends = response.data;
        setFriends(friends);
      });
  };

  const getPlayersFromTeam = async () => {
    await axios
      .get(
        "http://localhost:8080/team/getPlayersFromTeam?teamId=" + props.teamId,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setPlayers(response.data);
        console.log("These are the players");
        console.log(players);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const getTeamAdmin = async () => {
    await axios
      .get("http://localhost:8080/user/getTeamAdmin?teamId=" + props.teamId, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setTeamAdmin(response.data);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const addAFriendToTheTeam = async (userId) => {
    await axios
      .post(
        "http://localhost:8080/team/addUserToTeam",
        {
          teamId: props.teamId,
          userId: userId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then(() => {
        setRefresh(!refresh);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const deletePlayerFromTeam = async (userId, teamId) => {
    await axios
      .delete(
        "http://localhost:8080/team/deletePlayerFromTeamWithParams?userId=" +
          userId +
          "&teamId=" +
          teamId,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then(() => {
        setRefresh(!refresh);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  const handleAddFriendsToTeam = () => {
    selectedIds.map((friendId) => {
      addAFriendToTheTeam(friendId);
    });

    handleCloseDialog();
  };

  const columns = [
    { field: "firstName", width: 130 },
    { field: "lastName", width: 130 },
    { field: "username", width: 130 },
  ];

  async function populateRows(friends) {
    var rows = [];
    for (const friend of friends) {
      let array = {
        id: friend.id,
        firstName: friend.firstName,
        lastName: friend.lastName,
        username: friend.username,
      };
      rows.push(array);
    }

    setRows(rows);
  }

  return (
    <div>
      <Accordion style={{ backgroundColor: "#a2c3f5" }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{props.name}</Typography>
          <Box
            component="img"
            sx={{
              height: 25,
              width: 25,
              marginLeft: 1,
            }}
            alt="Team t-shirt"
            src={props.shirt}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            <Grid item xs={12} md={12} lg={12}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h7">Want to chat? </Typography>
                <Button
                  variant="text"
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={props.goToChat}>
                  Go to chat
                </Button>
              </Box>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleOpenDialog}>
                Add members
              </Button>
              <Dialog
                open={open}
                onClose={handleCloseDialog}
                maxWidth={"sm"}
                fullWidth
                classes={{ paper: classes.dialogPaper }}>
                <DialogTitle>
                  Your friends
                  {handleCloseDialog ? (
                    <IconButton
                      aria-label="close"
                      onClick={handleCloseDialog}
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                      }}>
                      <CloseIcon />
                    </IconButton>
                  ) : null}
                </DialogTitle>
                <DialogContent>
                  <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      checkboxSelection
                      hideFooterPagination
                      headerHeight={0}
                      onSelectionModelChange={(ids) => {
                        setSelectedIds(ids);
                      }}
                    />
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button variant="contained" onClick={handleAddFriendsToTeam}>
                    Add friends to your team
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <Typography variant="h7">Admin</Typography>
              <MemberComponent
                user={teamAdmin}
                role="Admin"
                position={teamAdmin.tablePosition}
                src={teamAdmin.tablePictureSrc}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <Typography variant="h7">Members</Typography>
              {players.map((player) => (
                <MemberComponent
                  key={player.id}
                  user={player}
                  role="Member"
                  playerId={player.id}
                  position={player.tablePosition}
                  src={player.tablePictureSrc}
                  isExplorePage={props.isExplorePage}
                  isTeamsPage={props.isTeamsPage}
                  userId={player.id}
                  teamId={props.teamId}
                  deletePlayerFromTeam={() =>
                    deletePlayerFromTeam(player.id, props.teamId)
                  }
                />
              ))}
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="space-around"
              alignItems="center">
              <Tooltip title="Schedule a match">
                <Button
                  style={{ color: "white", backgroundColor: "#5D3FD3" }}
                  variant="contained">
                  <EventAvailableIcon style={{ fill: "white" }} />
                </Button>
              </Tooltip>
              <Tooltip title="Edit team">
                <Button
                  onClick={props.handleOnClickEditButton}
                  style={{ color: "white", backgroundColor: "green" }}
                  variant="contained">
                  <EditIcon style={{ fill: "white" }} />
                </Button>
              </Tooltip>
              <Tooltip title="Delete team">
                <Button
                  onClick={handleOnOpenPopUp}
                  style={{ color: "white", backgroundColor: "red" }}
                  variant="contained">
                  <DeleteIcon style={{ fill: "white" }} />
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
          <Dialog open={openPopUp} onClose={handleClosePopUp}>
            <DialogTitle>{"Delete the team"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the selected team?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={props.handleOnClickDeleteButton} autoFocus>
                Yes
              </Button>
              <Button onClick={handleClosePopUp}>No</Button>
            </DialogActions>
          </Dialog>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Team;

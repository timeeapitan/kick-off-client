import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import DialogContentText from "@mui/material/DialogContentText";
import { makeStyles } from "@mui/styles";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import MainLayout from "../components/MainLayout";

const useStyles = makeStyles({
  box: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
});

const FriendsPage = () => {
  const classes = useStyles();

  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");

  const [friends, setFriends] = useState([]);
  const [id, setId] = useState("");
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [friend, setFriend] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(false);
  const history = useHistory();

  const columns = [
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    { field: "username", headerName: "Username", width: 130 },
    { field: "createdDate", headerName: "Friends since", width: 150 },
  ];

  useEffect(() => {
    getUserId();
    getAllUsers();
  }, []);

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      getFriends();
    }
    return () => {
      ignore = true;
    };
  }, [id, refresh]);

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      populateRows(friends);
    }
    return () => {
      ignore = true;
    };
  }, [friends]);

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

  const getCreatedDate = async (firstUserId, secondUserId) => {
    await axios
      .get(
        "http://localhost:8080/friendship/getDate?firstUserId=" +
          firstUserId +
          "&secondUserId=" +
          secondUserId,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        return response.data;
      });
  };

  const getAllUsers = () => {
    return axios
      .get("http://localhost:8080/user/getAll", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setUsers(response.data);
      });
  };

  const deleteFriendship = async (secondId) => {
    await axios
      .delete(
        "http://localhost:8080/friendship/deleteFriendship?firstUserId=" +
          id +
          "&secondUserId=" +
          secondId,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        setRefresh(!refresh);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const deleteFriends = () => {
    selectedIds.map((friendId) => {
      deleteFriendship(friendId);
    });

    handleClosePopUp();
  };

  const handleSearchFriend = (friend) => {
    let [firstName, lastName] = friend.split(" ");
    console.log(users);
    for (let i = 0; i < users.length; i++) {
      if (users[i].firstName === firstName && users[i].lastName === lastName) {
        console.log("they are alike");
        history.push("/friend-profile/" + users[i].id);
      }
    }
  };

  async function populateRows(friends) {
    var rows = [];
    for (const friend of friends) {
      const date = await getCreatedDate(id, friend.id);

      let array = {
        id: friend.id,
        firstName: friend.firstName,
        lastName: friend.lastName,
        username: friend.username,
        createdDate: moment(date).format("MMMM Do YYYY"),
      };
      rows.push(array);
    }

    setRows(rows);
  }

  return (
    <>
      <MainLayout>
        <Container>
          <Autocomplete
            style={{ marginTop: 20 }}
            freeSolo
            disableClearable
            open={open}
            onInputChange={(_, value) => {
              if (value.length === 0) {
                if (open) setOpen(false);
              } else {
                if (!open) setOpen(true);
              }
              setFriend(value);
              console.log(value);
            }}
            onClose={() => setOpen(false)}
            options={users.map(
              (option) => option.firstName + " " + option.lastName
            )}
            renderInput={(params) => (
              <TextField
                key={params.id}
                {...params}
                label="Search friends"
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleSearchFriend(friend)}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Container>

        <Container>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              hideFooterPagination
              onSelectionModelChange={(ids) => {
                setSelectedIds(ids);
              }}
            />
          </div>
          <Box m={3} className={classes.box}>
            <Button
              startIcon={<DeleteIcon />}
              color="error"
              onClick={handleOnOpenPopUp}>
              Delete friends
            </Button>
          </Box>
        </Container>
        <Dialog open={openPopUp} onClose={handleClosePopUp}>
          <DialogTitle>{"Delete the team"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete these friends?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={deleteFriends} autoFocus>
              Yes
            </Button>
            <Button onClick={handleClosePopUp}>No</Button>
          </DialogActions>
        </Dialog>
      </MainLayout>
    </>
  );
};

export default FriendsPage;

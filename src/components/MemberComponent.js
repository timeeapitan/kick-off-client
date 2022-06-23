import { Avatar, Button, Grid, Paper, Typography } from "@material-ui/core";
import { Box } from "@material-ui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";

const useStyles = makeStyles({
  paper: {
    borderRadius: 40,
    height: 70,
  },
  div: {
    margin: 10,
  },
});

const MemberComponent = (props) => {
  const [likeClicked, setLikeClicked] = useState(false);
  const classes = useStyles();
  const user = props.user;

  return (
    <div className={classes.div}>
      <Paper elevation={1} className={classes.paper}>
        <Box p={1}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            columns={{ xs: 4, sm: 4, md: 4 }}>
            <Grid item>
              <Avatar
                alt="No picture"
                src={props.src}
                sx={{ width: 56, height: 56 }}
              />
            </Grid>
            <Grid item>
              <Typography>{props.position}</Typography>
            </Grid>
            <Grid item>
              <Typography>{user.username}</Typography>
              <Typography>{props.role}</Typography>
            </Grid>
            {!props.isExplorePage && (
              <Grid item>
                <Button
                  disableRipple
                  variant="raised"
                  onClick={() => setLikeClicked(!likeClicked)}>
                  {likeClicked ? (
                    <ThumbUpIcon style={{ fill: "blue" }} />
                  ) : (
                    <ThumbUpOutlinedIcon style={{ fill: "blue" }} />
                  )}
                </Button>
              </Grid>
            )}
            {props.isTeamsPage && (
              <Grid item>
                <IconButton
                  disableRipple
                  variant="raised"
                  onClick={props.deletePlayerFromTeam}>
                  <DeleteIcon style={{ fill: "red" }} />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    </div>
  );
};

export default MemberComponent;

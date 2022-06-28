import { Avatar, Grid, Paper, Typography } from "@material-ui/core";
import { Box } from "@material-ui/system";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  paper: {
    borderRadius: 40,
    height: 70,
  },
  div: {
    margin: 10,
  },
});

const TeamComponent = (props) => {
  const classes = useStyles();
  const team = props.team;

  return (
    <div className={classes.div}>
      <Paper elevation={1} className={classes.paper}>
        <Box p={1}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            columns={{ xs: 4, sm: 4, md: 4 }}>
            <Grid item>
              <Avatar
                alt="No picture"
                src={team.shirt}
                sx={{ width: 56, height: 56 }}
              />
            </Grid>
            <Grid item>
              <Typography>{team.name}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </div>
  );
};

export default TeamComponent;

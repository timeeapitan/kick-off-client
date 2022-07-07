import { Button, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MemberComponent from "./MemberComponent";
import TeamComponent from "./TeamComponent";

const MatchDetails = (props) => {
  return (
    <Dialog
      open={props.openPopUp}
      onClose={props.handleClosePopUp}
      maxWidth="sm"
      fullWidth>
      <DialogTitle style={{ backgroundColor: "#a2c3f5" }}>
        {"Details about the match"}
      </DialogTitle>
      <DialogContent style={{ backgroundColor: "#a2c3f5" }}>
        {props.soloPlayersMode && (
          <>
            <Typography variant="h6">Members</Typography>
            {props.players.map((player, i) => (
              <MemberComponent
                key={i}
                user={{ username: player[2] }}
                position={player[4]}
                src={player[3]}
                isExplorePage={true}
              />
            ))}
          </>
        )}
        {!props.soloPlayersMode && (
          <>
            <Typography variant="h6">Teams</Typography>
            {props.teams.map((team, i) => (
              <TeamComponent key={i} team={team} />
            ))}
          </>
        )}
        <Typography variant="h6">Location notes</Typography>
        <Typography>{props.locationNotes}</Typography>
        <Typography variant="h6">Cost details</Typography>
        <Typography>{props.cost}</Typography>
      </DialogContent>
      <DialogActions style={{ backgroundColor: "#a2c3f5" }}>
        <Button onClick={props.handleClosePopUp}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MatchDetails;

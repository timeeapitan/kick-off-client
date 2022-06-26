import { EmailRounded, HomeRounded } from "@mui/icons-material";
import CallIcon from "@mui/icons-material/Call";
import {
  Button,
  Card,
  CardContent,
  createTheme,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import MainLayout from "../components/MainLayout";
import { sendEmail } from "../service/Service";
import validator from "validator";
import Alert from "@mui/material/Alert";

const ContactPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [emailValidation, setEmailValidation] = useState(true);

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setToEmail(event.target.value);
  };

  const handleBodyChange = (event) => {
    setBody(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleOnClick = (event) => {
    event.preventDefault();
    if (validateEmail(toEmail)) {
      sendEmail(toEmail, subject, body);
      setFirstName("");
      setLastName("");
      setToEmail("");
      setSubject("");
      setBody("");
      setEmailValidation(true);
    } else {
      setEmailValidation(false);
    }
  };

  function validateEmail(email) {
    return validator.isEmail(email);
  }

  return (
    <MainLayout>
      <Grid container spacing={5} style={{ padding: 50, marginBottom: 100 }}>
        <Grid item xs={12} md={12} lg={6}>
          <Typography variant="h3" style={{ marginBottom: 30 }}>
            Contact us
          </Typography>
          <Typography style={{ marginBottom: 30 }}>
            Need to get in touch with us? Either fill out the form with your
            inquiry or give us a call following the information listed below.
          </Typography>
          <Typography
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}>
            <CallIcon style={{ marginRight: 10 }} /> 0753 905 177
          </Typography>
          <Typography
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}>
            <HomeRounded style={{ marginRight: 10 }} /> Petőfi Sándor Street 13,
            Cluj-Napoca 4006103
          </Typography>
          <Typography
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}>
            <EmailRounded style={{ marginRight: 10 }} /> kickoffapp@info.com
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} lg={6}>
          <Card style={{ maxWidth: 700, justifyContent: "center" }}>
            <CardContent style={{ backgroundColor: "#c3bcf7de" }}>
              <Typography gutterBottom variant="h5">
                Leave us a message!
              </Typography>
              <Typography
                gutterBottom
                color="textSecondary"
                variant="body2"
                component="p">
                Fill up the form and our team will get back to you within 24
                hours.
              </Typography>
              <form>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="First Name"
                      placeholder="Enter your first name"
                      variant="outlined"
                      value={firstName}
                      fullWidth
                      required
                      onChange={handleFirstNameChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Last Name"
                      placeholder="Enter your last name"
                      variant="outlined"
                      value={lastName}
                      fullWidth
                      required
                      onChange={handleLastNameChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="email"
                      label="Email"
                      placeholder="Enter your email"
                      variant="outlined"
                      value={toEmail}
                      fullWidth
                      required
                      onChange={handleEmailChange}
                    />
                    {!emailValidation && (
                      <Grid item>
                        <Alert severity="error">Email incorrect!</Alert>
                      </Grid>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Subject"
                      placeholder="Enter a subject"
                      variant="outlined"
                      value={subject}
                      fullWidth
                      required
                      onChange={handleSubjectChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      rows={5}
                      label="Message"
                      placeholder="Enter your message"
                      variant="outlined"
                      value={body}
                      multiline
                      fullWidth
                      required
                      onChange={handleBodyChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleOnClick}>
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default ContactPage;

import React from "react";
import Notifications from "react-notifications-menu";
import MemberComponent from "./MemberComponent";

const Notification = () => {
  return (
    <div style={{ padding: 100 }}>
      <Notifications
        renderItem={<MemberComponent />}
        classNamePrefix="okrjoy"
        headerBackgroundColor="red"
      />
    </div>
  );
};

export default Notification;

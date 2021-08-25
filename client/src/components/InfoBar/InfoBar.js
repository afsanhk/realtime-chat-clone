import React from "react";
import "./InfoBar.cass";

import closeIcon from "../../icons/closeIcon";
import onlineIcon from "../../icons/onlineIcon";

const InfoBar = ({ room }) => {
  <div className="infoBar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" src={onlineIcon} alt="online" />
      <h3>{room}</h3>
    </div>
    <div className="rightInnerContainer">
      <a href="/">
        <img src={closeIcon} alt="close" />
      </a>
    </div>
  </div>;
};

export default InfoBar;

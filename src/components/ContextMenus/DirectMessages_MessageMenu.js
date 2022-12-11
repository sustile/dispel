import React from "react";

import "./DirectMessages_MessageMenu.css";
import useContextMenu from "../Hooks/useContextMenu";

function DirectMessages_MessageMenu() {
  const messageMainCont = document.querySelector(
    ".DirectMessagesBody-MessageWrapper"
  );
  console.log(messageMainCont);
  const [x, y, show] = useContextMenu(messageMainCont);

  return (
    <React.Fragment>
      {show && (
        <div
          className="DirectMessages_MessageContextMenu"
          style={{
            top: y,
            left: x,
          }}
        >
          <div>Button</div>
          <div>Button</div>
          <div>Button</div>
        </div>
      )}
    </React.Fragment>
  );
}

export default DirectMessages_MessageMenu;

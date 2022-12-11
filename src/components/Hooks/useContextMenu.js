import { useEffect, useState } from "react";

function useContextMenu(el) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [show, setShow] = useState(false);

  function clickHandler() {
    show && setShow(false);
  }

  function contextMenuHandler(e) {
    e.preventDefault();

    if (e.target.classList.contains("DirectMessagesBody-Message")) {
      console.log("trigger boi");
    }
    e.pageX + 150 > window.innerWidth
      ? setX(`${window.innerWidth - 180}px`)
      : setX(`${e.pageX}px`);
    e.pageY + 200 > window.innerHeight
      ? setY(`${window.innerHeight - 220}px`)
      : setY(`${e.pageY}px`);

    setShow(true);
  }

  useEffect(() => {
    document.addEventListener("click", clickHandler);
    el.addEventListener("contextmenu", contextMenuHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
      el.removeEventListener("contextmenu", contextMenuHandler);
    };
  });

  return [x, y, show];
}

export default useContextMenu;

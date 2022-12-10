import "./App.css";
import Controls from "./components/Controls/Controls";
import DirectMessages from "./components/Main Content/Direct Messages/DirectMessages";
import ServerMessages from "./components/Main Content/Servers/ServerMessages";
import Nav from "./components/Nav/Nav";
import Sidebar from "./components/Sidebar/Sidebar";
import Home from "./components/Main Content/Home/Home";

import { Route, Routes } from "react-router-dom";

import { useSelector } from "react-redux";
import Main from "./components/Pages/Main/Main";
import Register from "./components/Pages/Register/Register";
import Login from "./components/Pages/Login/Login";

function App() {
  const currentMainCont = useSelector((state) => state.currentMainCont);
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<Main />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;

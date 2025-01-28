import {React, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import { Navbar } from "./Components/Navbar";
import Notification from "./Components/Notification";
import PostForm from "./Components/Postform";
import axios from "axios";
import NotificationDetail from "./Components/NotificationDetail";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      axios.get('http://localhost:80/auth/user', { withCredentials: true })
          .then(response => {
              if (response.data.user) {
                  setIsLoggedIn(true);
              } else {
                  setIsLoggedIn(false);
              }
          })
          .catch(() => setIsLoggedIn(false));
  }, []);

  return (
      <div>
          <BrowserRouter>
              <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              <Routes>
                  {/* <Route path="/" element={<View />}></Route> */}
                  <Route path="/home" element={<Home />} />
                  <Route path="/post" element={<PostForm />} />
                  <Route path="/notification" element={<Notification />} />
                  <Route path="/notification/:postId" element={<NotificationDetail />} />
                  <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
                  <Route path="/signup" element={isLoggedIn ? <Navigate to="/home" /> : <SignUp setIsLoggedIn={setIsLoggedIn} />} />
              </Routes>
          </BrowserRouter>
      </div>
  );
}

export default App;
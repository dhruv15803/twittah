import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AppContextProvider from "./context/AppContext";
import ProtectedRoutes from "./Layouts/ProtectedRoutes";
import Home from "./Pages/Home";
import PostPage from "./Pages/PostPage";
export const backendUrl = "http://localhost:5000";

function App() {
  return (
    <>
      <AppContextProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoutes/>}>
              <Route index element={<Home/>}/>
              <Route path="post/:postId" element={<PostPage/>}/>
            </Route>
          </Routes>
        </Router>
      </AppContextProvider>
    </>
  );
}

export default App;

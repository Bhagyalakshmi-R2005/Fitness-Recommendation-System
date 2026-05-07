import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { setCredentials } from "./store/authSlice";
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import ActivityDetail from './components/ActivityDetail';
function ActivitiesPage() {
  return (
    <Box component="section" sx={{ p: 2, border: '1px solid grey' }}>

      <ActivityForm />
      <ActivityList />
    </Box>
  )
}

function App() {
  const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    if (token && tokenData) {
      localStorage.setItem('token', token);
      localStorage.setItem('userid', tokenData.sub);
      dispatch(setCredentials({
        token,
        user: tokenData
      }));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);
  return (
    <Router>
      {!token ? (
        <Button variant="contained" color="primary"
          onClick={() => {
            logIn();
          }}>Login</Button>
      ) : (
        // <div>
        //   <pre>{JSON.stringify(tokenData, null, 2)}</pre>
        //   <pre>{JSON.stringify(token, null, 2)}</pre>
        // </div>
        <Box component="section" sx={{ p: 2, border: '1px solid grey' }}>
          <Routes>
            <Route path="/activities" element={<ActivitiesPage />}></Route>
            <Route path="/activities/:id" element={<ActivityDetail />}></Route>
            <Route path="/" element={token ? <Navigate to="/activities" replace /> : <div>Welcome! Please login.</div>} />
          </Routes>
        </Box>
      )}
    </Router>
  )
}

export default App

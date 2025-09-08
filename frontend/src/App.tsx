import React, { useContext } from 'react';
import './App.css';
import ImageUpload from './ImageUpload';
import Login from './Login';
import SignUp from './SignUp';
import { AppBar, Toolbar, Typography, Container, createTheme, ThemeProvider, CssBaseline, Button } from '@mui/material';
import { blue, yellow } from '@mui/material/colors';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: yellow[700],
    },
  },
  typography: {
    fontFamily: '"Comic Sans MS", "Chalkboard SE", "cursive"',
    h6: {
        fontWeight: 'bold',
    }
  }
});

const AppContent: React.FC = () => {
  const auth = useContext(AuthContext);

  return (
    <div className="App" style={{ backgroundColor: '#e3f2fd', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ width: '100%', textAlign: 'center', color: 'black', padding:'10px 30px', borderRadius: '20px', fontWeight: 'bold', fontFamily: '"Comic Sans MS"' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Species Explorer</Link>
          </Typography>
          {auth?.token ? (
            <Button color="inherit" onClick={() => auth.setToken(null)}>Logout</Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<ImageUpload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Container>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;

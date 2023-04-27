import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <div>
        <section>
          <Routes>
            <Route path="/" element={ <Navigate replace to="/login" /> } />
            <Route path="/login" element={ <Login /> } />
            <Route path="/signup" element={ <Signup /> } />
            <Route path="/home" element={ <Home /> } />
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
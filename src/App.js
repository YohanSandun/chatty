import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import { BrowserRouter as Router} from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <section>
          <Routes>                                                                        
            <Route path="/" element={<div>Home</div>} />
            <Route path="/signup" element={<div>Signup</div>} />
            <Route path="/home" element={ <Home /> } />
            <Route path="/login" element={<Login />} />
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
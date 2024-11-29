import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Chat from './pages/chat';
import './index.css'; 

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/home" element={<Home />} />          
                    <Route path="/" element={<Login />} />
                    <Route path="/chat/:salaId" element={<Chat />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;

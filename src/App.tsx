import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './ts/firebase';
import SignUp from './components/signup';
import Login from './components/login';
import Dashboard from './components/dashboard';
import CreateRoom from './components/CreateRoom';
import CreateSurveyProject from './components/CreateSurveyProject';
import RoomProjects from './components/RoomProjects';
import ProjectSurveys from './components/ProjectSurveys';
import SurveyControl from './components/SurveyControl';
import SurveyResponse from './components/SurveyResponse';
import JoinRoom from './components/JoinRoom';
import HeaderBefore from './components/HeaderBefore';
import Header from './components/Header';
import './css/style.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false); // ロード完了
    });

    return () => unsubscribe(); // クリーンアップ
  }, []);

  if (loading) {
    return <p>Loading...</p>; // ローディング中の表示
  }

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        {isLoggedIn ? <Header onLogout={handleLogout} /> : <HeaderBefore />}
        <Routes>
          <Route
            path="/"
            element={
              <div style={{ paddingTop: '60px' }}>
                <h1>ライブアンケートへようこそ！</h1>
                <JoinRoom />
              </div>
            }
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/dashboard"
            element={<Dashboard onLogout={handleLogout} />}
          />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/room/:roomId/projects" element={<RoomProjects />} />
          <Route
            path="/project/:roomId/:projectId/surveys"
            element={<ProjectSurveys />}
          />
          <Route
            path="/survey-control/:roomId/:projectId/:surveyId"
            element={<SurveyControl />}
          />
          <Route
            path="/survey/:roomId/:projectId/:surveyId/response"
            element={<SurveyResponse />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

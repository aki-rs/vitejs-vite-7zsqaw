import React from 'react';
import Button from '@mui/material/Button';
import { signOut } from 'firebase/auth';
import { auth } from '../ts/firebase';
import { useNavigate } from 'react-router-dom';
import '../css/style.css';

interface HeaderProps {
  onLogout: () => void; // ログアウト時に呼び出す関数
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully!');
      onLogout(); // ログアウト成功時に状態を更新
      navigate('/');
    } catch (error) {
      alert((error as any).message);
    }
  };

  const handleLogoClick = () => {
    navigate('/dashboard'); // ダッシュボードに移動
  };

  return (
    <header>
      <div className="headerContent">
        <p
          style={{ cursor: 'pointer' }} // ポインタカーソルを追加
          onClick={handleLogoClick} // クリックイベントでダッシュボードに移動
        >
          ライブアンケート
        </p>
        <Button
          variant="outlined"
          onClick={handleLogout}
          className="headbutton"
          sx={{
            color: '#ffffff',
            borderColor: '#ffffff',
            '&:hover': { color: '#a4abb3', borderColor: '#a4abb3' },
          }}
        >
          ログアウト
        </Button>
      </div>
    </header>
  );
};

export default Header;

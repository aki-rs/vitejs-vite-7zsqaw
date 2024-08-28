// src/components/HeaderBefore.tsx
import React from 'react';
import Button from '@mui/material/Button';
import '../css/style.css';

const HeaderBefore: React.FC = () => {
  return (
    <header>
      <div className="headerContent">
        <p>ライブアンケート</p>
        <div className="button-group">
          <Button
            href="/signup"
            sx={{ color: '#ffffff', '&:hover': { color: '#a4abb3' } }}
          >
            サインアップ
          </Button>
          <Button
            variant="outlined"
            href="/login"
            className="headbutton"
            sx={{
              color: '#ffffff',
              borderColor: '#ffffff',
              '&:hover': { color: '#a4abb3', borderColor: '#a4abb3' },
            }}
          >
            サインイン
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HeaderBefore;

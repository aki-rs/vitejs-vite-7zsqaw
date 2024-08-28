import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore, auth } from '../ts/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Button, TextField } from '@mui/material';

const CreateRoom: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState(''); // ルーム名の状態を追加
  const navigate = useNavigate();

  const generateRoomId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleCreateRoom = async () => {
    const newRoomId = generateRoomId();
    const user = auth.currentUser;

    if (user) {
      try {
        await setDoc(doc(collection(firestore, 'rooms'), newRoomId), {
          name: roomName, // ルーム名を保存
          creatorUid: user.uid,
          createdAt: new Date(),
          surveys: [],
        });
        alert(`Room "${roomName}" created with ID: ${newRoomId}`);
        navigate(`/room/${newRoomId}/projects`); // プロジェクト一覧画面にリダイレクト
      } catch (error) {
        console.error('Error creating room:', error);
        alert('Failed to create room. Please try again.');
      }
    } else {
      alert('User not authenticated.');
    }
  };

  return (
    <div className="limit-width flex-column" style={{ padding: '20px' }}>
      <h2>ルーム新規作成</h2>
      <TextField
        label="ルーム名"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)} // ルーム名の入力を設定
        fullWidth
        margin="normal"
      />
      <Button
        variant="outlined"
        onClick={handleCreateRoom}
        sx={{
          color: '#000000',
          borderColor: '#000000',
          '&:hover': { color: '#a4abb3', borderColor: '#a4abb3' },
          marginTop: '10px',
        }}
        disabled={!roomName} // ルーム名が入力されていないとボタンを無効化
      >
        ルームを作る
      </Button>
    </div>
  );
};

export default CreateRoom;

import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { signOut } from 'firebase/auth';
import { auth, firestore } from '../ts/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../css/style.css';

interface DashboardProps {
  onLogout: () => void; // ログアウト時に呼び出す関数
}

interface Room {
  id: string;
  name: string;
  createdAt: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const q = query(
            collection(firestore, 'rooms'),
            where('creatorUid', '==', user.uid)
          );
          const querySnapshot = await getDocs(q);
          const roomList: Room[] = [];
          querySnapshot.forEach((doc) => {
            roomList.push({
              id: doc.id,
              name: doc.data().name || 'Unnamed Room', // ルーム名を取得
              createdAt: doc.data().createdAt.toDate().toLocaleString(),
            });
          });
          setRooms(roomList);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logged out successfully!');
      onLogout();
      navigate('/');
    } catch (error) {
      alert((error as any).message);
    }
  };

  const handleCreateRoomClick = () => {
    navigate('/create-room');
  };

  return (
    <div className="flex-column">
      <div className="flex-column">
        <h2>ルームを作成する</h2>
        <Button
          variant="outlined"
          onClick={handleCreateRoomClick}
          sx={{
            color: '#000000',
            borderColor: '#000000',
            '&:hover': { color: '#a4abb3', borderColor: '#a4abb3' },
          }}
        >
          ルーム作成
        </Button>
      </div>
      <h2>過去のルーム</h2>
      {rooms.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th className="table-column">ルーム名</th>
              <th className="table-column">ルームID</th>
              <th className="table-column">作成日</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className="table-column">
                  <Link to={`/room/${room.id}/projects`}>{room.name}</Link>
                </td>
                <td className="table-column">{room.id}</td>
                <td className="table-column">{room.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>作成されたルームがありません</p>
      )}
      <Button
        variant="outlined"
        onClick={handleLogout}
        sx={{
          color: '#000000',
          borderColor: '#000000',
          '&:hover': { color: '#a4abb3', borderColor: '#a4abb3' },
        }}
      >
        ログアウト
      </Button>
    </div>
  );
};

export default Dashboard;

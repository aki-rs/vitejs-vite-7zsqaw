import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../ts/firebase';
import {
  doc,
  getDoc,
  collection,
  query,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { Button, TextField } from '@mui/material';

interface Project {
  id: string;
  title: string;
  createdAt: string;
}

const RoomProjects: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>(); // URLからルームIDを取得
  const [roomName, setRoomName] = useState(''); // ルーム名の状態を追加
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        if (roomId) {
          // ルームのドキュメントを取得
          const roomDocRef = doc(firestore, 'rooms', roomId);
          const roomDoc = await getDoc(roomDocRef);
          if (roomDoc.exists()) {
            setRoomName(roomDoc.data().name); // ルーム名を状態にセット
          }

          // プロジェクトのリストを取得
          const q = query(collection(firestore, 'rooms', roomId, 'projects'));
          const querySnapshot = await getDocs(q);
          const projectList: Project[] = [];
          querySnapshot.forEach((doc) => {
            projectList.push({
              id: doc.id,
              title: doc.data().title,
              createdAt: doc.data().createdAt.toDate().toLocaleString(),
            });
          });
          setProjects(projectList);
        }
      } catch (error) {
        console.error('Error fetching room details or projects:', error);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  const handleCreateProjectClick = async () => {
    if (newProjectTitle.trim() === '') {
      alert('プロジェクト名を入力してください');
      return;
    }

    try {
      const newProject = {
        title: newProjectTitle,
        createdAt: new Date(),
      };

      const docRef = await addDoc(
        collection(firestore, 'rooms', roomId, 'projects'),
        newProject
      );
      navigate(`/project/${roomId}/${docRef.id}/surveys`); // プロジェクト作成後、そのプロジェクトのアンケート管理画面に遷移
    } catch (error) {
      console.error('Error creating project:', error);
      alert('プロジェクトの作成に失敗しました。');
    }
  };

  return (
    <div className="limit-width" style={{ padding: '20px' }}>
      <h2>{roomName}</h2>
      <h3>ルームID：{roomId}</h3>
      <TextField
        label="新しいプロジェクト名"
        value={newProjectTitle}
        onChange={(e) => setNewProjectTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="outlined"
        onClick={handleCreateProjectClick}
        sx={{
          color: '#000000',
          borderColor: '#000000',
          '&:hover': { color: '#a4abb3', borderColor: '#a4abb3' },
          marginBottom: '20px',
        }}
      >
        プロジェクトを作成
      </Button>
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <strong>プロジェクト名：</strong> {project.title} <br />
              <strong>作成日：</strong> {project.createdAt} <br />
              <Button
                variant="contained"
                onClick={() =>
                  navigate(`/project/${roomId}/${project.id}/surveys`)
                }
                sx={{ marginTop: '10px' }}
              >
                アンケート管理へ
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>プロジェクトがありません</p>
      )}
    </div>
  );
};

export default RoomProjects;

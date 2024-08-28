import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import { firestore } from '../ts/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { Bar } from 'react-chartjs-2';

interface Survey {
  id: string;
  question: string;
  options: string[];
  responses: number[]; // 各選択肢への回答数を格納する配列
}

const JoinRoom: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const [survey, setSurvey] = useState<Survey | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (roomId) {
      const q = query(
        collection(firestore, 'rooms', roomId, 'projects'),
        where('isActive', '==', true) // isActiveがtrueのアンケートを取得
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const surveys: Survey[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          surveys.push({
            id: doc.id,
            question: data.question,
            options: data.options,
            responses: data.responses || new Array(data.options.length).fill(0),
          });
        });
        setSurvey(surveys.length > 0 ? surveys[0] : null);
      });

      return () => unsubscribe(); // クリーンアップ
    }
  }, [roomId]);

  const handleJoinRoom = () => {
    if (roomId.trim() !== '') {
      // ルームに参加するが、アンケートがない場合はそのままメッセージを表示する
      setRoomId(roomId);
    } else {
      alert('ルームIDを入力してください');
    }
  };

  const handleOptionSelect = async (index: number) => {
    if (survey) {
      const updatedResponses = [...survey.responses];
      updatedResponses[index] += 1;

      // Firestoreでアンケートの回答数を更新
      const surveyDocRef = doc(
        firestore,
        'rooms',
        roomId,
        'projects',
        survey.id
      );
      await updateDoc(surveyDocRef, { responses: updatedResponses });

      setSurvey({ ...survey, responses: updatedResponses });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>ルームに参加する</h2>
      <TextField
        label="ルームID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        onClick={handleJoinRoom}
        sx={{ marginTop: '10px' }}
      >
        参加
      </Button>

      {survey ? (
        <div>
          <h3>{survey.question}</h3>
          {survey.options.map((option, index) => (
            <Button
              key={index}
              variant="outlined"
              onClick={() => handleOptionSelect(index)}
              sx={{ margin: '5px' }}
            >
              {option}
            </Button>
          ))}
          <div style={{ marginTop: '20px' }}>
            <h4>リアルタイム結果</h4>
            <Bar
              data={{
                labels: survey.options,
                datasets: [
                  {
                    label: '回答数',
                    data: survey.responses,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  },
                ],
              }}
              options={{ responsive: true }}
            />
          </div>
        </div>
      ) : (
        <p>アンケートが開始されるまでお待ちください</p>
      )}
    </div>
  );
};

export default JoinRoom;

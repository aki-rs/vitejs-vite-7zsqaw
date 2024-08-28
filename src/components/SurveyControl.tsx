// src/components/SurveyControl.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../ts/firebase';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Button } from '@mui/material';

const SurveyControl: React.FC = () => {
  const { roomId, projectId, surveyId } = useParams<{
    roomId: string;
    projectId: string;
    surveyId: string;
  }>();
  const [survey, setSurvey] = useState<any>(null);

  useEffect(() => {
    if (roomId && projectId && surveyId) {
      const surveyDocRef = doc(
        firestore,
        'rooms',
        roomId,
        'projects',
        projectId,
        'surveys',
        surveyId
      );

      const unsubscribe = onSnapshot(surveyDocRef, (doc) => {
        setSurvey(doc.data());
      });

      return () => unsubscribe();
    }
  }, [roomId, projectId, surveyId]);

  const handleStartSurvey = async () => {
    if (survey) {
      const surveyDocRef = doc(
        firestore,
        'rooms',
        roomId,
        'projects',
        projectId,
        'surveys',
        surveyId
      );
      await updateDoc(surveyDocRef, { isActive: true });
    }
  };

  const handleStopSurvey = async () => {
    if (survey) {
      const surveyDocRef = doc(
        firestore,
        'rooms',
        roomId,
        'projects',
        projectId,
        'surveys',
        surveyId
      );
      await updateDoc(surveyDocRef, { isActive: false });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>アンケート管理</h2>
      {survey && (
        <div>
          <h3>{survey.question}</h3>
          <Button
            variant="contained"
            onClick={handleStartSurvey}
            sx={{ marginRight: '10px' }}
          >
            アンケート開始
          </Button>
          <Button variant="outlined" onClick={handleStopSurvey}>
            アンケート停止
          </Button>
        </div>
      )}
    </div>
  );
};

export default SurveyControl;

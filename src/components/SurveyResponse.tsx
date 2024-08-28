// src/components/SurveyResponse.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../ts/firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Button } from '@mui/material';
import { Bar } from 'react-chartjs-2';

const SurveyResponse: React.FC = () => {
  const { roomId, projectId, surveyId } = useParams<{
    roomId: string;
    projectId: string;
    surveyId: string;
  }>();
  const [survey, setSurvey] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

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

  const handleVote = async (option: string) => {
    if (survey) {
      const newVotes = { ...survey.votes, [option]: (survey.votes[option] || 0) + 1 };
      const surveyDocRef = doc(
        firestore,
        'rooms',
        roomId,
        'projects',
        projectId,
        'surveys',
        surveyId
      );
      await updateDoc(surveyDocRef, { votes: newVotes });
      setSelectedOption(option);
    }
  };

  const handleRetractVote = async () => {
    if (survey && selectedOption) {
      const newVotes = { ...survey.votes, [selectedOption]: survey.votes[selectedOption] - 1 };
      const surveyDocRef = doc(
        firestore,
        'rooms',
        roomId,
        'projects',
        projectId,
        'surveys',
        surveyId
      );
      await updateDoc(surveyDocRef, { votes: newVotes });
      setSelectedOption(null);
    }
  };

  const data = {
    labels: survey ? Object.keys(survey.votes) : [],
    datasets: [
      {
        label: '投票数',
        data: survey ? Object.values(survey.votes) : [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{survey?.question}</h2>
      {survey?.isActive && (
        <div>
          {survey.options.map((option: string) => (
            <Button
              key={option}
              variant="contained"
              onClick={() => handleVote(option)}
              disabled={selectedOption !== null}
              sx={{ marginRight: '10px', marginBottom: '10px' }}
            >
              {option}
            </Button>
          ))}
          {selectedOption && (
            <Button
              variant="outlined"
              onClick={handleRetractVote}
              sx={{ marginTop: '10px' }}
            >
              回答を撤回する
            </Button>
          )}
        </div>
      )}
      <h3>投票状況</h3>
      <Bar data={data} />
    </div>
  );
};

export default SurveyResponse;

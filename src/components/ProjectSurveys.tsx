import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../ts/firebase';
import {
  doc,
  getDoc,
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import { Button, TextField } from '@mui/material';

interface Survey {
  id: string;
  question: string;
  options: string[];
  createdAt: string;
  isActive: boolean;
}

const ProjectSurveys: React.FC = () => {
  const { roomId, projectId } = useParams<{
    roomId: string;
    projectId: string;
  }>();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [projectName, setProjectName] = useState('');
  const [newSurveyQuestion, setNewSurveyQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '']); // 最初に2つの選択肢を持つ

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        if (roomId && projectId) {
          // プロジェクトのドキュメントを取得して名前を設定
          const projectDocRef = doc(
            firestore,
            'rooms',
            roomId,
            'projects',
            projectId
          );
          const projectDoc = await getDoc(projectDocRef);
          if (projectDoc.exists()) {
            setProjectName(projectDoc.data().title);
          }

          // アンケートのリストを取得
          const q = query(
            collection(
              firestore,
              'rooms',
              roomId,
              'projects',
              projectId,
              'surveys'
            )
          );
          const querySnapshot = await getDocs(q);
          const surveyList: Survey[] = [];
          querySnapshot.forEach((doc) => {
            surveyList.push({
              id: doc.id,
              question: doc.data().question,
              options: doc.data().options,
              createdAt: doc.data().createdAt.toDate().toLocaleString(),
              isActive: doc.data().isActive || false,
            });
          });
          setSurveys(surveyList);
        }
      } catch (error) {
        console.error('Error fetching project details or surveys:', error);
      }
    };

    fetchProjectDetails();
  }, [roomId, projectId]);

  const handleAddOption = () => {
    setNewOptions([...newOptions, '']);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = newOptions.filter((_, i) => i !== index);
    setNewOptions(updatedOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index] = value;
    setNewOptions(updatedOptions);
  };

  const handleCreateSurvey = async () => {
    if (
      newSurveyQuestion.trim() === '' ||
      newOptions.length < 2 ||
      newOptions.some((option) => option.trim() === '')
    ) {
      alert('質問と最低2つの選択肢を入力してください。');
      return;
    }

    try {
      const newSurvey = {
        question: newSurveyQuestion,
        options: newOptions,
        createdAt: new Date(),
        isActive: false, // アンケートは最初は非アクティブ
      };

      await addDoc(
        collection(
          firestore,
          'rooms',
          roomId,
          'projects',
          projectId,
          'surveys'
        ),
        newSurvey
      );
      alert(`アンケート "${newSurveyQuestion}" を作成しました！`);
      setNewSurveyQuestion('');
      setNewOptions(['', '']); // フォームをリセット

      // アンケートを再取得
      const q = query(
        collection(firestore, 'rooms', roomId, 'projects', projectId, 'surveys')
      );
      const querySnapshot = await getDocs(q);
      const surveyList: Survey[] = [];
      querySnapshot.forEach((doc) => {
        surveyList.push({
          id: doc.id,
          question: doc.data().question,
          options: doc.data().options,
          createdAt: doc.data().createdAt.toDate().toLocaleString(),
          isActive: doc.data().isActive || false,
        });
      });
      setSurveys(surveyList);
    } catch (error) {
      console.error('Error creating survey:', error);
      alert('アンケートの作成に失敗しました。');
    }
  };

  const handleToggleSurvey = async (
    surveyId: string,
    currentStatus: boolean
  ) => {
    try {
      const surveyDocRef = doc(
        firestore,
        'rooms',
        roomId,
        'projects',
        projectId,
        'surveys',
        surveyId
      );
      await updateDoc(surveyDocRef, { isActive: !currentStatus });
      setSurveys((prevSurveys) =>
        prevSurveys.map((survey) =>
          survey.id === surveyId
            ? { ...survey, isActive: !currentStatus }
            : survey
        )
      );
    } catch (error) {
      console.error('Error updating survey status:', error);
      alert('アンケートの状態を更新できませんでした。');
    }
  };

  return (
    <div className="limit-width" style={{ padding: '20px' }}>
      <h2>{projectName} のアンケート一覧</h2>
      <TextField
        label="アンケート質問"
        value={newSurveyQuestion}
        onChange={(e) => setNewSurveyQuestion(e.target.value)}
        fullWidth
        margin="normal"
      />
      {newOptions.map((option, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <TextField
            label={`選択肢 ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            fullWidth
          />
          <Button
            onClick={() => handleRemoveOption(index)}
            disabled={newOptions.length <= 2}
            sx={{ marginLeft: '10px' }}
          >
            削除
          </Button>
        </div>
      ))}
      <Button
        variant="outlined"
        onClick={handleAddOption}
        sx={{ marginTop: '10px' }}
      >
        選択肢を追加
      </Button>
      <Button
        variant="outlined"
        onClick={handleCreateSurvey}
        sx={{
          marginTop: '10px',
          color: '#000000',
          borderColor: '#000000',
          '&:hover': { color: '#a4abb3', borderColor: '#a4abb3' },
        }}
      >
        アンケートを作成
      </Button>
      <h3>既存のアンケート</h3>
      {surveys.length > 0 ? (
        <ul>
          {surveys.map((survey) => (
            <li key={survey.id}>
              <strong>質問：</strong> {survey.question} <br />
              <strong>選択肢：</strong> {survey.options.join(', ')} <br />
              <strong>作成日：</strong> {survey.createdAt} <br />
              <Button
                variant="contained"
                color={survey.isActive ? 'secondary' : 'primary'}
                onClick={() => handleToggleSurvey(survey.id, survey.isActive)}
                sx={{ marginTop: '10px' }}
              >
                {survey.isActive ? 'アンケート終了' : 'アンケート開始'}
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>アンケートがありません</p>
      )}
    </div>
  );
};

export default ProjectSurveys;

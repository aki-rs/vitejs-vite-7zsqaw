import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../ts/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const CreateSurveyProject: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']); // 最初に2つの選択肢を持つ
  const navigate = useNavigate();

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreateSurvey = async () => {
    if (roomId && title && options.length >= 2) {
      try {
        await addDoc(collection(firestore, 'rooms', roomId, 'surveys'), {
          title: title,
          options: options.filter((option) => option !== ''), // 空の選択肢を除外
          createdAt: new Date(),
        });
        alert(`Survey Project "${title}" created!`);
        navigate(`/room/${roomId}/projects`);
      } catch (error) {
        console.error('Error creating survey project:', error);
        alert('Failed to create survey project. Please try again.');
      }
    } else {
      alert(
        'Please fill out the survey title and ensure there are at least 2 options.'
      );
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create a Survey Project for Room: {roomId}</h2>
      <TextField
        label="Survey Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <div>
        {options.map((option, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <TextField
              label={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              fullWidth
            />
            <IconButton
              onClick={() => handleRemoveOption(index)}
              disabled={options.length <= 2} // 最低2つの選択肢が必要
              sx={{ marginLeft: '10px' }}
            >
              <RemoveIcon />
            </IconButton>
          </div>
        ))}
        <Button
          variant="outlined"
          onClick={handleAddOption}
          sx={{ marginTop: '10px' }}
          startIcon={<AddIcon />}
        >
          Add Option
        </Button>
      </div>
      <Button
        variant="outlined"
        onClick={handleCreateSurvey}
        sx={{
          color: '#000000',
          borderColor: '#000000',
          '&:hover': { color: '#a4abb3', borderColor: '#a4abb3' },
          marginTop: '20px',
        }}
      >
        Create Survey Project
      </Button>
    </div>
  );
};

export default CreateSurveyProject;

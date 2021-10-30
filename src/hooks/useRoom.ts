import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { database } from '../services/firebase';

import { useAuth } from './useAuth';

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  },
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
  likes: Record<string, {
    authorId: string;
  }>;
}>  

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  },
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
  likeCount: number;
  likeId: string | undefined;
}

type RoomRootParams = {
  id: string;
}

export function useRoom() {
  
  const { user } = useAuth();
  const { id: roomId } = useParams<RoomRootParams>();
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`/rooms/${roomId}`);
    roomRef.orderByChild('likes').on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions;
     
      const parsedQuestions = Object.entries(firebaseQuestions ?? {})
        .map(([id, question]) => {
          return {
            id,
            likeCount: Object.values(question.likes ?? {}).length,
            likeId: Object.entries(question.likes ?? {}).find(([id, like]) => {
              return like.authorId === user?.id;
            })?.[0],
            ...question,
          }
        })
        .sort((question1, question2) => question2.likeCount - question1.likeCount)
        .sort((question1, question2) => !question1.isHighlighted && question2.isHighlighted ? 1 : 0)
        .sort((question1, question2) => question1.isAnswered ? 1 : 0);

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });

    return () => {
      roomRef.off('value');
    }
  }, [roomId, user?.id]);

  return {
    title,
    questions,
    roomId
  }
}
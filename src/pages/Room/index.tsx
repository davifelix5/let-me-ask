import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logo from '../../assets/img/logo.svg';

import { MainButton } from '../../components/MainButton';
import { Question } from '../../components/Question';
import { RoomCode } from '../../components/RoomCode';

import { useAuth } from '../../hooks/useAuth';

import { database } from '../../services/firebase';

import './styles.scss';

type RoomRootParams = {
  id: string;
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  },
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
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
}

export function Room() {

  const { id: roomId } = useParams<RoomRootParams>();

  const { user } = useAuth();

  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([])
  const [sending, setSending] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`/rooms/${roomId}`);
    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions;
     
      const parsedQuestions = Object.entries(firebaseQuestions ?? {})
        .map(([id, question]) => {
          return {
            id,
            ...question
          }
        });
      
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });
  }, [roomId]);

  async function handleNewQuestion(e: FormEvent) {
    e.preventDefault();
    
    setSending(true);

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('Você deve estar logado para criar uma pergunta!')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    try {
      await database.ref(`rooms/${roomId}/questions`).push(question);
      setNewQuestion('');
    } catch (err) {
      alert('Erro ao enviar a perguntar')
    } finally {
      setSending(false)
    }

  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logo} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span>{questions.length} pergunta{questions.length > 1 && 's'}</span>
          )}
        </div>
        <form onSubmit={handleNewQuestion}>
          <textarea 
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="O que você quer perguntar?" 
          />
          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : <span>Para enviar uma perguntar, <button>faça seu login</button>.</span>}
            <MainButton type="submit" disabled={sending || !newQuestion}>
              Enviar uma pergunta
            </MainButton>
          </div>
        </form>
        <ul className="question">
          {questions.map(question => {
            return (
              <Question 
                content={question.content} 
                author={question.author}
                key={question.id}
              />
            )
          })}
        </ul>
      </main>
    </div>
  )
}
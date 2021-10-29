import { FormEvent, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import logo from '../../assets/img/logo.svg';

import { MainButton } from '../../components/MainButton';
import { Question } from '../../components/Question';
import { RoomCode } from '../../components/RoomCode';

import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';

import { database } from '../../services/firebase';

import './styles.scss';

type RoomRootParams = {
  id: string;
}

export function Room() {

  const { id: roomId } = useParams<RoomRootParams>();

  const { user, signInWithGoogle } = useAuth();

  const { questions, title } = useRoom(roomId);

  const [newQuestion, setNewQuestion] = useState('');
  const [sending, setSending] = useState(false);

  async function handleLogin() {
    try {
      await signInWithGoogle();
    } catch {
      alert('Houve um erro no seu loign. Tente novamente!')
    }
  }

  async function handleNewQuestion(e: FormEvent) {
    e.preventDefault();
    
    setSending(true);

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      alert('Você deve estar logado para criar uma pergunta!');
      return;
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

  async function handleNewLike(questionId: string, likeId: string | undefined ) {
    if (likeId) {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
        .remove();
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`)
        .push({ authorId: user?.id });
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/">
            <img src={logo} alt="Letmeask" />
          </Link>
          <RoomCode code={roomId} />
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala '{title}'</h1>
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
            ) : <span>Para enviar uma perguntar, <button onClick={handleLogin}>faça seu login</button>.</span>}
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
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
                key={question.id}
              >
                {!question.isAnswered && (
                  <button
                    className={`like-button ${question.likeId ? 'liked' : ''}`}
                    type="button"
                    aria-label="Marar como gostei"
                    onClick={() => handleNewLike(question.id, question.likeId)}
                  >
                    {question.likeCount > 0 && <span>{question.likeCount}</span>}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path stroke="#737380" d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button> 
                )}
              </Question>
            )
          })}
        </ul>
      </main>
    </div>
  )
}
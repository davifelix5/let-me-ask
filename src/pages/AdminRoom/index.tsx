import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import logo from '../../assets/img/logo.svg';
import deleteImage from '../../assets/img/delete.svg';

import { MainButton } from '../../components/MainButton';
import { Question } from '../../components/Question';
import { RoomCode } from '../../components/RoomCode';

import { useRoom } from '../../hooks/useRoom';

import { database } from '../../services/firebase';

import './styles.scss';

type RoomRootParams = {
  id: string;
}

export function AdminRoom() {

  const history = useHistory();
  const { id: roomId } = useParams<RoomRootParams>();
  
  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });
    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (!window.confirm('Tem certeza que deseja deletar essa pergunta?')) {
      return;
    }
    await database.ref(`rooms/${roomId}/questions/${questionId}`)
      .remove();
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logo} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <MainButton onClick={handleEndRoom} isOutlined>Encessar sala</MainButton>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala '{title}'</h1>
          {questions.length > 0 && (
            <span>{questions.length} pergunta{questions.length > 1 && 's'}</span>
          )}
        </div>
        <ul className="question">
          {questions.map(question => {
            return (
              <Question 
                content={question.content} 
                author={question.author}
                key={question.id}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                  aria-label="Deletar uma pergunta"
                >
                  <img src={deleteImage} alt="Deleter pergunta" />
                </button>
              </Question>
            )
          })}
        </ul>
      </main>
    </div>
  )
}
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import deleteImage from '../../assets/img/delete.svg';
import answerImage from '../../assets/img/answer.svg';
import checkImage from '../../assets/img/check.svg';

import { MainButton } from '../../components/MainButton';
import { Question } from '../../components/Question';
import { RoomCode } from '../../components/RoomCode';
import { Header } from '../../components/Header';

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

  async function handleCheckQuestionAsAnswered(questionId: string, isQuestionAnswered: boolean) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`)
      .update({
        isAnswered: !isQuestionAnswered,
      });
  }

  async function handleHighlightQuestion(questionId: string, isQuestionHighlighted: boolean) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`)
    .update({
      isHighlighted: !isQuestionHighlighted
    });
  }

  return (
    <div id="page-room">
      <Header>
        <RoomCode code={roomId} />
        <MainButton onClick={handleEndRoom} isOutlined>Encessar sala</MainButton>
      </Header>
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
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
                key={question.id}
              >
                <button
                  type="button"
                  onClick={() => handleCheckQuestionAsAnswered(question.id, question.isAnswered)}
                  aria-label="Destacar uma pergunta"
                >
                  <img src={answerImage} alt="Destacar pergunta" />
                </button>
                {!question.isAnswered && <button
                  type="button"
                  onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                  aria-label="Marcar uma pergunta como respondida"
                >
                  <img src={checkImage} alt="Marcar como respondida pergunta" />
                </button>}
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
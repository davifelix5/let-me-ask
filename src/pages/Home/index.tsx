import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';

import illustrationImg from '../../assets/img/illustration.svg';
import logoImg from '../../assets/img/logo.svg';
import googleIconImg from '../../assets/img/google-icon.svg';

import './styles.scss';

import { MainButton } from '../../components/MainButton';
import { useAuth } from '../../hooks/useAuth';

import { database } from '../../services/firebase';

export function Home() {
  const {
    user,
    signInWithGoogle
  } = useAuth();
  const history = useHistory();

  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle()
    }
    history.push('rooms/create');
  }

  async function handleJoinRoom(e: FormEvent) {
    e.preventDefault();
    
    if (roomCode.trim() === '') {
      return;
    }

    const roomsRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomsRef.exists()) {
      alert('This room does not exist');
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração para perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas de sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Google icon" />
            Cria sua sala com o Google 
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              type="text" 
              placeholder="Digite o código da sala"
            />
            <MainButton type="submit">
              Entrar em uma sala
            </MainButton>
          </form>
      </div>
        </main>
    </div>   
  );
}
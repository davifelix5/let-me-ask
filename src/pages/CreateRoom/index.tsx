import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

import illustrationImg from '../../assets/img/illustration.svg';
import logoImg from '../../assets/img/logo.svg';

import { MainButton } from '../../components/MainButton';

import { useAuth } from '../../hooks/useAuth';

import { database } from '../../services/firebase';

import './styles.scss'

export function CreateRoom() {
  
  const { user } = useAuth();
  const history = useHistory();

  const  [newRoom, setNewRoom] = useState('');

  async function handleCreateRoom(e: FormEvent) {
    e.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }
    
    const roomRef = database.ref('rooms');

    try {
      const firebaseRoom = await roomRef.push({
        title: newRoom,
        authorId: user?.id,
      });
      setNewRoom('');
      history.push(`/admin/rooms/${firebaseRoom.key}`);
    } catch(err) {
      alert('Houve um erro durante a criação da sala!');
    }


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
          <h1>{user?.name}</h1>
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)} 
              type="text" 
              placeholder="Nome da sala"
            />
            <MainButton type="submit">
              Criar sala
            </MainButton>
          </form>
          <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
      </div>
        </main>
    </div>
  );
}
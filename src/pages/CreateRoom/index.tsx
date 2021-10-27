import { Link } from 'react-router-dom';

import illustrationImg from '../../assets/img/illustration.svg';
import logoImg from '../../assets/img/logo.svg';

import { MainButton } from '../../components/MainButton';

import { useAuth } from '../../hooks/useAuth';

import './styles.scss'

export function CreateRoom() {
  
  const { user } = useAuth();

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
          <form>
            <input 
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
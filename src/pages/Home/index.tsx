import { useHistory } from 'react-router-dom';

import { auth, firebase } from '../../services/firebase';

import illustrationImg from '../../assets/img/illustration.svg';
import logoImg from '../../assets/img/logo.svg';
import googleIconImg from '../../assets/img/google-icon.svg';

import './styles.scss';

import { MainButton } from '../../components/MainButton';

export function Home() {
  const history = useHistory();

  function handleCreateRoom() {
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)
      .then(res => {
        console.log(res);
      })

    history.push('rooms/create');
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
          <form>
            <input 
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
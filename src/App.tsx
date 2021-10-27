import { BrowserRouter, Route } from 'react-router-dom';

import { CreateRoom } from "./pages/CreateRoom";
import { Home } from "./pages/Home";

import './global.scss';

import { AuthContextProvider } from './contexts/AuthContext';

function App() {

  return (
    <BrowserRouter>
    <AuthContextProvider>
        <Route path="/" component={Home} exact />
        <Route path="/rooms/create" component={CreateRoom} />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;

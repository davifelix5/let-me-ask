import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { CreateRoom } from "./pages/CreateRoom";
import { Home } from "./pages/Home";
import { Room } from './pages/Room';
import { AdminRoom } from './pages/AdminRoom';

import './global.scss';

import { AuthContextProvider } from './contexts/AuthContext';

function App() {

  return (
    <BrowserRouter>
    <AuthContextProvider>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/rooms/create" component={CreateRoom} />
        <Route path="/rooms/:id" component={Room} />
        <Route path="/admin/rooms/:id" component={AdminRoom} />
      </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;

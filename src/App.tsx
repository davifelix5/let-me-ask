import { BrowserRouter, Route } from 'react-router-dom';

import { CreateRoom } from "./pages/CreateRoom";
import { Home } from "./pages/Home";

import './global.scss';


function App() {
  return (
    <BrowserRouter>
      <Route path="/" component={Home} exact />
      <Route path="/rooms/create" component={CreateRoom} />
    </BrowserRouter>
  );
}

export default App;

import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import logo from '../../assets/img/logo.svg';

import './styles.scss';

type HeaderProps = {
  children: ReactNode,
}

export function Header({ children }: HeaderProps) {
  return (
    <header>
      <div className="content">
        <Link to="/">
          <img src={logo} alt="Letmeask" />
        </Link>
        <div>
          {children}
        </div>
      </div>
    </header>
  );
}
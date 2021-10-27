import { ButtonHTMLAttributes } from 'react';

import './styles.scss';

export function MainButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button id="main-button" {...props}>

    </button>
  );
}
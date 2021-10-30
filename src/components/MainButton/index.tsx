import { ButtonHTMLAttributes } from 'react';

import './styles.scss';

type MainButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean
}

export function MainButton({ isOutlined = false, ...props }: MainButtonProps ) {
  return (
    <button 
      className={`button ${isOutlined ? 'outlined' : ''}`} 
      {...props}
    >

    </button>
  );
}
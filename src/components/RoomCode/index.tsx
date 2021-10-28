import copyImage from '../../assets/img/copy.svg';

import './styles.scss';

type RoomCodeProps = {
  code: string
}

export function RoomCode({ code }: RoomCodeProps) {

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(code);
  }

  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImage} alt="Copy room code" />
      </div>
      <span>Sala #{code}</span>
    </button>
  );
}

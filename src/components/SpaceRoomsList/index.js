import SwitcherFloors from '../SwitcherFloors';

export default function SpaceRoomsList({ openRoom, towerId }) {
  return (
    <div style={{ width: "100%", height: "100%", position: 'relative' }}>
      <SwitcherFloors openRoom={openRoom} />
    </div>
  );
}

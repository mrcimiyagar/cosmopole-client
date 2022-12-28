
import * as React from "react";
import RoomCard from "../RoomCard";
import NewspaperIcon from '../../data/photos/newspaper.png';
import GalleryIcon from '../../data/photos/gallery.png';
import DiscussionIcon from '../../data/photos/discussion.png';

export default function SpacePinnedRooms() {
  return (
    <div style={{width: '100%', paddingBottom: 32}}>
      <RoomCard title={'University Newspaper'} desc={'Main university newspaper publishing hot news...'} Image={NewspaperIcon} />
      <RoomCard title={'University Gallery'} desc={'Best photos captured during last year in out university...'} Image={GalleryIcon} />
      <RoomCard title={'Main Forum'} desc={'Main forum of our university where you can ask experts...'} Image={DiscussionIcon} />
    </div>
  );
}

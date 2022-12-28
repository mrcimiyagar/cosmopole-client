import * as React from 'react';
import { IconButton } from '@mui/material';
import { publish, subscribe, unsubscribe } from '../../core/bus';
import uiEvents from '../../config/ui-events.json';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { comsoToolbarHeight } from '../../components/CosmoToolbar';
import { dbFetchDocById } from '../../core/storage/file';
import { generateFileLink } from '../../core/callables/file';
import { Send } from '@mui/icons-material';
import updates from '../../core/network/updates.json';
import useForceUpdate from '../../utils/ForceUpdate';

let source, docId, images;

function PhotoViewer() {

  const forceUpdate = useForceUpdate();

  const [open, setOpen] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const [images, setImages] = React.useState([]);

  React.useEffect(() => {
    let tokenOpenVideoPlayer = subscribe(uiEvents.OPEN_PHOTO_VIEWER, async ({ source: s, docId: di, allFiles, roomId }) => {
      setOpen(true);
      source = s;
      docId = di;
      let filtered = [];
      let photoIndexTemp = 0;
      let photoCounter = 0;
      for (let i = 0; i < allFiles.length; i++) {
        if ((await dbFetchDocById(allFiles[i]))?.fileType === 'image') {
          if (allFiles[i] === docId) photoIndexTemp = photoCounter;
          filtered.push(generateFileLink(allFiles[i], roomId));
          photoCounter++;
        }
      }
      setPhotoIndex(photoIndexTemp);
      setImages(filtered);
    });
    let tokenNewFile = subscribe(updates.NEW_FILE, () => forceUpdate());
    return () => {
      unsubscribe(tokenOpenVideoPlayer);
      unsubscribe(tokenNewFile);
    };
  }, []);

  return open ? (
    <Lightbox
      reactModalStyle={{
        content: {
          height: `calc(100% - ${comsoToolbarHeight}px)`,
          marginTop: comsoToolbarHeight
        }
      }}
      mainSrc={images[photoIndex]}
      nextSrc={images[(photoIndex + 1) % images.length]}
      prevSrc={images[(photoIndex + images.length - 1) % images.length]}
      onCloseRequest={() => {
        setOpen(false);
        publish(uiEvents.CLOSE_PHOTO_VIEWER, {});
      }}
      onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
      onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
      toolbarButtons={[
        <IconButton onClick={async () => {
          publish(uiEvents.NAVIGATE, { navigateTo: 'Forwarder', docId, docType: (await dbFetchDocById(docId)).fileType });
        }}>
          <Send style={{ fill: '#fff' }} />
        </IconButton>
      ]}
    />
  ) : null;
}

export default PhotoViewer;

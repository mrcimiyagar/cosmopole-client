import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { colors } from '../../config/colors';
import AvatarSample from '../../data/photos/avatar-2.png';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function EyePost() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      style={{
        backgroundColor: colors.pen,
        width: `${window.innerWidth - 32 - 64 - 32}px`, maxWidth: 400, height: 'auto',
        minWidth: 200,
        position: "relative",
        borderRadius: "24px 24px 24px 8px",
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
        paddingBottom: 32
      }}
      elevation={4}
    >
      <CardHeader
        style={{ color: '#fff' }}
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={AvatarSample} />
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon style={{ fill: '#fff' }} />
          </IconButton>
        }
        title="Keyhan Mohammadi"
        subheader={
          <Typography style={{color: '#fff'}} variant={'caption'}>
            September 14, 2016
          </Typography>
        }
      />
      <CardMedia
        component="img"
        height="194"
        image="https://mui.com/static/images/cards/paella.jpg"
        alt="Paella dish"
        style={{borderRadius: 16}}
      />
      <CardContent>
        <Typography variant="body2" style={{ color: '#fff' }}>
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the mussels,
          if you like.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon style={{ fill: '#fff' }} />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon style={{ fill: '#fff' }} />
        </IconButton>
        </CardActions>
    </Card>
  );
}

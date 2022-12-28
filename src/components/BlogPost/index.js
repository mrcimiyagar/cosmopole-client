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
import { red, yellow } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { downloadPreview, generatePreviewLink } from '../../core/callables/file';
import { fetchCurrentRoomId } from '../../core/storage/auth';
import { publish, subscribe } from '../../core/bus';
import uiEvents from '../../config/ui-events.json';
import { colors } from '../../config/colors';
import topics from '../../core/events/topics.json';
import BaseComponent from '../../utils/ComponentEssentials';
import formatDate from '../../utils/DateFormatter';

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

export default class BlogPost extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
        };
    }
    componentDidMount() {
        this.wire(topics.POST_UPDATED, ({ post }) => {
            if (post.id === this.props.post?.id) {
                this.update();
            }
        });
    }
    render() {
        let { post } = this.props;
        let { expanded } = this.state;
        return (
            <Card style={{ width: 'calc(100% - 32px)', marginLeft: 16, marginTop: 16, borderRadius: 16, background: colors.floatingCardSolid }}
                onClick={() => {
                    publish(uiEvents.NAVIGATE, { navigateTo: 'PostEditor', post: post });
                }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: yellow[600] }} aria-label="recipe">
                            C
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon style={{ fill: colors.textPencil }} />
                        </IconButton>
                    }
                    title={<div><Typography style={{
                        color: '#fff',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                    }} variant={'subtitle2'}>{post.blog.title}</Typography></div>}
                    subheader={<Typography style={{ color: '#fff' }} variant={'caption'}>{formatDate(Number(post.time)) + ' ' + (new Date(Number(post.time))).toTimeString().substring(0, 5)}</Typography>}
                />
                <CardMedia
                    component="img"
                    height="194"
                    image={generatePreviewLink(post.coverId, post.blog.roomId)}
                    alt="Paella dish"
                />
                <CardContent>
                    <Typography style={{ color: colors.textPencil, fontSize: 14 }} variant="body2" onClick={() => {
                        publish(uiEvents.NAVIGATE, { navigateTo: 'PostEditor', post: post });
                    }}>
                        {post.title}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon style={{ fill: colors.textPencil }} />
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon style={{ fill: colors.textPencil }} />
                    </IconButton>
                    <ExpandMore
                        expand={expanded}
                        onClick={() => this.setState({ expanded: !expanded })}
                        aria-expanded={expanded}
                    >
                        <ExpandMoreIcon style={{ fill: colors.textPencil }} />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography style={{ color: colors.textPencil }} paragraph>
                            
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>
        );
    }
}

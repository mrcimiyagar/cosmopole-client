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
import { lime, red, yellow } from '@mui/material/colors';
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
import { MailOutline } from '@mui/icons-material';
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

export default class FeedPost extends BaseComponent {
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
            <Card style={{ borderRadius: 16, width: 'calc(100% - 16px)', marginTop: 12, marginLeft: 8, marginRight: 8, background: colors.floatingCardSolid, position: 'relative' }}
                onClick={() => {
                    publish(uiEvents.NAVIGATE, { navigateTo: 'Post', post: post });
                }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: lime[600] }} aria-label="recipe">
                            <MailOutline style={{ fill: '#333' }} />
                        </Avatar>
                    }
                    title={<div><Typography style={{
                        color: '#fff',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                    }} variant={'subtitle2'}>{post.blog.title}</Typography></div>}
                    subheader={<Typography style={{ color: '#fff' }} variant={'caption'}>{formatDate(Number(post.time)) + ' ' + (new Date(Number(post.time))).toTimeString().substring(0, 5)}</Typography>}
                    style={{ width: '100%', height: 100, paddingTop: 0, position: 'absolute', left: 0, top: 0, background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%)' }}
                />
                <CardMedia
                    component="img"
                    height="300"
                    image={generatePreviewLink(post.coverId, post.blog.roomId)}
                    alt="Paella dish"
                    style={{ borderRadius: 16 }}
                />
                <CardActions disableSpacing style={{ height: 40 }}>
                    <Typography style={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        color: colors.textPencil,
                        fontSize: 14,
                        flex: 1
                    }}>
                        {post.title}
                    </Typography>
                    <IconButton onClick={async e => {
                        e.stopPropagation();
                        try {
                            await navigator.share({ title: 'hello', text: 'world', url: 'https://www.google.com' });
                        } catch (error) {
                            console.log('Error sharing: ' + error);
                            return;
                        }
                    }}>
                        <ShareIcon style={{ fill: colors.textPencil, width: 16, height: 16 }} />
                    </IconButton>
                    <ExpandMore
                        expand={expanded}
                        onClick={e => {
                            e.stopPropagation();
                            this.setState({ expanded: !expanded });
                            this.update();
                        }}
                    >
                        <ExpandMoreIcon style={{ fill: colors.textPencil }} />
                    </ExpandMore>
                </CardActions>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography style={{ color: colors.textPencil }} paragraph>

                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>
        );
    }
}

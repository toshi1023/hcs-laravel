import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 200,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  subHeaderTitle: {
    fontSize: 15,
  },
  subHeaderDate: {
    fontSize: 13,
    color: '#808080'
  },
  content: {
      fontSize: 15,
  }
}));

export default function NewsCard() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar} style={{ fontSize: 15 }}>
            警告
          </Avatar>
        }
        title={<Typography className={classes.subHeaderTitle}>Shrimp and Chorizo Paella</Typography>}
        subheader={<Typography className={classes.subHeaderDate}>September 14, 2016</Typography>}
      />
      <CardMedia
        className={classes.media}
        image=""
        title="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
            <span className={classes.content}>
                This impressive paella is a perfect party dish and a fun meal to cook together with your
                guests. Add 1 cup of frozen peas along with the mussels, if you like.
            </span>
        </Typography>
      </CardContent>
    </Card>
  );
}
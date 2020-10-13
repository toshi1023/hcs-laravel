import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function ErrorMessages(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
  
    // stateにerrorの値があればその値を入れてSnackbarをリターン
    if (props.message) {
      return (
        <div className={classes.root}>
          <Snackbar open={open} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              {props.message}
            </Alert>
          </Snackbar>
        </div>
      )
    }
  
    return null
  }
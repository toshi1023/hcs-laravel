import React, { useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { fetchGetInfoMessages, fetchGetErrorMessages, selectInfo, selectError, } from '../../app/appSlice';

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
  message: {
    fontSize: 15,
  },
}));

export default function SnackMessages(props) {
    const classes = useStyles();
    const [infoOpen, setInfoOpen] = React.useState(false);
    const [errorOpen, setErrorOpen] = React.useState(false);
    const dispatch = useDispatch()
    // infoメッセージの格納
    const infoMessages = useSelector(selectInfo)
    // errorメッセージの格納
    const errorMessages = useSelector(selectError)
    // snackBarの表示制御
    useEffect(() => {
      props.infoOpen ? setInfoOpen(true) : ''
      props.errorOpen ? setErrorOpen(true) : ''
    }, [dispatch])
    const handleClose = () => {
      // infoメッセージとerrorメッセージのリセット
      dispatch(fetchGetInfoMessages(''))
      dispatch(fetchGetErrorMessages(''))
      setInfoOpen(false);
      setErrorOpen(false);
    };
    
    return (
      <div className={classes.root}>
        {
          // infoメッセージの表示制御
          infoMessages.payload ? 
            <Snackbar open={infoOpen} onClose={handleClose} autoHideDuration={6000}>
              <Alert onClose={handleClose} severity="success">
                <span className={classes.message}>{infoMessages.payload.info_message}</span>
              </Alert>
            </Snackbar>
          : ''
        }
        {
          // errorメッセージの表示制御
          errorMessages.payload ? 
            <Snackbar open={errorOpen} onClose={handleClose} autoHideDuration={6000}>
              <Alert onClose={handleClose} severity="error">
                <span className={classes.message}>{errorMessages.payload.error_message}</span>
              </Alert>
            </Snackbar>
          : ''
        }
      </div>
    )
  }
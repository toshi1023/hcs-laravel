import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function BasicPagination(props) {
  const classes = useStyles();

  /**
   * データ取得
   */
  const handleGetData = (page) => {
    props.handleGetData(page)
  }

  return (
    <div className={classes.root}>
    {
        // ページネーションが2項以上の場合のみ表示する
        props.count === 1 ?
            ''
        :
            <Pagination 
              count={props.count} 
              color="primary" 
              onChange={(e, page) => handleGetData(page)}  //変更されたときに走る関数。第2引数にページ番号が入る
            />
    }
    </div>
  );
}

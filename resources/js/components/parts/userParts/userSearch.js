import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import { InputAdornment } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 300,
    },
  },
  text: {
    fontSize: 15
  },
}));

export default function UserSearch() {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField
          id="standard-textarea"
          label="Search"
          placeholder="UserSearch"
          multiline
          // SearchIconをフィールドに埋め込み
          InputProps={{
            endAdornment: (
                <InputAdornment>
                    <IconButton type="submit" className={classes.iconButton} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </InputAdornment>
            ),
            // 入力値のフォントサイズを変更
            classes: {
                input: classes.text,
            },
          }}
          InputLabelProps={{
              style: {fontSize: 15}
          }}
        />
      </div>
    </form>
  );
}
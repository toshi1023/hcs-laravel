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
  const [state, setState] = React.useState({
    userName: null,
  })

  const handleChange = (event) => {
    setState({
      ...state,
      userName: event.target.value,
    })
  }

  // 検索条件をもとに記事の絞り込み
  const getSearchUser = () => {
    // 非同期の関数を定義
    const fetchUserSearch = async () => {
        // Loading開始
        await dispatch(fetchCredStart())
        // ユーザ名の入力情報をセット
        let user = document.getElementById("userSearch").value
        console.log(document.getElementById("userSearch").value)
        // 記事一覧を取得
        const resultSearch = await dispatch(fetchAsyncGet(user))
        if (fetchAsyncGet.fulfilled.match(resultSearch)) {
            // ロード終了
            await dispatch(fetchCredEnd());       
        }
        // ロード終了
        await dispatch(fetchCredEnd());  
    }
    // 上で定義した非同期の関数を実行
    fetchUserSearch()
  }

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField
          id="userSearch"
          label="Search"
          placeholder="ユーザ名で検索"
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
          onChange={handleChange}
        />
      </div>
    </form>
  );
}
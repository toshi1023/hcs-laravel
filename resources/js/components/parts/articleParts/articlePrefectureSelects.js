import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useSelector, useDispatch } from 'react-redux';
import { selectPrefectures, fetchAsyncGetPrefectures, fetchCredStart, fetchCredEnd } from '../../app/appSlice';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectLabel: {
    paddingLeft: 15,
  },
  selectBox: {
    width: 120,
    paddingLeft: theme.spacing(2),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function ArticlePrefectureSelects(props) {
  const classes = useStyles();
  const prefectures = useSelector(selectPrefectures)
  const dispatch = useDispatch()
  
  const [state, setState] = React.useState({
    prefecture: '',
  })

  useEffect(() => {
    // 非同期の関数を定義
    const fetchPrefectures = async () => {
        // Loading開始
        await dispatch(fetchCredStart())
        // 都道府県一覧を取得
        const resultReg = await dispatch(fetchAsyncGetPrefectures())

        if (fetchAsyncGetPrefectures.fulfilled.match(resultReg)) {
            // ロード終了
            await dispatch(fetchCredEnd());       
        }
        // ロード終了
        await dispatch(fetchCredEnd());  
    }
    // 上で定義した非同期の関数を実行
    fetchPrefectures()
  }, [dispatch])

  // ラベルの表示制御
  let labelFlg = true
  if(props.labelFlg != undefined && props.labelFlg == false) {
    labelFlg = false
  }

  const handleChange = (event) => {
    setState({
      ...state,
      prefecture: event.target.value,
    })
  }
  
  // 都道府県データの格納
  const renderPrefectures = () => {
    return _.map(prefectures.prefectures, prefecture => (
      <option key={prefecture.id} value={prefecture.name}>
        {prefecture.name}
      </option>
    ))
  }
  
  return (
    <div>
      <FormControl className={classes.formControl}>
        {
          // ラベルの表示有無を設定
          labelFlg ? <InputLabel htmlFor="prefecture" style={{ fontSize: props.fontSize }} className={classes.selectLabel}>都道府県</InputLabel> : ''
        }
        <Select
          native
          defaultValue={state.prefecture}
          onChange={handleChange}
          style={{ fontSize: props.fontSize }} 
          className={classes.selectBox}
          id={props.id}
        >
          <option aria-label="None" value="" disabled />
          <option aria-label="None" value="全都道府県">全都道府県</option>
          {renderPrefectures()}
        </Select>
      </FormControl>
    </div>
  );
}
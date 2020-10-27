import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectLabel: {
    paddingLeft: 15,
    fontSize: 15
  },
  selectBox: {
    width: 120,
    fontSize: 15,
    paddingLeft: theme.spacing(2),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function PrefectureSelects(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    prefecture: null,
  })
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
    return _.map(props.values, prefecture => (
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
          labelFlg ? <InputLabel htmlFor="prefecture" className={classes.selectLabel}>都道府県</InputLabel> : ''
        }
        <Select
          native
          value={state.prefecture}
          onChange={handleChange}
          className={classes.selectBox}
          id="prefecture"
        >
          <option aria-label="None" value="" selected disabled />
          <option aria-label="None" value="全都道府県">全都道府県</option>
          {renderPrefectures()}
        </Select>
      </FormControl>
    </div>
  );
}
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    paddingLeft: 15,
  },
  selectLabel: {
    paddingLeft: 15,
    fontSize: 15
  },
  selectBox: {
    width: 150,
    fontSize: 15,
    paddingRight: theme.spacing(2),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function dateSelects(props) {
  const classes = useStyles();
  // 現在の年月日を取得
  let date = new Date()

  // stateの宣言
  const [state, setState] = React.useState({
    year: date.getFullYear(),
    month: date.getMonth(),
    day: null,
  })

  const handleChangeYear = (event) => {
    setState({
      ...state,
      year: event.target.value,
    })
  }
  const handleChangeMonth = (event) => {
    setState({
      ...state,
      month: event.target.value,
    })
  }
  const handleChangeDay = (event) => {
    setState({
      ...state,
      day: event.target.value,
    })
  }
  // (年)1950年から今年までのoption要素を生成
  const selectYear = () => {
      let yearValue = []
      for(var i = 1950; i <= state.year; i++) {
        yearValue.push(i)
      }
      return yearValue
  }

  // (月)1月から12月までのoption要素を生成
  const selectMonth = () => {
    let monthValue = []
    for(var j = 1; j <= 12; j++ ) {
      monthValue.push(j)
    }
    return monthValue
  }

  // 1日から31日までのoption要素を生成
  // ※デフォルトでは1月が選択されているので31日
  const selectDay = () => {
    // 今月の値を取得
    let thisMonth = state.month
    let dayValue = []

    // 2月の場合
    if(thisMonth == 2) {
      for(var k = 1; k <= 28; k++ ) { 
        dayValue.push(k)
      }
      return dayValue
    }
    // 8月以前の場合
    if(thisMonth < 8) {
      if(thisMonth % 2 == 0) {
        for(var k = 1; k <= 30; k++ ) { 
          dayValue.push(k)
        }
        return dayValue
      }
      if(thisMonth % 2 != 0) {
        for(var k = 1; k <= 31; k++ ) { 
          dayValue.push(k)
        }
        return dayValue
      }
    }
    // 8月以降の場合
    if(thisMonth >= 8) {
      if(thisMonth % 2 == 0) {
        for(var k = 1; k <= 31; k++ ) { 
          dayValue.push(k)
        }
        return dayValue
      }
      if(thisMonth % 2 != 0) {
        for(var k = 1; k <= 30; k++ ) { 
          dayValue.push(k)
        }
        return dayValue
      }
    }
  }

  // 年データの展開
  const renderYearValue = () => {
    let yearValueMap = selectYear()

    return yearValueMap.map(value => (
      <option key={value} value={value}>
        {value}
      </option>
    ))
  }
  // 月データの展開
  const renderMonthValue = () => {
    let monthValueMap = selectMonth()
    return monthValueMap.map(value => (
      <option key={value} value={value}>
        {value}
      </option>
    ))
  }
  // 日データの展開
  const renderDayValue = () => {
    let dayValueMap = selectDay()
    return dayValueMap.map(value => (
      <option key={value} value={value}>
        {value}
      </option>
    ))
  }
  
  return (
    <div>
      <FormControl className={classes.formControl}>
        <Select
          native
          // value={state.year}
          onChange={handleChangeYear}
          className={classes.selectBox}
        >
          <option aria-label="None">----</option>
          {renderYearValue()}
        </Select>
        年
        <Select
          native
          // value={state.month}
          onChange={handleChangeMonth}
          className={classes.selectBox}
        >
          <option aria-label="None">--</option>
          {renderMonthValue()}
        </Select>
        月
        <Select
          native
          // value={state.day}
          onChange={handleChangeDay}
          className={classes.selectBox}
        >
          <option aria-label="None">--</option>
          {renderDayValue()}
        </Select>
        日
      </FormControl>
    </div>
  );
}
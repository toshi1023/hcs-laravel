import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    paddingLeft: 5,
  },
  selectBox: {
    width: 70,
    paddingLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
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
      for(var i = date.getFullYear(); i >= 1950; i--) {
        yearValue.push(i)
      }
      return yearValue
  }

  // (月)1月から12月までのoption要素を生成
  const selectMonth = () => {
    let monthValue = []
    let number = null
    for(var j = 1; j <= 12; j++ ) {
      // 数値の足りない桁を0で埋める
      number = ('00' + j).slice( -2 )
      monthValue.push(number)
    }
    return monthValue
  }

  // 1日から31日までのoption要素を生成
  // ※デフォルトでは1月が選択されているので31日
  const selectDay = () => {
    // 今月の値を取得
    let thisMonth = state.month
    let dayValue = []
    let number = null

    // 2月の場合
    if(thisMonth == 2) {
      for(var k = 1; k <= 29; k++ ) { 
        // 数値の足りない桁を0で埋める
        number = ('00' + k).slice( -2 )
        dayValue.push(number)
      }
      return dayValue
    }
    // 8月以前の場合
    if(thisMonth < 8) {
      if(thisMonth % 2 == 0) {
        for(var k = 1; k <= 30; k++ ) { 
          number = ('00' + k).slice( -2 )
          dayValue.push(number)
        }
        return dayValue
      }
      if(thisMonth % 2 != 0) {
        for(var k = 1; k <= 31; k++ ) { 
          number = ('00' + k).slice( -2 )
          dayValue.push(number)
        }
        return dayValue
      }
    }
    // 8月以降の場合
    if(thisMonth >= 8) {
      if(thisMonth % 2 == 0) {
        for(var k = 1; k <= 31; k++ ) { 
          number = ('00' + k).slice( -2 )
          dayValue.push(number)
        }
        return dayValue
      }
      if(thisMonth % 2 != 0) {
        for(var k = 1; k <= 30; k++ ) { 
          number = ('00' + k).slice( -2 )
          dayValue.push(number)
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
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <Select
              native
              onChange={handleChangeYear}
              style={{ fontSize: props.fontSize }}
              className={classes.selectBox}
              id='selectYear'
            >
              <option aria-label="None">----</option>
              {renderYearValue()}
            </Select>
            年
          </Grid>
          <Grid item xs={12} sm={4}>
            <Select
              native
              onChange={handleChangeMonth}
              style={{ fontSize: props.fontSize }}
              className={classes.selectBox}
              id='selectMonth'
            >
              <option aria-label="None">--</option>
              {renderMonthValue()}
            </Select>
            月
          </Grid>
          <Grid item xs={12} sm={4}>
            <Select
              native
              onChange={handleChangeDay}
              style={{ fontSize: props.fontSize }}
              className={classes.selectBox}
              id='selectDay'
            >
              <option aria-label="None">--</option>
              {renderDayValue()}
            </Select>
            日
          </Grid>
        </Grid>
      </FormControl>
    </div>
  )
}
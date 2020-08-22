import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

export default function SwitchType(props) {
  const [state, setState] = React.useState({
    checked: true,
    checkedB: true,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const labelChange = () => {
    if(state.checkedB) {
      return <span style={{color: 'blue', fontSize: 15}}>{props.switchLabel.true}</span>
    }
    if(!state.checkedB) {
      return <span style={{color: 'red', fontSize: 15}}>{props.switchLabel.false}</span>
    }
  }

  return (
    <FormGroup style={{width:100}}>
      <FormControlLabel
        control={
          <Switch
            checked={state.checkedB}
            onChange={handleChange}
            name="checkedB"
            color="primary"
          />
        }
        // label="仮ログイン"
        label={labelChange()}
        labelPlacement="bottom"
      />
    </FormGroup>
  );
}
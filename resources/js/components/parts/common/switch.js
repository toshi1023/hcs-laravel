import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

export default function SwitchType(props) {
  const [state, setState] = React.useState({
    checked: false,
  });
  
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const labelChange = () => {
    if(state.checked) {
      return <span style={{color: 'blue', fontSize: 15}}>{props.switchLabel.true}</span>
    }
    if(!state.checked) {
      return <span style={{color: 'red', fontSize: 15}}>{props.switchLabel.false}</span>
    }
  }
 
  return (
    <FormGroup style={{width:100}}>
      <FormControlLabel
        control={
          <Switch
            id={props.id}
            checked={state.checked}
            onChange={handleChange}
            name="checked"
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
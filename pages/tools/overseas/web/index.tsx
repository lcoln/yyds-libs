/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: linteng
 * @Date: 2022-04-22 22:56:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-05 23:36:19
 */
import type { NextPage } from 'next';
import { useState, ChangeEvent } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FilledInput from '@material-ui/core/FilledInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import styles from './index.module.css';

const useStyles = makeStyles((theme: Theme) => createStyles({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
}));
const OWeb: NextPage = () => {
  const classes = useStyles();
  const [age, setAge] = useState('');
  const [values, setValues] = useState('');

  const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
    setAge(event.target.value as string);
  };
  const handleText = (event: ChangeEvent<{ value: unknown }>) => {
    setValues(event.target.value as string);
  };
  const submit = () => {
    console.log({ age, values });
  };

  return <div className={styles.container}>
    <FormControl>
      <InputLabel id="demo-simple-select-label">Age</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={age}
        onChange={handleChange}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
    <FormControl fullWidth variant="filled">
      <InputLabel htmlFor="filled-adornment-amount">Amount</InputLabel>
      <FilledInput
        id="filled-adornment-amount"
        value={values}
        onChange={handleText}
        startAdornment={<InputAdornment position="start">json: </InputAdornment>}
      />
    </FormControl>
    <Button
      variant="contained"
      color="primary"
      startIcon={<SaveIcon />}
      onClick={submit}
      style={{ backgroundColor: '#D34017' }}
    >
      Send
    </Button>
  </div>;
};

export default OWeb;

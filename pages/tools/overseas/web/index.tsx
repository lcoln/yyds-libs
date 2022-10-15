/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: linteng
 * @Date: 2022-04-22 22:56:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-05 23:36:19
 */
// @ts-ignore
// @ts-nocheck
import type { NextPage } from 'next';
import Image from 'next/image';
import React, {
  useState, ChangeEvent, useRef, useImperativeHandle,
} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FilledInput from '@material-ui/core/FilledInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Tesseract from 'tesseract.js';
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
function preprocessImage(canvas) {
  // const level = 0.4;
  // const radius = 1;
  const ctx = canvas.getContext('2d');
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // blurARGB(image.data, canvas, radius);
  // dilate(image.data, canvas);
  // invertColors(image.data);
  // thresholdFilter(image.data, level);
  return image;
}
// eslint-disable-next-line react/display-name
// const MyImage = React.forwardRef((props, ref) => {
//   useImperativeHandle(ref, () => ({}));
//   return <Image type="text" ref={ref}
// {...props} />;
// });

const OWeb: NextPage = () => {
  // const classes = useStyles();
  // const [age, setAge] = useState('');
  // const [values, setValues] = useState('');
  const [image, setImage] = useState('');
  const [text, setText] = useState('');
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
  //   setAge(event.target.value as string);
  // };
  // const handleText = (event: ChangeEvent<{ value: unknown }>) => {
  //   setValues(event.target.value as string);
  // };
  // const submit = () => {
  //   console.log({ age, values });
  // };
  const handleChange = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleClick = () => {
    console.log({ canvasRef, imageRef });
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = imageRef.current.width;
    canvas.height = imageRef.current.height;
    ctx.drawImage(
      imageRef.current,
      0,
      0,
      imageRef.current.width,
      imageRef.current.height,
    );
    // ctx.putImageData(preprocessImage(canvas), 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    ctx.font = '40px PingFangSC-Medium';
    // ctx.fillText(oldText, xCoordinate, yCoordinate);
    Tesseract.recognize(
      dataUrl,
      'chi_sim',
      // {
      //   logger: (m) => console.log(m),
      // },
    )
      .catch((err) => {
        console.error(err, 888888);
      })
      .then((result) => {
        console.log(7898789, result);
        // Get Confidence score
        const { confidence } = result;
        const { data } = result;
        const { bbox } = data.lines[0];
        console.log(confidence);
        // ctx.clearRect(bbox.x0, bbox.y0, bbox.x1, 40);
        // Get full output
        ctx.fillStyle = '#ffffff'; // or whatever color the background is.
        ctx.fillText(data?.text, bbox.x0, bbox.y0);
        ctx.fillStyle = '#000000'; // or whatever color the background is.
        ctx.fillText('title', bbox.x0, bbox.y0);

        const font = ctx.measureText(data?.text);
        console.log(font);

        setText(data?.text);
      });
  };

  // Tesseract.recognize(
  //   '/2.png',
  //   'chi_sim',
  //   // { logger: (m: any) => console.log(m) },
  // ).then((data: any) => {
  //   console.log(data);
  // });

  return <div className={styles.container}>
    <p> {text} </p>
    <input type="file" onChange={handleChange} />
    <button onClick={handleClick} style={{ height: 50 }}>Convert to text</button>
    {
      image && <img
        src={image}
        className="App-logo"
        alt="logo"
        ref={imageRef}
      />
    }
    <br />
    {
      canvasRef && <canvas
        ref={canvasRef}>
      </canvas>
    }

    {/* <FormControl>
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
    </FormControl> */}
    {/* <Button
      variant="contained"
      color="primary"
      startIcon={<SaveIcon />}
      onClick={submit}
      style={{ backgroundColor: '#D34017' }}
    >
      Send
    </Button> */}
  </div>;
};

export default OWeb;

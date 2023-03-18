/*
 * @Description:
 * @Version: 0.0.1
 * @Autor: linteng
 * @Date: 2022-04-22 22:56:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-18 18:57:18
 */
// @ts-ignore
// @ts-nocheck
import type { NextPage } from 'next';
import React, {
  useState, useRef,
} from 'react';
// import Tesseract from 'tesseract.js';
import styles from './index.module.css';

const OWeb: NextPage = () => {
  const [image, setImage] = useState('');
  const [text] = useState('');
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

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
    ctx.font = '40px PingFangSC-Medium';
  };

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

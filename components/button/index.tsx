import styles from './index.module.css';

export default function Button(props: any) {
  const {
    onClick, txt, className, active,
  } = props;
  return <button
  className={`
    ${styles.button} 
    ${className} 
    ${active ? styles.active : ''} 
    float-right text-gray-800 font-semibold py-1 px-2 rounded
  `}
  onClick={onClick}>
    { txt }
  </button>;
}

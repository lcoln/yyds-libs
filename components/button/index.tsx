export default function Button(props: any) {
  const { onClick, txt } = props;
  return <button 
  className="
    float-right hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 rounded
  " 
  onClick={onClick}>
    { txt }
  </button>
}
export default () => <svg width="24" height="24"
viewBox="0 0 50 50">
    <circle cx="25" cy="25"
r="20" fill="none"
strokeWidth="5" stroke="#ccc"
opacity=".2"></circle>
    <circle cx="25" cy="25"
r="20" fill="none"
strokeWidth="5" stroke="#000">
      <animate attributeName="stroke-dasharray" from="1,200"
to="200,200" dur="1.5s"
repeatCount="indefinite"></animate>
      <animate attributeName="stroke-dashoffset" from="0"
to="-140" dur="1.5s"
repeatCount="indefinite"></animate>
    </circle>
  </svg>;

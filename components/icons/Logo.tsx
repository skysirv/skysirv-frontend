const Logo = ({ ...props }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Skysirv logo"
    {...props}
  >
    <rect width="32" height="32" rx="16" fill="#E0F2FE" />
    <path
      d="M8 19.5C11.2 14.8 15.7 11.7 23 10.5"
      stroke="#0284C7"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M18.7 10.1L23.8 10.2L20.7 14.2"
      stroke="#0284C7"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="20" r="1.6" fill="#0F172A" />
  </svg>
);

export default Logo;
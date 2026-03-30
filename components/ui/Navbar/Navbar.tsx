import s from './Navbar.module.css';
import Navlinks from './Navlinks';

export default function Navbar() {
  return (
    <nav className={`${s.root} backdrop-none`}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>

      <div className="mx-auto max-w-7xl px-6">
        <Navlinks />
      </div>
    </nav>
  );
}
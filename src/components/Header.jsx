import { Link, NavLink } from 'react-router-dom'
import { supabase, supabaseConfigured } from '../lib/supabase'

export default function Header({ user, onOpenAuth }) {
  const navLink = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-sage-100 text-sage-700' : 'text-sage-700 hover:bg-warm-100'
    }`

  return (
    <header className="border-b border-warm-200 bg-white/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-sage-500 text-white font-bold">Z</span>
          <span className="font-semibold text-lg text-sage-800">Zendu</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          <NavLink to="/" end className={navLink}>Browse</NavLink>
          <NavLink to="/progress" className={navLink}>My Progress</NavLink>
          <NavLink to="/about" className={navLink}>About</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-sage-700 truncate max-w-[160px]">{user.email}</span>
              <button
                className="btn-secondary text-sm"
                onClick={() => supabase?.auth.signOut()}
              >
                Sign out
              </button>
            </>
          ) : (
            <button className="btn-primary text-sm" onClick={onOpenAuth} disabled={!supabaseConfigured}>
              {supabaseConfigured ? 'Sign in' : 'Auth disabled'}
            </button>
          )}
        </div>
      </div>
      <nav className="sm:hidden flex items-center gap-1 px-3 pb-2">
        <NavLink to="/" end className={navLink}>Browse</NavLink>
        <NavLink to="/progress" className={navLink}>Progress</NavLink>
        <NavLink to="/about" className={navLink}>About</NavLink>
      </nav>
    </header>
  )
}

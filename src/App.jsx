import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import AuthModal from './components/AuthModal'
import Home from './pages/Home'
import LearningPath from './pages/LearningPath'
import QuizPage from './pages/QuizPage'
import MyProgress from './pages/MyProgress'
import About from './pages/About'
import { useAuth } from './lib/useAuth'

export default function App() {
  const { user } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)
  const openAuth = () => setAuthOpen(true)

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onOpenAuth={openAuth} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/topic/:topicId" element={<LearningPath user={user} onRequestAuth={openAuth} />} />
          <Route path="/topic/:topicId/quiz" element={<QuizPage user={user} />} />
          <Route path="/progress" element={<MyProgress user={user} onRequestAuth={openAuth} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <footer className="border-t border-warm-200 py-6 text-center text-sm text-sage-600">
        Zendu • Calm, focused learning.
      </footer>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}

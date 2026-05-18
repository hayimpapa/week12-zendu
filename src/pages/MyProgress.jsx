import { useEffect, useState } from 'react'
import TopicCard from '../components/TopicCard'
import { fetchTopics, fetchUserProgress, fetchUserWishlist } from '../lib/data'
import { supabaseConfigured } from '../lib/supabase'

const TABS = [
  { id: 'in_progress', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'wishlist', label: 'Wishlist' },
]

export default function MyProgress({ user, onRequestAuth }) {
  const [tab, setTab] = useState('in_progress')
  const [topics, setTopics] = useState([])
  const [progress, setProgress] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    Promise.all([fetchTopics(), fetchUserProgress(user.id), fetchUserWishlist(user.id)]).then(
      ([t, p, w]) => {
        if (cancelled) return
        setTopics(t)
        setProgress(p)
        setWishlist(w)
        setLoading(false)
      },
    )
    return () => {
      cancelled = true
    }
  }, [user])

  if (!supabaseConfigured) {
    return (
      <div className="card p-6">
        <h1 className="text-2xl font-semibold text-sage-800 mb-2">My Progress</h1>
        <p className="text-sage-600">
          Supabase isn't configured, so progress is only saved locally in this browser.
        </p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="card p-6 text-center">
        <h1 className="text-2xl font-semibold text-sage-800 mb-2">Sign in to track progress</h1>
        <p className="text-sage-600 mb-4">
          Save which topics you're working on, which you've finished, and what you want to learn next.
        </p>
        <button className="btn-primary" onClick={onRequestAuth}>Sign in</button>
      </div>
    )
  }

  const byId = Object.fromEntries(topics.map((t) => [t.id, t]))
  let visibleTopics = []
  if (tab === 'wishlist') {
    visibleTopics = wishlist.map((id) => byId[id]).filter(Boolean)
  } else {
    visibleTopics = progress
      .filter((p) => p.status === tab)
      .map((p) => byId[p.topic_id])
      .filter(Boolean)
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-sage-800 mb-4">My Progress</h1>

      <div className="flex gap-1 border-b border-warm-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? 'border-sage-500 text-sage-800'
                : 'border-transparent text-sage-600 hover:text-sage-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sage-600">Loading…</p>
      ) : visibleTopics.length === 0 ? (
        <p className="text-sage-600">
          {tab === 'wishlist'
            ? 'Nothing wishlisted yet. Browse topics and tap "Add to wishlist".'
            : tab === 'in_progress'
            ? 'No topics in progress. Start a learning path to see it here.'
            : 'No completed topics yet. Finish all modules and the quiz to mark one complete.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleTopics.map((t) => (
            <TopicCard key={t.id} topic={t} />
          ))}
        </div>
      )}
    </div>
  )
}

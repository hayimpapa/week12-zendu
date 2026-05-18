import { useEffect, useMemo, useState } from 'react'
import TopicCard from '../components/TopicCard'
import { fetchTopics, fetchUserProgress } from '../lib/data'

export default function Home({ user }) {
  const [topics, setTopics] = useState([])
  const [progress, setProgress] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([fetchTopics(), user ? fetchUserProgress(user.id) : Promise.resolve([])])
      .then(([t, p]) => {
        if (cancelled) return
        setTopics(t)
        setProgress(p)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return topics
    return topics.filter(
      (t) =>
        t.title.toLowerCase().includes(needle) ||
        t.description?.toLowerCase().includes(needle) ||
        t.category?.toLowerCase().includes(needle),
    )
  }, [topics, q])

  const statusFor = (topicId) => {
    const p = progress.find((row) => row.topic_id === topicId)
    if (!p) return null
    if (p.status === 'completed') return 'Completed'
    if (p.status === 'in_progress') return 'In progress'
    return null
  }

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-sage-800 mb-2">Calm, focused learning.</h1>
        <p className="text-sage-600 max-w-2xl">
          Pick a short learning path. Watch a few modules. Finish with an AI-generated quiz to see what stuck.
        </p>
      </section>

      <div className="mb-6">
        <input
          type="search"
          placeholder="Search topics…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full sm:max-w-md px-4 py-2 rounded-lg border border-warm-200 bg-white focus:outline-none focus:ring-2 focus:ring-sage-300"
        />
      </div>

      {loading ? (
        <p className="text-sage-600">Loading topics…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sage-600">No topics match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t) => (
            <TopicCard key={t.id} topic={t} statusBadge={statusFor(t.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

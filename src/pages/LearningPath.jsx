import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import {
  fetchTopicWithModules,
  fetchUserProgress,
  fetchUserWishlist,
  toggleWishlist,
  upsertProgress,
} from '../lib/data'

export default function LearningPath({ user, onRequestAuth }) {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const [topic, setTopic] = useState(null)
  const [completed, setCompleted] = useState([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchTopicWithModules(topicId).then(async (t) => {
      if (cancelled) return
      setTopic(t)
      if (user) {
        const [progress, wish] = await Promise.all([
          fetchUserProgress(user.id),
          fetchUserWishlist(user.id),
        ])
        if (cancelled) return
        const row = progress.find((r) => r.topic_id === topicId)
        setCompleted(row?.completed_modules || [])
        setWishlisted(wish.includes(topicId))
      } else {
        const stored = localStorage.getItem(`zendu:progress:${topicId}`)
        setCompleted(stored ? JSON.parse(stored) : [])
      }
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [topicId, user])

  if (loading) return <p className="text-sage-600">Loading…</p>
  if (!topic) return <p className="text-sage-600">Topic not found. <Link to="/" className="underline">Go back</Link></p>

  const total = topic.modules.length
  const done = completed.length
  const allDone = done === total && total > 0
  const activeModule = topic.modules[activeIdx]

  const persistCompleted = async (next) => {
    setCompleted(next)
    const status = next.length === 0 ? 'not_started' : next.length === total ? 'completed' : 'in_progress'
    if (user) {
      await upsertProgress(user.id, topicId, { completed_modules: next, status })
    } else {
      localStorage.setItem(`zendu:progress:${topicId}`, JSON.stringify(next))
    }
  }

  const toggleModule = (moduleId) => {
    const next = completed.includes(moduleId)
      ? completed.filter((id) => id !== moduleId)
      : [...completed, moduleId]
    persistCompleted(next)
  }

  const onWishlist = async () => {
    if (!user) return onRequestAuth()
    const next = !wishlisted
    setWishlisted(next)
    await toggleWishlist(user.id, topicId, next)
  }

  return (
    <div>
      <Link to="/" className="text-sm text-sage-600 hover:text-sage-800">← Back to topics</Link>
      <header className="mt-3 mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-sage-600 mb-2">
            <span className="uppercase tracking-wide font-medium">{topic.category}</span>
            <span>•</span>
            <span>{topic.difficulty}</span>
          </div>
          <h1 className="text-3xl font-semibold text-sage-800">{topic.title}</h1>
          <p className="text-sage-600 mt-2 max-w-2xl">{topic.description}</p>
        </div>
        <button onClick={onWishlist} className="btn-secondary text-sm shrink-0">
          {wishlisted ? '★ Wishlisted' : '☆ Add to wishlist'}
        </button>
      </header>

      <div className="mb-6 max-w-md">
        <ProgressBar value={done} total={total} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card overflow-hidden">
          {activeModule ? (
            <>
              <div className="aspect-video bg-black">
                <iframe
                  key={activeModule.id || activeModule.order_index}
                  src={activeModule.video_url}
                  title={activeModule.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-sage-600">Module {activeIdx + 1} of {total}</p>
                  <h2 className="font-semibold text-sage-800">{activeModule.title}</h2>
                </div>
                <button
                  className={`text-sm px-3 py-2 rounded-lg font-medium transition-colors ${
                    completed.includes(activeModule.id || activeModule.order_index)
                      ? 'bg-sage-100 text-sage-700'
                      : 'bg-sage-500 text-white hover:bg-sage-600'
                  }`}
                  onClick={() => toggleModule(activeModule.id || activeModule.order_index)}
                >
                  {completed.includes(activeModule.id || activeModule.order_index) ? '✓ Completed' : 'Mark complete'}
                </button>
              </div>
            </>
          ) : (
            <p className="p-6 text-sage-600">No modules yet.</p>
          )}
        </div>

        <ol className="space-y-2">
          {topic.modules.map((m, i) => {
            const id = m.id || m.order_index
            const isActive = i === activeIdx
            const isDone = completed.includes(id)
            return (
              <li key={id}>
                <button
                  onClick={() => setActiveIdx(i)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors flex items-start gap-3 ${
                    isActive
                      ? 'border-sage-400 bg-sage-50'
                      : 'border-warm-200 bg-white hover:border-sage-200'
                  }`}
                >
                  <span
                    className={`inline-flex shrink-0 items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                      isDone ? 'bg-sage-500 text-white' : 'bg-warm-100 text-sage-700'
                    }`}
                  >
                    {isDone ? '✓' : i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-sage-800 truncate">{m.title}</p>
                    <p className="text-xs text-sage-600">Module {i + 1}</p>
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sage-600 text-sm">
          {allDone
            ? 'All modules complete — ready for the quiz!'
            : 'Mark all modules complete to unlock the quiz.'}
        </p>
        <button
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!allDone}
          onClick={() => navigate(`/topic/${topicId}/quiz`)}
        >
          Start quiz →
        </button>
      </div>
    </div>
  )
}

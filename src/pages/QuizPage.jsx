import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchTopicWithModules, upsertProgress } from '../lib/data'

async function generateQuiz(topicName) {
  const res = await fetch('/api/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: topicName }),
  })
  if (!res.ok) throw new Error('Failed to generate quiz')
  return res.json()
}

export default function QuizPage({ user }) {
  const { topicId } = useParams()
  const [topic, setTopic] = useState(null)
  const [questions, setQuestions] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchTopicWithModules(topicId).then(async (t) => {
      if (cancelled) return
      setTopic(t)
      if (!t) {
        setLoading(false)
        return
      }
      try {
        const data = await generateQuiz(t.title)
        if (cancelled) return
        setQuestions(data)
      } catch (e) {
        if (cancelled) return
        setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [topicId])

  const score = questions
    ? questions.reduce((acc, q, i) => acc + (answers[i] === q.correct_answer ? 1 : 0), 0)
    : 0
  const total = questions?.length || 0
  const passed = total > 0 && score / total >= 0.6

  const submit = async () => {
    setSubmitted(true)
    if (user && topic) {
      await upsertProgress(user.id, topicId, { quiz_score: score, status: 'completed' })
    }
  }

  if (loading) {
    return (
      <div>
        <Link to={`/topic/${topicId}`} className="text-sm text-sage-600 hover:text-sage-800">← Back</Link>
        <div className="mt-6 card p-6 text-center text-sage-700">
          <p className="font-medium">Generating your quiz with Claude…</p>
          <p className="text-sm text-sage-600 mt-1">This usually takes a few seconds.</p>
        </div>
      </div>
    )
  }

  if (error || !questions) {
    return (
      <div>
        <Link to={`/topic/${topicId}`} className="text-sm text-sage-600 hover:text-sage-800">← Back</Link>
        <div className="mt-6 card p-6">
          <p className="text-red-600 font-medium">Couldn't generate a quiz.</p>
          <p className="text-sm text-sage-600 mt-1">{error || 'Unknown error.'}</p>
          <p className="text-xs text-sage-600 mt-3">
            Make sure <code>ANTHROPIC_API_KEY</code> is set in your Vercel environment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Link to={`/topic/${topicId}`} className="text-sm text-sage-600 hover:text-sage-800">← Back to path</Link>
      <h1 className="text-3xl font-semibold text-sage-800 mt-3 mb-1">Quiz — {topic?.title}</h1>
      <p className="text-sage-600 mb-6">Five quick multiple choice questions, AI-generated.</p>

      <ol className="space-y-5">
        {questions.map((q, i) => {
          const letters = ['A', 'B', 'C', 'D']
          return (
            <li key={i} className="card p-4">
              <p className="font-medium text-sage-800 mb-3">
                {i + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const letter = letters[oi]
                  const chosen = answers[i] === letter
                  const isCorrect = submitted && letter === q.correct_answer
                  const isWrong = submitted && chosen && letter !== q.correct_answer
                  return (
                    <label
                      key={oi}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        isCorrect
                          ? 'border-sage-500 bg-sage-50'
                          : isWrong
                          ? 'border-red-300 bg-red-50'
                          : chosen
                          ? 'border-sage-400 bg-sage-50'
                          : 'border-warm-200 hover:border-sage-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${i}`}
                        value={letter}
                        checked={chosen}
                        disabled={submitted}
                        onChange={() => setAnswers((a) => ({ ...a, [i]: letter }))}
                        className="mt-1"
                      />
                      <span className="text-sage-800">
                        <strong className="mr-1">{letter}.</strong>{opt}
                      </span>
                    </label>
                  )
                })}
              </div>
            </li>
          )
        })}
      </ol>

      {!submitted ? (
        <button
          className="btn-primary mt-6 disabled:opacity-50"
          onClick={submit}
          disabled={Object.keys(answers).length < questions.length}
        >
          Submit answers
        </button>
      ) : (
        <div className={`mt-6 card p-6 text-center ${passed ? 'border-sage-400' : ''}`}>
          <p className="text-2xl font-semibold text-sage-800">
            {score} / {total}
          </p>
          <p className="text-sage-600 mt-1">
            {passed ? 'Well done! That stuck.' : 'Not quite — give the modules another pass and try again.'}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link to={`/topic/${topicId}`} className="btn-secondary">Back to path</Link>
            <Link to="/" className="btn-primary">Find another topic</Link>
          </div>
        </div>
      )}
    </div>
  )
}

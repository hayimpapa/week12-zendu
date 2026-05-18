const GITHUB_REPO = 'https://github.com/hayimpapa/week12-zendu'

export default function About() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold text-sage-800 mb-6">About this build</h1>

      <section className="card p-6 mb-4">
        <h2 className="font-semibold text-sage-800 mb-2">The problem</h2>
        <p className="text-sage-700">
          Learning new topics is easy to start but hard to finish. Most people abandon
          courses. Zendu uses short video modules and a quiz to make completion feel
          achievable.
        </p>
      </section>

      <section className="card p-6 mb-4">
        <h2 className="font-semibold text-sage-800 mb-2">The app</h2>
        <p className="text-sage-700">
          Browse topics, watch short modules in order, take an AI-generated quiz, and
          track your progress across topics.
        </p>
      </section>

      <section className="card p-6 mb-4">
        <h2 className="font-semibold text-sage-800 mb-2">Prompts</h2>
        <p className="text-sage-700">
          The full prompt used to generate this app is in{' '}
          <a
            className="underline text-sage-700"
            href={`${GITHUB_REPO}/blob/main/PROMPTS.txt`}
            target="_blank"
            rel="noreferrer"
          >
            PROMPTS.txt
          </a>
          .
        </p>
      </section>

      <section className="card p-6">
        <h2 className="font-semibold text-sage-800 mb-2">Source</h2>
        <p className="text-sage-700">
          Code on{' '}
          <a className="underline text-sage-700" href={GITHUB_REPO} target="_blank" rel="noreferrer">
            GitHub
          </a>
          .
        </p>
      </section>
    </div>
  )
}

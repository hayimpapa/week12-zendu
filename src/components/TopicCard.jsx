import { Link } from 'react-router-dom'

const difficultyStyles = {
  Beginner: 'bg-sage-100 text-sage-700',
  Intermediate: 'bg-warm-200 text-sage-800',
  Advanced: 'bg-sage-200 text-sage-800',
}

export default function TopicCard({ topic, statusBadge }) {
  return (
    <Link to={`/topic/${topic.id}`} className="card overflow-hidden hover:shadow-md transition-shadow group">
      {topic.thumbnail_url ? (
        <div className="aspect-[16/9] bg-warm-100 overflow-hidden">
          <img
            src={topic.thumbnail_url}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-sage-100" />
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs uppercase tracking-wide text-sage-600 font-medium">{topic.category}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyStyles[topic.difficulty] || 'bg-warm-100'}`}>
            {topic.difficulty}
          </span>
          {statusBadge && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-sage-500 text-white">{statusBadge}</span>
          )}
        </div>
        <h3 className="font-semibold text-sage-800 mb-1">{topic.title}</h3>
        <p className="text-sm text-sage-600 line-clamp-2">{topic.description}</p>
      </div>
    </Link>
  )
}

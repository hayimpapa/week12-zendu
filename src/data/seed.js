// Seed data used as a fallback when Supabase isn't configured,
// and as the source of truth for the SQL seed script.
export const SEED_TOPICS = [
  {
    id: 'healthy-eating',
    title: 'Healthy Eating',
    description: 'Build sustainable habits around food, energy, and nutrition without the fad-diet noise.',
    category: 'Health',
    difficulty: 'Beginner',
    thumbnail_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop',
    modules: [
      { order_index: 1, title: 'Macronutrients in 5 minutes', video_url: 'https://www.youtube.com/embed/fR3NxCR9z2U' },
      { order_index: 2, title: 'How to read a nutrition label', video_url: 'https://www.youtube.com/embed/ceFOG7CUQac' },
      { order_index: 3, title: 'Building a balanced plate', video_url: 'https://www.youtube.com/embed/9_HRpVfeoCw' },
      { order_index: 4, title: 'Hydration & energy', video_url: 'https://www.youtube.com/embed/9iMGFqMmUFs' },
      { order_index: 5, title: 'Small habits that stick', video_url: 'https://www.youtube.com/embed/OMOGaugKpzs' },
    ],
  },
  {
    id: 'personal-finance-basics',
    title: 'Personal Finance Basics',
    description: 'A grounded intro to budgeting, saving, and thinking clearly about money.',
    category: 'Finance',
    difficulty: 'Beginner',
    thumbnail_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop',
    modules: [
      { order_index: 1, title: 'Budgeting fundamentals', video_url: 'https://www.youtube.com/embed/HQzoZfc3GwQ' },
      { order_index: 2, title: 'Emergency funds explained', video_url: 'https://www.youtube.com/embed/2myqsbpUYjg' },
      { order_index: 3, title: 'Understanding interest', video_url: 'https://www.youtube.com/embed/Yyx6vSBVUyU' },
      { order_index: 4, title: 'Intro to investing', video_url: 'https://www.youtube.com/embed/gFQNPmLKj1k' },
      { order_index: 5, title: 'Avoiding common money traps', video_url: 'https://www.youtube.com/embed/aT3v_USpHd0' },
    ],
  },
  {
    id: 'mindfulness-and-focus',
    title: 'Mindfulness & Focus',
    description: 'Short, practical exercises for a calmer mind and sharper attention.',
    category: 'Wellbeing',
    difficulty: 'Beginner',
    thumbnail_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop',
    modules: [
      { order_index: 1, title: 'What mindfulness actually is', video_url: 'https://www.youtube.com/embed/w6T02g5hnT4' },
      { order_index: 2, title: 'A 5-minute breathing practice', video_url: 'https://www.youtube.com/embed/inpok4MKVLM' },
      { order_index: 3, title: 'Training focused attention', video_url: 'https://www.youtube.com/embed/zTuR1q12gKM' },
      { order_index: 4, title: 'Handling distraction', video_url: 'https://www.youtube.com/embed/HBcsr6jcW2E' },
      { order_index: 5, title: 'Building a daily habit', video_url: 'https://www.youtube.com/embed/ssss7V1_eyA' },
    ],
  },
]

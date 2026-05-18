import { supabase, supabaseConfigured } from './supabase'
import { SEED_TOPICS } from '../data/seed'

export async function fetchTopics() {
  if (!supabaseConfigured) {
    return SEED_TOPICS.map(({ modules, ...t }) => t)
  }
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) {
    console.error('fetchTopics error', error)
    return SEED_TOPICS.map(({ modules, ...t }) => t)
  }
  return data
}

export async function fetchTopicWithModules(topicId) {
  if (!supabaseConfigured) {
    const t = SEED_TOPICS.find((s) => s.id === topicId)
    if (!t) return null
    const { modules, ...rest } = t
    return { ...rest, modules }
  }
  const [{ data: topic }, { data: modules }] = await Promise.all([
    supabase.from('topics').select('*').eq('id', topicId).single(),
    supabase.from('modules').select('*').eq('topic_id', topicId).order('order_index'),
  ])
  if (!topic) return null
  return { ...topic, modules: modules || [] }
}

export async function fetchUserProgress(userId) {
  if (!supabaseConfigured || !userId) return []
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
  if (error) {
    console.error('fetchUserProgress error', error)
    return []
  }
  return data || []
}

export async function fetchUserWishlist(userId) {
  if (!supabaseConfigured || !userId) return []
  const { data, error } = await supabase
    .from('user_wishlist')
    .select('topic_id')
    .eq('user_id', userId)
  if (error) {
    console.error('fetchUserWishlist error', error)
    return []
  }
  return (data || []).map((r) => r.topic_id)
}

export async function upsertProgress(userId, topicId, patch) {
  if (!supabaseConfigured || !userId) return null
  const { data, error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: userId,
        topic_id: topicId,
        ...patch,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,topic_id' },
    )
    .select()
    .single()
  if (error) {
    console.error('upsertProgress error', error)
    return null
  }
  return data
}

export async function toggleWishlist(userId, topicId, shouldAdd) {
  if (!supabaseConfigured || !userId) return
  if (shouldAdd) {
    await supabase.from('user_wishlist').upsert(
      { user_id: userId, topic_id: topicId },
      { onConflict: 'user_id,topic_id' },
    )
  } else {
    await supabase.from('user_wishlist').delete().eq('user_id', userId).eq('topic_id', topicId)
  }
}

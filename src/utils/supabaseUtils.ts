import { supabase } from '@/lib/supabase'
import { Memo } from '@/types/memo'
import { Database } from '@/types/database'

type MemoRow = Database['public']['Tables']['memos']['Row']
type MemoInsert = Database['public']['Tables']['memos']['Insert']
type MemoUpdate = Database['public']['Tables']['memos']['Update']

// 데이터베이스 행을 Memo 타입으로 변환
const mapRowToMemo = (row: MemoRow): Memo => ({
  id: row.id,
  title: row.title,
  content: row.content,
  category: row.category,
  tags: row.tags || [],
  createdAt: row.created_at || new Date().toISOString(),
  updatedAt: row.updated_at || new Date().toISOString(),
})

// Memo 타입을 데이터베이스 insert 형식으로 변환
const mapMemoToInsert = (memo: Memo): MemoInsert => ({
  id: memo.id,
  title: memo.title,
  content: memo.content,
  category: memo.category,
  tags: memo.tags,
  created_at: memo.createdAt,
  updated_at: memo.updatedAt,
})

// Memo 타입을 데이터베이스 update 형식으로 변환
const mapMemoToUpdate = (memo: Memo): MemoUpdate => ({
  title: memo.title,
  content: memo.content,
  category: memo.category,
  tags: memo.tags,
  updated_at: memo.updatedAt,
})

export const supabaseUtils = {
  // 모든 메모 가져오기
  getMemos: async (): Promise<Memo[]> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading memos from Supabase:', error)
        return []
      }

      return data.map(mapRowToMemo)
    } catch (error) {
      console.error('Error loading memos from Supabase:', error)
      return []
    }
  },

  // 메모 추가
  addMemo: async (memo: Memo): Promise<void> => {
    try {
      const { error } = await supabase
        .from('memos')
        .insert(mapMemoToInsert(memo))

      if (error) {
        console.error('Error adding memo to Supabase:', error)
        throw error
      }
    } catch (error) {
      console.error('Error adding memo to Supabase:', error)
      throw error
    }
  },

  // 메모 업데이트
  updateMemo: async (updatedMemo: Memo): Promise<void> => {
    try {
      const { error } = await supabase
        .from('memos')
        .update(mapMemoToUpdate(updatedMemo))
        .eq('id', updatedMemo.id)

      if (error) {
        console.error('Error updating memo in Supabase:', error)
        throw error
      }
    } catch (error) {
      console.error('Error updating memo in Supabase:', error)
      throw error
    }
  },

  // 메모 삭제
  deleteMemo: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting memo from Supabase:', error)
        throw error
      }
    } catch (error) {
      console.error('Error deleting memo from Supabase:', error)
      throw error
    }
  },

  // 메모 검색
  searchMemos: async (query: string): Promise<Memo[]> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching memos in Supabase:', error)
        return []
      }

      // 태그 필터링은 클라이언트에서 처리 (PostgreSQL 배열 검색이 복잡하므로)
      const lowercaseQuery = query.toLowerCase()
      const filteredData = data.filter(row => 
        row.title.toLowerCase().includes(lowercaseQuery) ||
        row.content.toLowerCase().includes(lowercaseQuery) ||
        (row.tags && row.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
      )

      return filteredData.map(mapRowToMemo)
    } catch (error) {
      console.error('Error searching memos in Supabase:', error)
      return []
    }
  },

  // 카테고리별 메모 필터링
  getMemosByCategory: async (category: string): Promise<Memo[]> => {
    try {
      if (category === 'all') {
        return await supabaseUtils.getMemos()
      }

      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error filtering memos by category in Supabase:', error)
        return []
      }

      return data.map(mapRowToMemo)
    } catch (error) {
      console.error('Error filtering memos by category in Supabase:', error)
      return []
    }
  },

  // 특정 메모 가져오기
  getMemoById: async (id: string): Promise<Memo | null> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // 메모를 찾을 수 없음
          return null
        }
        console.error('Error getting memo by ID from Supabase:', error)
        return null
      }

      return mapRowToMemo(data)
    } catch (error) {
      console.error('Error getting memo by ID from Supabase:', error)
      return null
    }
  },

  // 모든 메모 삭제
  clearMemos: async (): Promise<void> => {
    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .gte('id', '')  // 모든 ID 조건으로 전체 삭제

      if (error) {
        console.error('Error clearing all memos from Supabase:', error)
        throw error
      }
    } catch (error) {
      console.error('Error clearing all memos from Supabase:', error)
      throw error
    }
  },
}
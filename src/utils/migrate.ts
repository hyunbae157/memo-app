import { localStorageUtils } from './localStorage'
import { supabaseUtils } from './supabaseUtils'
import { Memo } from '@/types/memo'

export const migrateFromLocalStorage = async (): Promise<{
  success: boolean
  migratedCount: number
  errors: string[]
}> => {
  const errors: string[] = []
  let migratedCount = 0

  try {
    // 로컬 스토리지에서 기존 메모들 가져오기
    const localMemos = localStorageUtils.getMemos()
    
    if (localMemos.length === 0) {
      return {
        success: true,
        migratedCount: 0,
        errors: ['로컬 스토리지에 마이그레이션할 메모가 없습니다.']
      }
    }

    console.log(`${localMemos.length}개의 메모를 Supabase로 마이그레이션 시작...`)

    // 각 메모를 Supabase에 추가
    for (const memo of localMemos) {
      try {
        await supabaseUtils.addMemo(memo)
        migratedCount++
        console.log(`메모 "${memo.title}" 마이그레이션 완료`)
      } catch (error) {
        const errorMsg = `메모 "${memo.title}" 마이그레이션 실패: ${error}`
        errors.push(errorMsg)
        console.error(errorMsg)
      }
    }

    return {
      success: errors.length === 0,
      migratedCount,
      errors
    }
  } catch (error) {
    const errorMsg = `마이그레이션 중 오류 발생: ${error}`
    errors.push(errorMsg)
    console.error(errorMsg)
    
    return {
      success: false,
      migratedCount,
      errors
    }
  }
}

export const clearLocalStorageAfterMigration = (): void => {
  try {
    localStorageUtils.clearMemos()
    console.log('로컬 스토리지 데이터 삭제 완료')
  } catch (error) {
    console.error('로컬 스토리지 데이터 삭제 실패:', error)
  }
}

// 개발용: 샘플 데이터를 Supabase에 직접 추가
export const seedSupabaseData = async (): Promise<void> => {
  const sampleMemos: Memo[] = [
    {
      id: crypto.randomUUID(),
      title: '환영합니다! 🎉',
      content: '# Supabase 메모 앱에 오신 것을 환영합니다!\n\n이제 모든 메모가 클라우드에 안전하게 저장됩니다.\n\n## 주요 기능\n- **실시간 동기화**: 여러 디바이스에서 동일한 메모 확인\n- **안전한 백업**: 데이터 손실 걱정 없음\n- **빠른 검색**: 제목, 내용, 태그로 쉽게 찾기\n\n시작해보세요! ✨',
      category: 'personal',
      tags: ['환영', '시작'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Supabase 마이그레이션 완료',
      content: '로컬 스토리지에서 Supabase 데이터베이스로 성공적으로 마이그레이션되었습니다.\n\n**변경사항:**\n- 모든 CRUD 작업이 이제 데이터베이스와 연동\n- 실시간 데이터 동기화\n- 향상된 데이터 안정성',
      category: 'work',
      tags: ['마이그레이션', 'Supabase', '데이터베이스'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]

  for (const memo of sampleMemos) {
    try {
      await supabaseUtils.addMemo(memo)
      console.log(`샘플 메모 "${memo.title}" 추가 완료`)
    } catch (error) {
      console.error(`샘플 메모 "${memo.title}" 추가 실패:`, error)
    }
  }
}
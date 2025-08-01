'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'

// CSS를 동적으로 로드
const loadMDEditorCSS = () => {
  if (typeof window === 'undefined') return

  // CSS가 이미 로드되었는지 확인
  if (document.querySelector('[data-md-editor-css]')) return

  // 마크를 추가하여 중복 로드 방지
  const marker = document.createElement('div')
  marker.setAttribute('data-md-editor-css', 'loaded')
  marker.style.display = 'none'
  document.head.appendChild(marker)

  // 필요한 CSS 스타일 직접 삽입
  const style = document.createElement('style')
  style.textContent = `
    .w-md-editor {
      background-color: #fff;
      border: 1px solid #d1d5db;
      border-radius: 8px;
    }
    .w-md-editor.w-md-editor-focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
    }
    .w-md-editor-text-textarea, .w-md-editor-text-input, .w-md-editor-text {
      font-size: 14px !important;
      line-height: 1.5 !important;
      color: #374151 !important;
    }
    .w-md-editor-bar {
      border-bottom: 1px solid #e5e7eb;
    }
    .w-md-editor-toolbar {
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }
    .w-md-editor-toolbar-divider {
      background: #e5e7eb;
    }
    .wmde-markdown {
      background: #fff;
      color: #374151;
    }
    .wmde-markdown h1, .wmde-markdown h2, .wmde-markdown h3, 
    .wmde-markdown h4, .wmde-markdown h5, .wmde-markdown h6 {
      color: #111827;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .wmde-markdown p {
      margin-bottom: 1rem;
      line-height: 1.6;
    }
    .wmde-markdown code {
      background: #f3f4f6;
      padding: 0.125rem 0.25rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }
    .wmde-markdown pre {
      background: #f3f4f6;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
    }
    .wmde-markdown blockquote {
      border-left: 4px solid #e5e7eb;
      padding-left: 1rem;
      margin: 1rem 0;
      color: #6b7280;
    }
    .wmde-markdown ul, .wmde-markdown ol {
      padding-left: 2rem !important;
      margin: 1rem 0 !important;
    }
    .wmde-markdown ul {
      list-style-type: disc !important;
      list-style-position: outside !important;
    }
    .wmde-markdown ol {
      list-style-type: decimal !important;
      list-style-position: outside !important;
    }
    .wmde-markdown ul ul {
      list-style-type: circle !important;
      margin-top: 0.5rem !important;
      margin-bottom: 0.5rem !important;
    }
    .wmde-markdown ul ul ul {
      list-style-type: square !important;
    }
    .wmde-markdown ol ol {
      list-style-type: lower-alpha !important;
      margin-top: 0.5rem !important;
      margin-bottom: 0.5rem !important;
    }
    .wmde-markdown li {
      margin-bottom: 0.5rem !important;
      display: list-item !important;
      line-height: 1.6 !important;
    }
    .wmde-markdown li p {
      margin: 0 !important;
    }
    /* Tailwind CSS 리셋 오버라이드 */
    .wmde-markdown ul, .wmde-markdown ol {
      list-style: revert !important;
    }
    .wmde-markdown li {
      list-style: inherit !important;
    }
  `
  document.head.appendChild(style)
}

const MDEditor = dynamic(
  () => {
    loadMDEditorCSS()
    return import('@uiw/react-md-editor').then((mod) => mod.default)
  },
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-48 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        마크다운 에디터 로딩 중...
      </div>
    )
  }
)

interface MDEditorWrapperProps {
  value?: string
  onChange?: (value?: string) => void
  height?: number
  preview?: 'edit' | 'live' | 'preview'
  hideToolbar?: boolean
  textareaProps?: any
  [key: string]: any
}

export default function MDEditorWrapper(props: MDEditorWrapperProps) {
  useEffect(() => {
    loadMDEditorCSS()
  }, [])

  return <MDEditor {...props} />
}
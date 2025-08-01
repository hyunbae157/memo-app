'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
      마크다운 에디터 로딩 중...
    </div>
  )
})

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
  const { height = 300, preview, hideToolbar, ...otherProps } = props
  const editorRef = useRef<HTMLDivElement>(null)
  
  // 프리뷰 전용 모드일 때는 높이를 자동으로 설정
  const isPreviewOnly = preview === 'preview' && hideToolbar
  const finalHeight = isPreviewOnly ? 'auto' : `${height}px`
  const minHeight = isPreviewOnly ? '200px' : `${height}px`

  // ✨ 분할 뷰 최적화 - 필요시 추가 조정 ✨
  useEffect(() => {
    // 분할 뷰가 제대로 로드되도록 약간의 지연 후 최적화
    const timer = setTimeout(() => {
      // 향후 추가 최적화가 필요한 경우 여기에 구현
    }, 100)

    return () => clearTimeout(timer)
  }, [preview, height])
  
  
  return (
    <div 
      ref={editorRef}
      className="w-full"
      style={{ 
        minHeight: minHeight,
        height: finalHeight,
        maxWidth: '100%',
        minWidth: '0',
        overflow: 'visible',
        position: 'relative',
        boxSizing: 'border-box',
        display: 'block',
        visibility: 'visible'
      }}
    >
      <div 
        data-color-mode="light"
        style={{
          minHeight: minHeight,
          height: finalHeight,
          width: '100%',
          display: 'block',
          visibility: 'visible',
          overflow: 'visible'
        }}
      >
        <MDEditor 
          {...otherProps}
          height={isPreviewOnly ? undefined : height}
          preview={preview}
          hideToolbar={hideToolbar}
          style={{
            width: '100%',
            minWidth: '0',
            maxWidth: '100%',
            minHeight: minHeight,
            height: finalHeight,
            backgroundColor: '#ffffff',
            border: isPreviewOnly ? 'none' : '1px solid #d1d5db',
            borderRadius: isPreviewOnly ? '0' : '8px',
            boxSizing: 'border-box',
            display: isPreviewOnly ? 'block' : 'flex',
            flexDirection: 'column',
            visibility: 'visible',
            overflow: 'visible',  
            ...props.style
          }}
          textareaProps={{
            style: {
              fontSize: '14px',
              lineHeight: '1.5',
              color: '#374151',
              backgroundColor: '#ffffff',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              resize: 'none',
              minWidth: '0',
              maxWidth: '100%',
              minHeight: `${height - 50}px`,
              maxHeight: `${height - 50}px`,
              boxSizing: 'border-box',
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              display: 'block',
              visibility: 'visible',
              overflowY: 'auto',
              overflowX: 'hidden',
              ...props.textareaProps?.style
            },
            ...props.textareaProps
          }}
        />
      </div>
    </div>
  )
}
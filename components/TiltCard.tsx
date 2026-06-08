'use client'
import { useRef, useState } from 'react'

export default function TiltCard({ children, className = '' }: {
  children: React.ReactNode; className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState({})
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    setStyle({
      transform: `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale3d(1.02,1.02,1.02)`,
      transition: 'transform .1s ease-out',
    })
  }
  const onLeave = () => setStyle({
    transform: 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)',
    transition: 'transform .4s ease-out',
  })
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={className} style={{ ...style, transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  )
}

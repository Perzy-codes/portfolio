'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

type Exp = {
  id: string
  company: string
  role: string
  period: string
  level: number | null
  current: boolean
  description: string
  tech: string[]
}

function Card({ e }: { e: Exp }) {
  return (
    <div className={`rounded-2xl p-5 border transition-all duration-300 hover:border-white/18 ${
      e.current
        ? 'border-sky-500/30 bg-sky-950/20 shadow-[0_0_30px_rgba(56,189,248,0.06)]'
        : 'border-white/8 bg-white/[0.03]'
    }`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="font-heading font-bold text-white text-sm leading-snug">{e.company}</h4>
        {e.level && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(255,184,0,0.1)', color: '#FFB800', border: '1px solid rgba(255,184,0,0.2)' }}>
            Lv.{e.level}
          </span>
        )}
      </div>
      <p className="text-white/55 text-xs mb-0.5">{e.role}</p>
      <p className="text-white/30 text-[11px] mb-3">{e.period}</p>
      <p className="text-white/45 text-xs leading-relaxed mb-3">{e.description}</p>
      <div className="flex flex-wrap gap-1">
        {e.tech.map(t => (
          <span key={t} className="text-[9px] px-1.5 py-0.5 rounded text-white/35"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {t}
          </span>
        ))}
      </div>
      {e.current && (
        <div className="mt-3 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-[9px] text-sky-400/80 font-semibold tracking-wide uppercase">Current</span>
        </div>
      )}
    </div>
  )
}

export default function ExperienceTimeline({ experiences }: { experiences: Exp[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const boatY = useTransform(scrollYProgress, (v) => {
    const h = containerRef.current?.offsetHeight ?? 600
    return v * Math.max(0, h - 56)
  })

  const mainExps = experiences.filter(e => e.id !== '?')
  const nextExp = experiences.find(e => e.id === '?')

  return (
    <div ref={containerRef} className="relative">
      {/* River line */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-px pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(56,189,248,0.18) 8%, rgba(56,189,248,0.18) 92%, transparent)' }}
      />

      {/* Boat */}
      <motion.div
        className="absolute z-20 pointer-events-none select-none text-2xl"
        style={{ y: boatY, left: 'calc(50% - 14px)' }}
      >
        <span style={{ display: 'inline-block', animation: 'bob 2s ease-in-out infinite' }}>⛵</span>
      </motion.div>

      {/* Desktop: alternating timeline */}
      <div className="hidden md:block">
        {mainExps.map((e, i) => {
          const isLeft = i % 2 === 0
          return (
            <div key={e.id} className="grid grid-cols-[1fr_56px_1fr] items-center mb-16">
              <div className={isLeft ? 'pr-5' : ''}>
                {isLeft && <Card e={e} />}
              </div>
              <div className="flex justify-center relative z-10">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  e.current
                    ? 'bg-sky-400 shadow-[0_0_12px_4px_rgba(56,189,248,0.55)]'
                    : 'bg-[#080e1c] border-2 border-white/25'
                }`} />
              </div>
              <div className={!isLeft ? 'pl-5' : ''}>
                {!isLeft && <Card e={e} />}
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile: left-border stack */}
      <div className="md:hidden border-l border-sky-500/15 ml-3 pl-6">
        {mainExps.map(e => (
          <div key={e.id} className="relative mb-8">
            <div
              className={`absolute -left-[1.85rem] top-4 w-2 h-2 rounded-full ${
                e.current ? 'bg-sky-400' : 'bg-white/20 border border-white/30'
              }`}
            />
            <Card e={e} />
          </div>
        ))}
      </div>

      {/* Destination marker */}
      {nextExp && (
        <div className="flex flex-col items-center mt-4 pb-4">
          <div className="text-white/15 text-sm tracking-[0.4em] mb-4">· · ·</div>
          <div className="text-center rounded-2xl px-8 py-5 border border-white/8 bg-white/[0.02] max-w-xs w-full">
            <p className="text-white/25 text-[10px] uppercase tracking-[0.28em] mb-2">Next Port</p>
            <h4 className="font-heading font-bold text-white text-lg mb-1">{nextExp.company}</h4>
            <p className="text-white/45 text-sm mb-1">{nextExp.role}</p>
            <p className="text-white/25 text-xs mb-3">{nextExp.period}</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {nextExp.tech.map(t => (
                <span key={t} className="text-[9px] px-1.5 py-0.5 rounded text-white/35"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

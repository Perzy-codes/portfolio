'use client'
import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import Nav from '@/components/Nav'
import HeroScene from '@/components/HeroScene'
import FadeUp from '@/components/FadeUp'
import TiltCard from '@/components/TiltCard'
import TrailMap from '@/components/TrailMap'
import PhotoReveal from '@/components/PhotoReveal'
import ChatBot from '@/components/ChatBot'
import RecruiterView from '@/components/RecruiterView'
import { experiences, achievements, projects, skills, socialLinks } from '@/lib/data'


// Experiences shown as cards (excludes the "What's next?" destination node)
const cardExps = experiences.filter(e => e.id !== '?')

// Featured (legendary) project rendered separately from the grid
const featuredProject = projects.find(p => p.featured)
const gridProjects = projects.filter(p => !p.featured)

// Rarity system: encodes real signal. Legendary = live product with users,
// Epic = published/awarded, Rare = end-to-end build.
const RARITY: Record<string, { label: string; color: string; bg: string; border: string }> = {
  legendary: { label: 'Legendary', color: '#FFB800', bg: 'rgba(255,184,0,.12)',  border: 'rgba(255,184,0,.55)' },
  epic:      { label: 'Epic',      color: '#C084FC', bg: 'rgba(192,132,252,.12)', border: 'rgba(192,132,252,.5)' },
  rare:      { label: 'Rare',      color: '#60A5FA', bg: 'rgba(96,165,250,.12)',  border: 'rgba(96,165,250,.5)' },
}

function RarityTag({ rarity }: { rarity: string }) {
  const r = RARITY[rarity] ?? RARITY.rare
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[.14em] px-2 py-0.5 rounded-full"
      style={{ color: r.color, background: r.bg, border: `1px solid ${r.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: r.color }} />
      {r.label}
    </span>
  )
}

// Counts up to `end` once the element scrolls into view.
function CountUp({ end, duration = 1400 }: { end: number; duration?: number }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - p, 3)
        setVal(Math.round(end * eased))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [end, duration])
  return <span ref={ref}>{val}</span>
}

export default function Home() {
  const [activeExp, setActiveExp] = useState(0)
  const [, setChatOpen] = useState(false)
  const [recruiterMode, setRecruiterMode] = useState(false)

  // Restore the visitor's previous choice
  useEffect(() => {
    if (localStorage.getItem('recruiterMode') === '1') setRecruiterMode(true)
  }, [])
  const toggleMode = () => setRecruiterMode(m => {
    const next = !m
    localStorage.setItem('recruiterMode', next ? '1' : '0')
    return next
  })
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const [nodeYs, setNodeYs] = useState<number[]>([])

  useLayoutEffect(() => {
    const measure = () => {
      const container = cardsContainerRef.current
      if (!container) return
      const cr = container.getBoundingClientRect()
      if (cr.height === 0) return
      // Build nodeYs for ALL experiences; ? node uses its data y, others use card positions
      const ys = experiences.map(e => {
        if (e.id === '?') return e.y
        const ci = cardExps.findIndex(c => c.id === e.id)
        const ref = cardRefs.current[ci]
        if (!ref) return e.y
        const r = ref.getBoundingClientRect()
        return (r.top - cr.top + r.height / 2) / cr.height
      })
      setNodeYs(ys)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const exp = experiences[activeExp]
    if (!exp || exp.id === '?') return
    const ci = cardExps.findIndex(e => e.id === exp.id)
    const ref = cardRefs.current[ci]
    if (ref) ref.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [activeExp])

  // Header mode toggle: ⚔️ Adventure / 📄 Recruiter. Always visible, top-right.
  const ModeToggle = (
    <button
      onClick={toggleMode}
      aria-pressed={recruiterMode}
      aria-label={recruiterMode ? 'Switch to Adventure mode' : 'Switch to Recruiter mode'}
      className="fixed top-4 right-4 z-[60] flex items-center gap-1 rounded-full p-1 text-xs font-semibold shadow-lg backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      style={recruiterMode
        ? { background: '#fff', border: '1px solid rgba(0,0,0,.12)' }
        : { background: 'rgba(20,16,10,.85)', border: '1px solid rgba(255,184,0,.35)' }}
    >
      <span className={`px-2.5 py-1 rounded-full transition-colors ${!recruiterMode ? 'bg-primary text-white' : 'text-neutral-500'}`}>⚔️ Adventure</span>
      <span className={`px-2.5 py-1 rounded-full transition-colors ${recruiterMode ? 'bg-neutral-900 text-white' : 'text-amber-200/70'}`}>📄 Recruiter</span>
    </button>
  )

  if (recruiterMode) {
    return (
      <>
        {ModeToggle}
        <RecruiterView />
      </>
    )
  }

  return (
    <main>
      {ModeToggle}
      <Nav onChatOpen={() => setChatOpen(true)} />

      {/* ── HERO ── */}
      <HeroScene />

      {/* ── ABOUT ── */}
      <section id="about" className="cave-bg relative min-h-screen flex flex-col justify-center py-16 px-6 overflow-clip">
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 120px 40px rgba(0,0,0,.5)' }} />
        {/* Vine left */}
        <svg className="absolute top-0 left-0 bottom-0 w-20 pointer-events-none opacity-70 z-0" viewBox="0 0 80 600" fill="none">
          <path d="M40,0 Q25,80 40,160 Q55,240 35,320 Q20,400 40,480 Q57,540 40,600" stroke="#2D5016" strokeWidth="1.8"/>
          <ellipse cx="30" cy="95" rx="14" ry="7" fill="#1a3a0a" transform="rotate(-20 30 95)"/>
          <ellipse cx="48" cy="220" rx="13" ry="6" fill="#2D5016" transform="rotate(18 48 220)"/>
          <ellipse cx="28" cy="340" rx="14" ry="7" fill="#1a3a0a" transform="rotate(-22 28 340)"/>
          <g transform="translate(16,390)">
            <ellipse cx="7" cy="5" rx="6" ry="4.5" fill="#FF8236" opacity=".9"/>
            <ellipse cx="22" cy="5" rx="6" ry="4.5" fill="#FF8236" opacity=".9"/>
            <ellipse cx="7" cy="5" rx="2.5" ry="3" fill="#FFD700"/>
            <ellipse cx="22" cy="5" rx="2.5" ry="3" fill="#FFD700"/>
            <line x1="14.5" y1="9" x2="14.5" y2="20" stroke="#FF8236" strokeWidth="1.8"/>
          </g>
        </svg>
        {/* Vine right */}
        <svg className="absolute top-0 right-0 bottom-0 w-20 pointer-events-none opacity-70 z-0" viewBox="0 0 80 600" fill="none" style={{ transform:'scaleX(-1)' }}>
          <path d="M40,0 Q25,80 40,160 Q55,240 35,320 Q20,400 40,480 Q57,540 40,600" stroke="#2D5016" strokeWidth="1.8"/>
          <ellipse cx="30" cy="95" rx="14" ry="7" fill="#1a3a0a" transform="rotate(-20 30 95)"/>
          <ellipse cx="48" cy="220" rx="13" ry="6" fill="#2D5016" transform="rotate(18 48 220)"/>
          <ellipse cx="28" cy="340" rx="14" ry="7" fill="#1a3a0a" transform="rotate(-22 28 340)"/>
          <g transform="translate(16,390)">
            <ellipse cx="7" cy="5" rx="6" ry="4.5" fill="#FF8236" opacity=".9"/>
            <ellipse cx="22" cy="5" rx="6" ry="4.5" fill="#FF8236" opacity=".9"/>
            <ellipse cx="7" cy="5" rx="2.5" ry="3" fill="#FFD700"/>
            <ellipse cx="22" cy="5" rx="2.5" ry="3" fill="#FFD700"/>
            <line x1="14.5" y1="9" x2="14.5" y2="20" stroke="#FF8236" strokeWidth="1.8"/>
          </g>
        </svg>

        <div className="max-w-5xl mx-auto relative z-20">
          <FadeUp><p className="text-xs font-medium text-primary uppercase tracking-[.28em] mb-1">About</p></FadeUp>
          <FadeUp delay={.1}><h2 className="font-heading font-bold text-5xl text-white mb-8">Character Sheet</h2></FadeUp>

          <FadeUp delay={.15} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Photo card */}
            <TiltCard>
              <div className="rounded-xl overflow-hidden border-2 relative" style={{ aspectRatio:'.95', background:'#1a1208', borderColor:'rgba(255,130,54,.3)', boxShadow:'0 8px 40px rgba(0,0,0,.5)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/me3.png" alt="Pratham Dabas" className="absolute inset-0 w-full h-full object-cover object-top" />
                <PhotoReveal revealSrc="/me4.png" offsetY={-0.07} />
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10 flex justify-between items-end" style={{ background:'linear-gradient(transparent,rgba(0,0,0,.85))' }}>
                  <div>
                    <p className="font-heading font-bold text-xl text-white">Pratham Dabas</p>
                    <p className="text-xs text-white/60 uppercase tracking-widest">Explorer</p>
                  </div>
                  <p className="font-heading font-bold text-lg text-white/75">Lv. 26</p>
                </div>
              </div>
            </TiltCard>

            {/* Bio card */}
            <div className="rounded-xl p-6 border border-white/12 flex flex-col gap-4" style={{ background:'#1e1c1a' }}>
              <p className="text-sm text-white/80 leading-relaxed">
                Hi, I&apos;m <strong className="text-white">Pratham Dabas</strong>, a Data Scientist with an MS in Data Science from the{' '}
                <span className="text-primary font-semibold">University of Maryland</span>{' '}
                (<strong>GPA 3.83</strong>, Class of 2026) and <strong>4 years</strong> at S&amp;P Global shipping real ML systems: OTC derivatives post-trade analytics, RAG chatbots, and fine-tuned LLMs. I build, ship, and keep experimenting.
              </p>
              <div className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 max-w-full text-sm font-medium" style={{ background:'rgba(74,138,80,.12)', border:'2px solid rgba(74,138,80,.3)', color:'#6db870' }}>
                🟢 Open to DS / ML / AI roles · New York City · Available July 2026
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 max-w-full text-sm text-white/90" style={{ background:'rgba(255,130,54,.1)', border:'2px solid rgba(255,130,54,.25)' }}>
                🎓 UMD · MS Data Science · Class of 2026 · GPA <strong>3.83</strong>
              </div>
              <div className="h-px bg-white/10" />
              <div>
                <p className="text-[.6rem] text-primary uppercase tracking-[.22em] mb-3">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map(s => <span key={s} className="text-xs px-2.5 py-1 rounded text-white/80 border border-white/18" style={{ background:'rgba(255,255,255,.1)' }}>{s}</span>)}
                </div>
              </div>
              <div className="h-px bg-white/10" />
              <div>
                <p className="text-[.6rem] text-primary uppercase tracking-[.22em] mb-3">Connect</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <a href="https://www.linkedin.com/in/pratham-dabas-218007137/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-white/18 flex items-center justify-center text-white/50 hover:text-primary hover:border-primary/50 transition-colors text-sm" style={{ background:'rgba(255,255,255,.06)' }}>in</a>
                  <a href="mailto:dabaspratham28@gmail.com" className="w-9 h-9 rounded-full border border-white/18 flex items-center justify-center text-white/50 hover:text-primary hover:border-primary/50 transition-colors" style={{ background:'rgba(255,255,255,.06)' }}>✉</a>
                  <a href="https://github.com/Perzy-codes" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full border border-white/18 flex items-center justify-center text-white/50 hover:text-primary hover:border-primary/50 transition-colors" style={{ background:'rgba(255,255,255,.06)' }}>⌥</a>
                  <a href="https://drive.google.com/file/d/181aUxS9S7HsAcz2a4fgsVS-FZCl-apWu/view?usp=drive_link" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-primary hover:bg-primary/22 transition-colors" style={{ background:'rgba(255,130,54,.12)', border:'1px solid rgba(255,130,54,.35)' }}>⬇ Resume</a>
                </div>
              </div>
              <p className="text-xs text-white/40 text-center">Loves DJing · Loves travelling · Loves exploring</p>
            </div>
          </FadeUp>

          {/* Achievements */}
          <FadeUp delay={.2} className="mt-16">
            <p className="text-[.6rem] text-primary uppercase tracking-[.28em] text-center mb-8">Achievements Unlocked</p>
            <div className="flex flex-nowrap justify-start sm:justify-center gap-4 sm:gap-6 overflow-x-auto overflow-y-visible py-3 -mx-6 px-6 sm:mx-0 sm:px-0">
              {achievements.map(a => (
                <div key={a.label} className="group flex flex-col items-center gap-2 w-[92px] flex-shrink-0 text-center cursor-default">
                  <div className="relative">
                    <div className="relative w-[70px] h-[70px] rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-105 overflow-hidden" style={{ borderColor:a.color, background:`${a.color}1a` }}>
                      <div className="absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-90 transition-opacity" style={{ background:a.color }} />
                      <div className="relative z-10 w-[50px] h-[50px] rounded-full flex items-center justify-center font-heading font-bold text-xs" style={{ background:'#1e1c1a', border:`2px solid ${a.color}`, color:a.color }}>{a.rank}</div>
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-1.5 rounded-b-full" style={{ background:a.color }} />
                  </div>
                  <p className="text-white text-xs font-semibold leading-tight">{a.label}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="treasure-map-bg relative py-20 px-6 md:px-10 overflow-x-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow:'inset 0 0 120px 40px rgba(60,40,20,.7)' }} />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <FadeUp><p className="text-xs text-[#5C4A3A] uppercase tracking-[.22em] mb-1">Journey So Far</p></FadeUp>
          <FadeUp delay={.1}><h2 className="font-heading font-bold text-5xl text-[#1a1208] mb-1">Experience</h2></FadeUp>
          <FadeUp delay={.15}><p className="text-[#5C4A3A]/70 italic mb-8">Every stop, a story. Every role, a relic.</p></FadeUp>
          <FadeUp delay={.2} className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-10 items-start lg:items-stretch w-full">
            <TrailMap active={activeExp} onSelect={setActiveExp} experiences={experiences} nodeYs={nodeYs} />
            <div ref={cardsContainerRef} className="min-w-0">
              <p className="text-[.6rem] text-[#8B6F47] uppercase tracking-[.2em] mb-3">Campsites Along the Trail</p>
              <div className="flex flex-col gap-4">
                {cardExps.map((e, ci) => {
                  const fullIdx = experiences.findIndex(x => x.id === e.id)
                  const isActive = fullIdx === activeExp
                  return (
                  <div key={e.id} ref={el => { cardRefs.current[ci] = el }} onClick={() => setActiveExp(fullIdx)} onMouseEnter={() => setActiveExp(fullIdx)}
                    className={`rounded-2xl border cursor-pointer transition-all duration-300 ${isActive ? 'bg-white border-[#A08060] shadow-2xl p-7 scale-[1.015]' : 'bg-[#FFF8F0]/80 border-[#D4B896]/40 hover:bg-white/90 hover:border-[#8B6F47]/50 p-6'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {'logo' in e && e.logo
                          ? <img src={e.logo as string} alt={e.company} className="w-8 h-8 rounded-full object-contain flex-shrink-0 bg-white border border-[#D4B896]/40" />
                          : <div className="w-8 h-8 rounded-full border flex items-center justify-center text-[11px] font-heading font-bold flex-shrink-0" style={e.current ? { background:'rgba(74,138,80,.08)', borderColor:'#4a8a50cc', color:'#4a8a50' } : { background:'rgba(92,74,58,.1)', borderColor:'#8B6F4780', color:'#5C4A3A' }}>{e.id.toUpperCase()}</div>
                        }
                        <div>
                          <h4 className="font-heading font-bold text-sm text-[#1a1208] leading-tight">{e.company} {e.current && <span className="text-[9px] text-[#4a8a50] italic ml-1">current</span>}</h4>
                          <p className="text-[#3A2A1A]/80 text-xs font-medium">{e.role}</p>
                        </div>
                      </div>
                      {e.level && <span className="text-[8px] font-bold bg-[#8B6F47]/10 text-[#8B6F47] px-2 py-0.5 rounded-full flex-shrink-0">{`Lv. ${e.level}`}</span>}
                    </div>
                    <p className="text-[#8B6F47] text-xs mb-3 ml-11">{e.period}</p>
                    <p className="text-[#3A2A1A]/70 text-xs leading-relaxed mb-3 ml-11">{e.description}</p>
                    <div className="flex flex-wrap gap-1.5 ml-11">{e.tech.map(t => <span key={t} className="text-[10px] bg-[#F4E3C3] border border-[#D4B896] rounded-full px-2.5 py-0.5 text-[#3A2A1A]">{t}</span>)}</div>
                  </div>
                  )
                })}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="py-24 px-6" style={{ background:'#0f0f0f' }}>
        <div className="max-w-6xl mx-auto">
          <FadeUp><p className="text-xs text-amber-500/60 uppercase tracking-[.28em] mb-1">Work</p></FadeUp>
          <FadeUp delay={.1}><h2 className="font-heading font-bold text-5xl text-white mb-2">Projects</h2></FadeUp>
          <FadeUp delay={.15}><p className="text-white/35 mb-14">things i built, studied, and shipped.</p></FadeUp>

          {/* ── Featured Legendary card (Otto) ── */}
          {featuredProject && (
            <FadeUp className="mb-5">
              <div
                className="legendary-card group relative flex flex-col lg:flex-row gap-6 rounded-2xl p-6 sm:p-8 overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                style={{ background:'linear-gradient(135deg, rgba(255,184,0,.06), rgba(20,16,8,.6) 55%)', border:'1px solid rgba(255,184,0,.3)' }}>
                {/* Stretched background link → main beta page (clicking anywhere on the card) */}
                <a href={featuredProject.github} target="_blank" rel="noreferrer"
                  aria-label="Open Otto private beta" className="absolute inset-0 z-[1]" />
                {/* sheen sweep */}
                <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 opacity-0 group-hover:opacity-100 z-[2]"
                  style={{ background:'linear-gradient(90deg,transparent,rgba(255,184,0,.14),transparent)', animation:'legendary-sheen 1.1s ease-out' }} />

                {/* Left: copy */}
                <div className="relative flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-4">
                    <RarityTag rarity="legendary" />
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-300/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow:'0 0 6px #34d399' }} />
                      Live product
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-1">{featuredProject.title}</h3>
                  <p className="text-amber-300/90 text-sm font-medium mb-4">self-organizing AI notes</p>
                  <p className="text-white/55 text-sm leading-relaxed mb-5 max-w-xl">{featuredProject.about}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {featuredProject.tech.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-md text-amber-200/70"
                        style={{ background:'rgba(255,184,0,.08)', border:'1px solid rgba(255,184,0,.2)' }}>{t}</span>
                    ))}
                  </div>
                  <a href="https://otto-beige.vercel.app/login" target="_blank" rel="noreferrer"
                    className="relative z-[3] inline-flex items-center gap-1.5 text-sm font-bold text-amber-400 hover:gap-2.5 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 rounded">
                    Visit live product →
                  </a>
                </div>

                {/* Right: live counter + stats */}
                <div className="relative flex flex-col justify-center gap-3 lg:w-[230px] flex-shrink-0 rounded-xl p-5"
                  style={{ background:'rgba(0,0,0,.28)', border:'1px solid rgba(255,184,0,.18)' }}>
                  <div className="text-center">
                    <p className="font-heading font-bold text-5xl text-amber-400 tracking-tight" style={{ textShadow:'0 0 24px rgba(255,184,0,.4)' }}>
                      <CountUp end={231} />
                    </p>
                    <p className="text-amber-200/70 text-[11px] uppercase tracking-[.18em] mt-1">adventurers enrolled</p>
                  </div>
                  <div className="h-px bg-amber-500/15" />
                  <div className="flex justify-between text-xs">
                    <span className="text-white/45">Applied</span>
                    <span className="text-white/80 font-semibold">YC S26</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/45">Gross margin</span>
                    <span className="text-white/80 font-semibold">93% at 1K MAU</span>
                  </div>
                </div>
              </div>
            </FadeUp>
          )}

          {/* ── Rest of the grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gridProjects.map((p, i) => (
              <FadeUp key={p.title} delay={i * .06}>
                <a href={p.github} target="_blank" rel="noreferrer" className="group flex flex-col h-full rounded-2xl p-6 border border-white/8 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1"
                  style={{ background:'rgba(255,255,255,0.03)' }}>
                  {/* Rarity label */}
                  <div className="mb-3"><RarityTag rarity={p.rarity} /></div>
                  {/* Metric (leads) */}
                  <p className="font-heading font-bold text-[1.7rem] leading-tight text-amber-400 mb-1 tracking-tight">{p.metric.split('·')[0].trim()}</p>
                  {p.metric.includes('·') && (
                    <p className="text-amber-400/55 text-[11px] font-medium mb-3">{p.metric.split('·').slice(1).join(' · ').trim()}</p>
                  )}
                  {/* Title */}
                  <h3 className="font-heading font-bold text-lg text-white mb-1.5 group-hover:text-amber-400 transition-colors">{p.title}</h3>
                  {/* What it is */}
                  <p className="text-white/55 text-xs leading-relaxed mb-1">{p.achievement}</p>
                  <p className="text-white/35 text-xs leading-relaxed mb-5 flex-1">{p.about}</p>
                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {p.tech.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-md text-white/50"
                        style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.09)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </a>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONNECT ── */}
      <section id="connect" className="py-20 px-6" style={{ background:'#f0f7e4' }}>
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp><p className="text-xs text-earth uppercase tracking-[.28em] mb-1">Treasure Found</p></FadeUp>
          <FadeUp delay={.1}><h2 className="font-heading font-bold text-5xl text-forest mb-2">Let&apos;s Connect</h2></FadeUp>
          <FadeUp delay={.15}><p className="text-forest/40 italic mb-10">take what you need, adventurer.</p></FadeUp>
          <FadeUp delay={.2}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name:'Resume',    icon:'resume',    desc:'Full adventure log.',  action:'LOOT →',    color:'#FF8236', href:'https://drive.google.com/file/d/181aUxS9S7HsAcz2a4fgsVS-FZCl-apWu/view?usp=drive_link', first:true },
                { name:'LinkedIn',  icon:'linkedin',  desc:'Join the party.',      action:'CONNECT →', color:'#0A66C2', href:'https://www.linkedin.com/in/pratham-dabas-218007137/' },
                { name:'Email',     icon:'email',     desc:'Send a raven.',        action:'MESSAGE →', color:'#FF8236', href:'mailto:dabaspratham28@gmail.com' },
                { name:'Calendar',  icon:'calendar',  desc:'Book 15 min.',         action:'BOOK →',    color:'#4a8a50', href:'https://cal.com/pratham-dabas-98/15min' },
                { name:'GitHub',    icon:'github',    desc:'See the arsenal.',     action:'EXPLORE →', color:'#1a2814', href:'https://github.com/Perzy-codes' },
                { name:'Instagram', icon:'instagram', desc:'See the life.',        action:'FOLLOW →',  color:'#E1306C', href:'https://www.instagram.com/perzy89' },
              ].map(c => {
                const icons: Record<string, React.ReactNode> = {
                  resume: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
                    </svg>
                  ),
                  linkedin: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  ),
                  email: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  ),
                  github: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                  ),
                  calendar: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
                    </svg>
                  ),
                  instagram: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                  ),
                }
                return (
                  <a key={c.name} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="block rounded-2xl border-2 p-5 text-center bg-white hover:-translate-y-2 transition-all duration-300 hover:shadow-xl"
                    style={{ borderColor: c.first ? '#FF8236' : 'rgba(45,80,22,.1)' }}>
                    <div className="flex justify-center mb-3" style={{ color: c.color }}>{icons[c.icon]}</div>
                    <p className="font-heading font-bold text-sm text-[#1a2814] mb-1">{c.name}</p>
                    <p className="text-forest/40 text-xs mb-3 hidden sm:block">{c.desc}</p>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color:c.color }}>{c.action}</p>
                  </a>
                )
              })}
            </div>
          </FadeUp>
          <FadeUp delay={.3}><p className="mt-12 text-forest/40 italic text-sm">the adventure never ends.</p></FadeUp>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-night py-16 px-6 text-center">
        <div className="flex justify-center gap-4 mb-8">
          {socialLinks.map(l => (
            <a key={l.label} href={l.url} target={l.url.startsWith('http') ? '_blank' : undefined} rel="noreferrer" aria-label={l.label}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/50 transition-colors"
              style={{ background:'rgba(255,255,255,.05)' }}>
              {l.icon === 'linkedin' ? 'in' : l.icon === 'mail' ? '✉' : '⌥'}
            </a>
          ))}
        </div>
        <p className="font-heading text-white/20 text-sm">the adventure never ends.</p>
        <p className="text-white/15 text-xs mt-1">© 2026 Pratham Dabas</p>
      </footer>

      <ChatBot />
    </main>
  )
}

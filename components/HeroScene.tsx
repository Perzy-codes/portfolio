'use client'
import { useEffect, useRef } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function HeroScene() {
  const starRef = useRef<HTMLCanvasElement>(null)
  const eyesRef = useRef<HTMLCanvasElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  // Stars
  useEffect(() => {
    const c = starRef.current, h = heroRef.current
    if (!c || !h) return
    const resize = () => { c.width = h.offsetWidth; c.height = h.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    const ctx = c.getContext('2d')!
    const stars = Array.from({ length: 250 }, () => ({
      x: Math.random(), y: Math.random() * .62,
      r: Math.random() * 1.2 + .2, a: Math.random(), da: (Math.random() - .5) * .003
    }))
    // Reduced motion: paint a single static starfield, skip the animation loop.
    if (prefersReducedMotion()) {
      stars.forEach(s => {
        ctx.beginPath(); ctx.arc(s.x * c.width, s.y * c.height, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,252,240,${s.a})`; ctx.fill()
      })
      return () => window.removeEventListener('resize', resize)
    }
    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height)
      stars.forEach(s => {
        s.a = Math.max(.05, Math.min(1, s.a + s.da))
        if (s.a <= .05 || s.a >= 1) s.da *= -1
        ctx.beginPath(); ctx.arc(s.x * c.width, s.y * c.height, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,252,240,${s.a})`; ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf) }
  }, [])

  // Eyes
  useEffect(() => {
    const c = eyesRef.current, h = heroRef.current
    if (!c || !h) return
    if (prefersReducedMotion()) return  // skip the interactive eye-glow loop
    const resize = () => { const r = h.getBoundingClientRect(); c.width = r.width; c.height = r.height * .32 }
    resize(); window.addEventListener('resize', resize)
    const ctx = c.getContext('2d')!
    const EYES = [
      {x:.08,y:.55,c:'#FF6060'},{x:.18,y:.70,c:'#60FF90'},{x:.04,y:.40,c:'#FFE040'},
      {x:.92,y:.60,c:'#60CCFF'},{x:.82,y:.45,c:'#FF80E0'},{x:.96,y:.35,c:'#80FF80'},
      {x:.30,y:.80,c:'#FF9050'},{x:.70,y:.75,c:'#CC80FF'},
    ]
    let mx: number|null = null, my: number|null = null
    const opacities = EYES.map(() => 0)
    const onMove = (e: MouseEvent) => {
      const r = h.getBoundingClientRect()
      const ry = e.clientY - r.bottom + c.height
      mx = (e.clientX - r.left) / c.width; my = ry / c.height
    }
    const onLeave = () => { mx = null; my = null }
    h.addEventListener('mousemove', onMove); h.addEventListener('mouseleave', onLeave)
    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height)
      EYES.forEach((eye, i) => {
        const target = mx !== null ? Math.max(0, 1 - Math.sqrt((mx-eye.x)**2+(my!-eye.y)**2)/.18) : 0
        opacities[i] += (target - opacities[i]) * .08
        if (opacities[i] < .02) return
        ctx.save(); ctx.globalAlpha = opacities[i]
        ctx.fillStyle = eye.c; ctx.shadowColor = eye.c; ctx.shadowBlur = 8
        ctx.beginPath(); ctx.ellipse(eye.x*c.width-8, eye.y*c.height, 7, 5, 0, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.ellipse(eye.x*c.width+8, eye.y*c.height, 7, 5, 0, 0, Math.PI*2); ctx.fill()
        ctx.restore()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener('resize', resize); h.removeEventListener('mousemove', onMove); h.removeEventListener('mouseleave', onLeave); cancelAnimationFrame(raf) }
  }, [])

  return (
    <section id="hero" ref={heroRef} className="relative h-screen min-h-[600px] overflow-hidden flex items-center justify-center">
      {/* Sky */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#080E1C 0%,#0B1420 50%,#0E1A16 100%)' }} />
      <canvas ref={starRef} className="absolute inset-0 pointer-events-none z-[1]" />
      {/* Moon */}
      <div className="absolute top-[8%] right-[12%] w-[50px] h-[50px] rounded-full z-[2]"
        style={{ background:'#FFF8E8', boxShadow:'0 0 40px 10px rgba(255,248,232,.2),0 0 80px 30px rgba(255,248,232,.08)', animation:'moon-float 7s ease-in-out infinite' }} />
      {/* Fireflies */}
      {[...Array(7)].map((_, i) => (
        <div key={i} className={`firefly firefly-d${i} absolute w-1.5 h-1.5 rounded-full z-[7] pointer-events-none`}
          style={{ background:'#FFE080', boxShadow:'0 0 6px #FFB800', left:`${18+i*11}%`, bottom:`${40+((i*7)%20)}%` }} />
      ))}
      {/* Hills */}
      <svg className="absolute bottom-0 left-0 w-full pointer-events-none z-[8]" viewBox="0 0 1440 340" preserveAspectRatio="xMidYMax slice" style={{ height:'45%' }}>
        <path d="M0,200 C60,160 140,110 280,140 C420,168 500,110 640,125 C780,140 860,90 1000,115 C1120,136 1240,100 1440,120 L1440,340 L0,340Z" fill="#0a1a0c"/>
        <path d="M0,245 C100,200 200,168 360,192 C520,215 620,168 780,178 C940,188 1040,148 1200,172 C1320,190 1400,165 1440,172 L1440,340 L0,340Z" fill="#0d1f0f"/>
        <path d="M0,275 C120,248 240,228 380,248 C520,268 640,245 780,252 C920,258 1060,240 1200,252 C1330,262 1400,250 1440,252 L1440,340 L0,340Z" fill="#111f13"/>
        <rect x="0" y="295" width="1440" height="45" fill="#0f1c11"/>
      </svg>
      {/* Eyes canvas */}
      <canvas ref={eyesRef} className="absolute bottom-0 left-0 w-full pointer-events-auto z-[12]" style={{ height:'32%' }} />
      {/* Campfire */}
      <div className="absolute z-[11] flex flex-col items-center" style={{ bottom:'14.5%', left:'50%', transform:'translateX(-50%)' }}>
        <div className="relative w-9 h-11">
          <div className="campfire-flame-1 flame absolute bottom-[5px] left-[8px] w-5 h-[30px] rounded-[50%_50%_22%_22%]" style={{ background:'#FF8236', transformOrigin:'bottom center' }} />
          <div className="campfire-flame-2 flame absolute bottom-[5px] left-[10.5px] w-[15px] h-6 rounded-[50%_50%_22%_22%]" style={{ background:'#FFB800', transformOrigin:'bottom center' }} />
          <div className="campfire-flame-3 flame absolute bottom-[5px] left-[13.5px] w-[9px] h-4 rounded-[50%_50%_22%_22%]" style={{ background:'#FFD966', transformOrigin:'bottom center' }} />
          <div className="campfire-flame-4 flame absolute bottom-[5px] left-[15.5px] w-[5px] h-[10px] rounded-[50%_50%_22%_22%]" style={{ background:'#FFF0D0', transformOrigin:'bottom center' }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[26px] h-[7px] rounded-[50%]" style={{ background:'#5C3D1E' }} />
        </div>
        <div className="w-[70px] h-[22px]" style={{ background:'radial-gradient(ellipse,rgba(255,130,54,.5) 0%,transparent 70%)', filter:'blur(5px)', marginTop:'-3px', animation:'treasure-glow .9s ease-in-out infinite alternate' }} />
      </div>
      {/* Text */}
      <div className="relative z-10 text-center px-6 -mt-[12vh]">
        <p className="text-white/30 text-[.7rem] tracking-[.3em] uppercase mb-4" style={{ animation:'fadeUp .6s ease .3s both' }}>
          a new quest begins
        </p>
        <h1 className="font-heading font-black leading-[.85]" style={{ fontSize:'clamp(4.5rem,14vw,12rem)', animation:'fadeUp .6s ease .5s both' }}>
          <span className="block text-primary">Pratham</span>
          <span className="block text-white">Dabas</span>
        </h1>
      </div>
      {/* Venture forth */}
      <div className="absolute bottom-[22%] z-20 text-center" style={{ animation:'fadeUp .6s ease 1.1s both' }}>
        <span className="block text-white/35 text-[.6rem] tracking-[.28em] uppercase mb-2">venture forth</span>
        <a href="#about" className="text-primary inline-block" style={{ animation:'bob 1.8s ease-in-out infinite' }}>↓</a>
      </div>
    </section>
  )
}

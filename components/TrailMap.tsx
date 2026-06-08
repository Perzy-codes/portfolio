'use client'
import { useEffect, useRef } from 'react'

type Experience = { id: string; company: string; period: string; level: number | null; current: boolean; x: number; y: number }

type Pt = { x: number; y: number }
type Seg = { s: Pt; cp1: Pt; cp2: Pt; e: Pt }

function catmullSegments(pts: Pt[]): Seg[] {
  return pts.slice(0, -1).map((_, i) => {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)]
    return {
      s:   p1,
      cp1: { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
      cp2: { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
      e:   p2,
    }
  })
}

function bezierAt(seg: Seg, t: number): Pt {
  const m = 1 - t
  return {
    x: m*m*m*seg.s.x + 3*m*m*t*seg.cp1.x + 3*m*t*t*seg.cp2.x + t*t*t*seg.e.x,
    y: m*m*m*seg.s.y + 3*m*m*t*seg.cp1.y + 3*m*t*t*seg.cp2.y + t*t*t*seg.e.y,
  }
}

function drawBoat(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  ctx.translate(x, y)
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)'
  ctx.beginPath(); ctx.ellipse(1, 4, 8, 2.5, 0, 0, Math.PI * 2); ctx.fill()
  // Hull
  ctx.beginPath()
  ctx.moveTo(-9, -1); ctx.lineTo(9, -1); ctx.lineTo(7, 4); ctx.lineTo(-7, 4); ctx.closePath()
  ctx.fillStyle = 'rgba(110,75,35,0.92)'; ctx.fill()
  ctx.strokeStyle = 'rgba(60,38,18,0.6)'; ctx.lineWidth = 0.8; ctx.stroke()
  // Mast
  ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(0, -15)
  ctx.strokeStyle = 'rgba(80,55,25,0.8)'; ctx.lineWidth = 1.2; ctx.stroke()
  // Sail
  ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(0, -14); ctx.lineTo(9, -2); ctx.closePath()
  ctx.fillStyle = 'rgba(238,218,178,0.85)'; ctx.fill()
  ctx.strokeStyle = 'rgba(180,150,100,0.4)'; ctx.lineWidth = 0.5; ctx.stroke()
  ctx.restore()
}

export default function TrailMap({ active, onSelect, experiences, nodeYs }: { active: number; onSelect: (i: number) => void; experiences: Experience[]; nodeYs?: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const boatRef   = useRef(0)
  const targetRef = useRef(0)
  const activeRef = useRef(active)
  const rafRef    = useRef(0)

  activeRef.current = active

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current; if (!el) return
      const r = el.getBoundingClientRect()
      // Start when section top crosses viewport midpoint, end when section bottom reaches midpoint
      targetRef.current = Math.max(0, Math.min(1, (window.innerHeight * 0.5 - r.top) / r.height))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current, wrap = wrapRef.current
    if (!canvas || !wrap) return

    const draw = () => {
      const W = wrap.offsetWidth, H = wrap.offsetHeight
      canvas.width = W; canvas.height = H
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, W, H)
      const act = activeRef.current

      // Mountains
      ctx.fillStyle = 'rgba(160,130,90,.18)'
      ;[[.12,.45],[.55,.28],[.82,.5],[.38,.65],[.7,.75]].forEach(([x,y]) => {
        ctx.beginPath(); ctx.moveTo(x*W,y*H); ctx.lineTo((x-.12)*W,(y+.18)*H); ctx.lineTo((x+.12)*W,(y+.18)*H); ctx.closePath(); ctx.fill()
      })
      // Trees
      ctx.fillStyle = 'rgba(80,110,60,.22)'
      ;[[.06,.58],[.44,.8],[.68,.62],[.88,.54],[.22,.76]].forEach(([x,y]) => {
        ctx.beginPath(); ctx.moveTo(x*W,y*H); ctx.lineTo((x-.04)*W,(y+.07)*H); ctx.lineTo((x+.04)*W,(y+.07)*H); ctx.closePath(); ctx.fill()
        ctx.fillRect(x*W-2,(y+.07)*H,4,H*.06)
      })
      // Compass
      ctx.save(); ctx.translate(.88*W,.72*H); ctx.strokeStyle='rgba(120,90,50,.3)'; ctx.lineWidth=1
      for (let a=0;a<360;a+=45){ctx.beginPath();ctx.moveTo(0,0);const r=a%90===0?22:14;ctx.lineTo(Math.cos(a*Math.PI/180)*r,Math.sin(a*Math.PI/180)*r);ctx.stroke()}
      ctx.beginPath();ctx.arc(0,0,25,0,Math.PI*2);ctx.strokeStyle='rgba(120,90,50,.18)';ctx.stroke();ctx.restore()

      // Resolve y positions: use measured card centres when available, else data fallback
      const ys = experiences.map((e, i) => nodeYs && nodeYs[i] != null ? nodeYs[i] : e.y)

      // Curved dotted trail (Catmull-Rom)
      const pts = experiences.map((e, i) => ({ x: e.x, y: ys[i] }))
      const segs = catmullSegments(pts)
      ctx.save()
      ctx.setLineDash([2, 11]); ctx.lineCap = 'round'
      ctx.strokeStyle = 'rgba(100,75,40,.55)'; ctx.lineWidth = 3
      ctx.beginPath(); ctx.moveTo(segs[0].s.x*W, segs[0].s.y*H)
      segs.forEach(sg => ctx.bezierCurveTo(sg.cp1.x*W, sg.cp1.y*H, sg.cp2.x*W, sg.cp2.y*H, sg.e.x*W, sg.e.y*H))
      ctx.stroke(); ctx.restore()

      // X marker at "?" node
      const qIdx = experiences.findIndex(e => e.id === '?')
      if (qIdx >= 0) {
        const fx=experiences[qIdx].x*W, fy=Math.max(16, ys[qIdx]*H-30), fs=9
        ctx.strokeStyle='rgba(160,60,40,.7)'; ctx.lineWidth=2.5
        ctx.beginPath();ctx.moveTo(fx-fs,fy-fs);ctx.lineTo(fx+fs,fy+fs);ctx.stroke()
        ctx.beginPath();ctx.moveTo(fx+fs,fy-fs);ctx.lineTo(fx-fs,fy+fs);ctx.stroke()
      }

      // Boat — follows curved path exactly
      const si = Math.min(Math.floor(boatRef.current * segs.length), segs.length - 1)
      const t  = boatRef.current * segs.length - si
      const bp = bezierAt(segs[si], t)
      const bx = bp.x * W, by = bp.y * H
      drawBoat(ctx, bx, by)

      // Nodes
      experiences.forEach((e, i) => {
        const px=e.x*W, py=ys[i]*H, isActive=i===act
        if (e.level) {
          ctx.fillStyle='rgba(22,14,4,.95)';ctx.beginPath()
          ;(ctx as unknown as {roundRect:(x:number,y:number,w:number,h:number,r:number)=>void}).roundRect(px-22,py-34,44,16,4);ctx.fill()
          ctx.fillStyle='#F5D99A';ctx.font='bold 9px Montserrat';ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText(`Lv. ${e.level}`,px,py-24)
        }
        ctx.fillStyle='rgba(15,8,2,.25)';ctx.beginPath();ctx.ellipse(px,py+5,18,6,0,0,Math.PI*2);ctx.fill()
        const cr=isActive?24:20
        // Golden glow ring for active node
        if (isActive) {
          ctx.save()
          ctx.shadowBlur = 22; ctx.shadowColor = 'rgba(255,184,0,0.85)'
          ctx.beginPath(); ctx.arc(px, py, cr+3, 0, Math.PI*2)
          ctx.strokeStyle = '#FFB800'; ctx.lineWidth = 3
          ctx.stroke()
          ctx.restore()
        }
        ctx.beginPath();ctx.arc(px,py,cr,0,Math.PI*2)
        ctx.fillStyle=e.current?'rgba(74,138,80,.15)':isActive?'rgba(92,74,58,.3)':'rgba(46,35,20,.88)'
        ctx.strokeStyle=e.current?'#4a8a50':isActive?'#FFB800':'#8B6F47';ctx.lineWidth=isActive?2.5:2
        ctx.fill();ctx.stroke()
        if (e.current){ctx.beginPath();ctx.arc(px,py,cr+5,0,Math.PI*2);ctx.strokeStyle='rgba(74,138,80,.22)';ctx.lineWidth=6;ctx.stroke()}
        ctx.fillStyle='rgba(255,255,255,0.95)'
        ctx.font=`bold ${isActive?14:12}px Bricolage Grotesque`;ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText(e.id.toUpperCase(),px,py+5)
        ctx.fillStyle='rgba(18,8,2,1)';ctx.font=`bold 12px Montserrat`;ctx.fillText(e.company,px,py+cr+16)
        ctx.fillStyle='rgba(60,38,14,1)';ctx.font=`500 11px Montserrat`;ctx.fillText(e.period,px,py+cr+30)
        if (e.current){ctx.fillStyle='#2e7d35';ctx.font='italic bold 10px Montserrat';ctx.fillText('You are here',px,py+cr+44)}
      })
    }

    const loop = () => {
      boatRef.current += (targetRef.current - boatRef.current) * 0.06
      draw()
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    window.addEventListener('resize', draw)
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', draw) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current; if (!wrap) return
    const r = wrap.getBoundingClientRect()
    const mx=(e.clientX-r.left)/r.width, my=(e.clientY-r.top)/r.height
    let closest=-1, minD=0.06
    experiences.forEach((exp,i) => { const d=Math.sqrt((mx-exp.x)**2+(my-exp.y)**2); if(d<minD){minD=d;closest=i} })
    if (closest>=0) onSelect(closest)
  }

  return (
    <div ref={wrapRef} className="relative" style={{ aspectRatio:'.67' }} onClick={handleClick}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}

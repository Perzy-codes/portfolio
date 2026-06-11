'use client'
import { useEffect, useRef } from 'react'

const BRUSH_R = 28

// offsetY: fraction of canvas height to shift the cover image (positive = down, negative = up)
export default function PhotoReveal({ revealSrc, offsetY = 0 }: { revealSrc: string; offsetY?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let W = 0, H = 0, dpr = 1
    let isDown = false
    let lastX = 0, lastY = 0
    let coverImg: HTMLImageElement | null = null
    let rafId: number
    let ro: ResizeObserver
    let restoring = false
    let restoreFrames = 0
    const RESTORE_FRAMES = 160

    // Demo scratch
    let demoT = -1
    let demoPX = 0, demoPY = 0
    let hintDismissed = false

    const off = document.createElement('canvas')
    const offCtx = off.getContext('2d')!

    const renderCover = (target: CanvasRenderingContext2D) => {
      if (!coverImg) return
      const iw = coverImg.naturalWidth, ih = coverImg.naturalHeight
      const imgAspect = iw / ih, canvAspect = W / H
      let sx, sw, sh
      if (imgAspect > canvAspect) { sh = ih; sw = sh * canvAspect; sx = (iw - sw) / 2 }
      else                        { sw = iw; sh = sw / canvAspect; sx = 0 }
      target.drawImage(coverImg, sx, 0, sw, sh, 0, offsetY * H, W, H)
    }

    const fullReset = () => {
      ctx.clearRect(0, 0, W, H)
      renderCover(ctx)
      restoring = false
      restoreFrames = 0
    }

    const resize = () => {
      dpr = Math.min(devicePixelRatio, 2)
      const r = canvas.getBoundingClientRect()
      W = r.width * dpr; H = r.height * dpr
      canvas.width = W; canvas.height = H
      off.width = W; off.height = H
      offCtx.clearRect(0, 0, W, H)
      renderCover(offCtx)
      fullReset()
    }

    const scratchSegment = (x: number, y: number, fx: number, fy: number) => {
      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = BRUSH_R * 2 * dpr
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(fx, fy)
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.restore()
    }

    const dismissHint = () => { hintDismissed = true }

    const loop = () => {
      // Animated demo scratch
      if (demoT >= 0 && demoT < 1) {
        demoT += 0.022
        const t  = Math.min(demoT, 1)
        const nx = W * 0.25 + W * 0.50 * t
        const ny = H * 0.30 + H * 0.10 * t
        scratchSegment(nx, ny, demoPX, demoPY)
        demoPX = nx; demoPY = ny
        if (demoT >= 1) {
          demoT = 2
          setTimeout(() => { restoring = true; restoreFrames = 0 }, 700)
        }
      }

      // Gradual cover restore
      if (restoring) {
        ctx.save()
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 0.055
        ctx.drawImage(off, 0, 0)
        ctx.restore()
        if (++restoreFrames >= RESTORE_FRAMES) fullReset()
      }

      rafId = requestAnimationFrame(loop)
    }

    const canvasPos = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      return [(e.clientX - r.left) * dpr, (e.clientY - r.top) * dpr] as const
    }

    const onDown = (e: MouseEvent) => {
      isDown = true; restoring = false; restoreFrames = 0
      dismissHint()
      ;[lastX, lastY] = canvasPos(e)
    }
    const onMove = (e: MouseEvent) => {
      if (!isDown) return
      const [x, y] = canvasPos(e)
      scratchSegment(x, y, lastX, lastY)
      lastX = x; lastY = y
    }
    const onUp    = () => { isDown = false }
    const onLeave = () => { isDown = false; restoring = true; restoreFrames = 0 }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const img = new Image()
    img.onload = () => {
      coverImg = img
      resize()
      ro = new ResizeObserver(resize)
      ro.observe(canvas)
      // Reduced motion: leave the static cover in place, drop the brush cursor,
      // and skip the auto-demo scratch + rAF loop.
      if (reduced) { canvas.style.cursor = 'default'; return }
      canvas.addEventListener('mousedown',  onDown)
      canvas.addEventListener('mousemove',  onMove)
      canvas.addEventListener('mouseup',    onUp)
      canvas.addEventListener('mouseleave', onLeave)
      document.addEventListener('mouseup',  onUp)
      rafId = requestAnimationFrame(loop)

      // Run a quick demo scratch when card first enters the viewport
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && demoT < 0) {
          setTimeout(() => {
            if (demoT < 0 && !hintDismissed) {
              demoPX = W * 0.25; demoPY = H * 0.30
              demoT = 0
              // Dismiss hint once demo finishes restoring
              setTimeout(dismissHint, 3200)
            }
          }, 900)
          io.disconnect()
        }
      }, { threshold: 0.5 })
      io.observe(canvas)
    }
    img.src = revealSrc

    return () => {
      cancelAnimationFrame(rafId)
      ro?.disconnect()
      canvas.removeEventListener('mousedown',  onDown)
      canvas.removeEventListener('mousemove',  onMove)
      canvas.removeEventListener('mouseup',    onUp)
      canvas.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseup',  onUp)
    }
  }, [revealSrc, offsetY])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ cursor: 'crosshair' }}
    />
  )
}

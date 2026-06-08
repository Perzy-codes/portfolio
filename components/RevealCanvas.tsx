'use client'
import { useEffect, useRef } from 'react'

const VS = `attribute vec2 a_position;varying vec2 v_uv;void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`
const MASK_FS = `precision highp float;varying vec2 v_uv;uniform sampler2D u_prev;uniform vec2 u_mouse;uniform float u_hover,u_aspect,u_time,u_fadeSpeed,u_brushSize;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}void main(){vec2 uv=v_uv;float prev=texture2D(u_prev,uv).r;float fade=prev>.85?.001:u_fadeSpeed*3.;prev=prev*(1.-fade)-.004;prev=max(prev,0.);vec2 diff=uv-u_mouse;diff.x*=u_aspect;float dist=length(diff),angle=atan(diff.y,diff.x);float n1=noise(vec2(angle*3.+u_time*.5,u_time*.3))*.4,n2=noise(vec2(angle*7.-u_time*.8,dist*10.))*.2;float br=u_brushSize+(n1+n2)*u_brushSize*.6,brush=smoothstep(br,br*.3,dist)*u_hover;brush=min(brush*1.3,1.);gl_FragColor=vec4(vec3(max(prev,brush)),1.);}`
const COMP_FS = `precision highp float;varying vec2 v_uv;uniform sampler2D u_base,u_reveal,u_mask;uniform float u_aspect,u_time,u_hover,u_brushSize;void main(){vec2 uv=v_uv;float m=texture2D(u_mask,uv).r+(u_aspect+u_time+u_hover+u_brushSize)*0.;gl_FragColor=vec4(mix(texture2D(u_base,uv).rgb,texture2D(u_reveal,uv).rgb,m),1.);}`

function mkShader(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src); gl.compileShader(sh)
  return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null
}
function mkProg(gl: WebGLRenderingContext, v: WebGLShader, f: WebGLShader) {
  const p = gl.createProgram()!
  gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p)
  return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null
}
function mkFBO(gl: WebGLRenderingContext, w: number, h: number) {
  const t = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, t)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  ;[gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(p => gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE))
  ;[gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER].forEach(p => gl.texParameteri(gl.TEXTURE_2D, p, gl.LINEAR))
  const fb = gl.createFramebuffer()!
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0)
  gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  return { t, fb }
}
function loadTex(gl: WebGLRenderingContext, img: HTMLImageElement | HTMLCanvasElement) {
  const t = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, t)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
  ;[gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(p => gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE))
  ;[gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER].forEach(p => gl.texParameteri(gl.TEXTURE_2D, p, gl.LINEAR))
  return t
}

function buildPirateCanvas(src: string): Promise<HTMLCanvasElement> {
  return new Promise(res => {
    const img = new Image(); img.onload = () => {
      const oc = document.createElement('canvas'); oc.width = 600; oc.height = 800
      const ctx = oc.getContext('2d')!
      const bg = ctx.createLinearGradient(0,0,0,800)
      bg.addColorStop(0,'#030810'); bg.addColorStop(.5,'#060e18'); bg.addColorStop(1,'#08100a')
      ctx.fillStyle = bg; ctx.fillRect(0,0,600,800)
      for (let i=0; i<100; i++) { ctx.fillStyle=`rgba(255,252,240,${.3+Math.random()*.7})`; ctx.beginPath(); ctx.arc(Math.random()*600,Math.random()*280,Math.random()*1.3+.2,0,Math.PI*2); ctx.fill() }
      ctx.fillStyle='rgba(8,16,34,.85)'; [[70,38,110,42],[510,28,125,38],[300,18,155,32]].forEach(([x,y,rx,ry])=>{ ctx.beginPath(); ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2); ctx.fill() })
      ctx.fillStyle='#f0edd8'; ctx.shadowColor='rgba(240,237,216,.55)'; ctx.shadowBlur=32; ctx.beginPath(); ctx.arc(540,78,34,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0
      ctx.drawImage(img,0,0,600,800)
      ctx.globalCompositeOperation='saturation'; ctx.fillStyle='rgba(0,0,0,.92)'; ctx.fillRect(0,0,600,800)
      ctx.globalCompositeOperation='multiply'; ctx.fillStyle='rgba(15,35,75,.65)'; ctx.fillRect(0,0,600,800)
      ctx.globalCompositeOperation='source-over'
      // Hat
      ctx.fillStyle='rgba(0,0,0,.5)'; ctx.beginPath(); ctx.ellipse(300,138,168,22,0,0,Math.PI*2); ctx.fill()
      ctx.fillStyle='#140c02'; ctx.beginPath(); ctx.moveTo(162,140); ctx.quadraticCurveTo(178,56,300,44); ctx.quadraticCurveTo(422,56,438,140); ctx.closePath(); ctx.fill()
      ctx.fillStyle='#0e0800'; [[116,142,96,155,90,136,110,115,168,130],[484,142,504,155,510,136,490,115,432,130]].forEach(([...pts])=>{ ctx.beginPath(); ctx.moveTo(pts[0],pts[1]); ctx.quadraticCurveTo(pts[2],pts[3],pts[4],pts[5]); ctx.quadraticCurveTo(pts[6],pts[7],pts[8],pts[9]); ctx.closePath(); ctx.fill() })
      ctx.beginPath(); ctx.moveTo(168,130); ctx.bezierCurveTo(200,148,400,148,432,130); ctx.lineTo(438,140); ctx.bezierCurveTo(300,160,162,140,162,140); ctx.fill()
      ctx.fillStyle='#7a4e14'; ctx.beginPath(); ctx.moveTo(175,130); ctx.bezierCurveTo(238,144,362,144,425,130); ctx.bezierCurveTo(418,120,238,128,175,120); ctx.closePath(); ctx.fill()
      ctx.fillStyle='rgba(228,222,205,.93)'; ctx.beginPath(); ctx.arc(300,73,15,0,Math.PI*2); ctx.fill(); ctx.fillRect(293,85,14,10)
      ctx.fillStyle='#140c02'; [[294,71,4],[306,71,4]].forEach(([x,y,r])=>{ ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill() })
      ctx.strokeStyle='rgba(228,222,205,.93)'; ctx.lineWidth=4.5; ctx.lineCap='round'
      ctx.beginPath(); ctx.moveTo(283,99); ctx.lineTo(317,113); ctx.stroke(); ctx.beginPath(); ctx.moveTo(317,99); ctx.lineTo(283,113); ctx.stroke()
      ctx.strokeStyle='#c4a028'; ctx.lineWidth=2.2; ctx.beginPath(); ctx.moveTo(452,128); ctx.quadraticCurveTo(470,92,466,62); ctx.stroke()
      // Eye patch
      ctx.fillStyle='#090502'; ctx.beginPath(); ctx.ellipse(232,268,30,21,.1,0,Math.PI*2); ctx.fill()
      ctx.strokeStyle='#281605'; ctx.lineWidth=2.5; ctx.beginPath(); ctx.ellipse(232,268,30,21,.1,0,Math.PI*2); ctx.stroke()
      ctx.strokeStyle='#180e04'; ctx.lineWidth=4
      [[203,256,192,246,197,234],[261,256,275,246,270,234]].forEach(([x1,y1,cx,cy,x2,y2])=>{ ctx.beginPath(); ctx.moveTo(x1,y1); ctx.quadraticCurveTo(cx,cy,x2,y2); ctx.stroke() })
      // Coat
      ctx.fillStyle='rgba(24,14,6,.92)'; ctx.beginPath(); ctx.moveTo(208,372); ctx.quadraticCurveTo(226,308,253,293); ctx.quadraticCurveTo(270,338,300,353); ctx.quadraticCurveTo(330,338,347,293); ctx.quadraticCurveTo(374,308,392,372); ctx.bezierCurveTo(358,367,300,370,208,372); ctx.closePath(); ctx.fill()
      ctx.fillStyle='rgba(205,200,186,.62)'; ctx.beginPath(); ctx.moveTo(266,293); ctx.quadraticCurveTo(275,326,286,343); ctx.quadraticCurveTo(300,348,314,343); ctx.quadraticCurveTo(325,326,334,293); ctx.quadraticCurveTo(316,310,300,316); ctx.quadraticCurveTo(284,310,266,293); ctx.closePath(); ctx.fill()
      ctx.fillStyle='#b08818'; [0,18,36].forEach(dy => { ctx.beginPath(); ctx.arc(300,374+dy,5.5,0,Math.PI*2); ctx.fill() })
      ctx.fillStyle='#7a4e14'; [[172,333,192,318,212,328,202,343,178,338],[428,333,408,318,388,328,398,343,422,338]].forEach(([...pts])=>{ ctx.beginPath(); ctx.moveTo(pts[0],pts[1]); ctx.quadraticCurveTo(pts[2],pts[3],pts[4],pts[5]); ctx.quadraticCurveTo(pts[6],pts[7],pts[8],pts[9]); ctx.closePath(); ctx.fill() })
      // Ropes
      ctx.strokeStyle='rgba(85,55,18,.52)'; ctx.lineWidth=3.5; ctx.beginPath(); ctx.moveTo(0,492); ctx.bezierCurveTo(140,462,300,476,600,450); ctx.stroke()
      ctx.strokeStyle='rgba(65,42,14,.38)'; ctx.lineWidth=2.5; ctx.beginPath(); ctx.moveTo(0,582); ctx.bezierCurveTo(200,558,400,572,600,544); ctx.stroke()
      const wg = ctx.createLinearGradient(0,655,0,800); wg.addColorStop(0,'rgba(6,18,38,.68)'); wg.addColorStop(1,'rgba(3,8,18,.95)')
      ctx.fillStyle=wg; ctx.fillRect(0,655,600,145)
      res(oc)
    }; img.src = src
  })
}

export default function RevealCanvas({ imgSrc }: { imgSrc: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false })
    if (!gl) return
    const v1 = mkShader(gl, gl.VERTEX_SHADER, VS)!
    const v2 = mkShader(gl, gl.VERTEX_SHADER, VS)!
    const mf = mkShader(gl, gl.FRAGMENT_SHADER, MASK_FS)!
    const cf = mkShader(gl, gl.FRAGMENT_SHADER, COMP_FS)!
    const mp = mkProg(gl, v1, mf)!; const cp = mkProg(gl, v2, cf)!
    const qb = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, qb)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW)
    const mL = { a: gl.getAttribLocation(mp,'a_position'), prev: gl.getUniformLocation(mp,'u_prev'), mouse: gl.getUniformLocation(mp,'u_mouse'), hover: gl.getUniformLocation(mp,'u_hover'), asp: gl.getUniformLocation(mp,'u_aspect'), time: gl.getUniformLocation(mp,'u_time'), fs: gl.getUniformLocation(mp,'u_fadeSpeed'), bs: gl.getUniformLocation(mp,'u_brushSize') }
    const cL = { a: gl.getAttribLocation(cp,'a_position'), base: gl.getUniformLocation(cp,'u_base'), rev: gl.getUniformLocation(cp,'u_reveal'), mask: gl.getUniformLocation(cp,'u_mask'), asp: gl.getUniformLocation(cp,'u_aspect'), time: gl.getUniformLocation(cp,'u_time'), hover: gl.getUniformLocation(cp,'u_hover'), bs: gl.getUniformLocation(cp,'u_brushSize') }
    let W=512, H=512, fa=mkFBO(gl,W,H), fb2=mkFBO(gl,W,H), cur=0
    let bT: WebGLTexture|null=null, rT: WebGLTexture|null=null
    const s = { mx:.5,my:.5,tx:.5,ty:.5,h:0,th:0,st:performance.now(),li:performance.now() }
    const resize = () => {
      const dpr=Math.min(devicePixelRatio,2), r=canvas.getBoundingClientRect()
      canvas.width=r.width*dpr; canvas.height=r.height*dpr
      const nw=Math.round(r.width*dpr*.5), nh=Math.round(r.height*dpr*.5)
      if(nw!==W||nh!==H){ W=nw; H=nh; [fa,fb2].forEach(f=>{ gl.deleteTexture(f.t); gl.deleteFramebuffer(f.fb) }); fa=mkFBO(gl,W,H); fb2=mkFBO(gl,W,H) }
    }
    resize(); new ResizeObserver(resize).observe(canvas)
    canvas.addEventListener('mousemove', e => { const r=canvas.getBoundingClientRect(); s.tx=(e.clientX-r.left)/r.width; s.ty=1-(e.clientY-r.top)/r.height; s.li=performance.now() })
    canvas.addEventListener('mouseenter', () => { s.th=1; s.li=performance.now() })
    canvas.addEventListener('mouseleave', () => { s.th=0; s.li=performance.now() })
    const oi = new Image(); oi.onload = async () => {
      bT = loadTex(gl, oi)
      const rc = await buildPirateCanvas(imgSrc)
      rT = loadTex(gl, rc)
    }; oi.src = imgSrc
    let alive = true
    const draw = () => {
      if (!alive) return
      const now=performance.now(), t=(now-s.st)/1e3
      s.mx+=(s.tx-s.mx)*.07; s.my+=(s.ty-s.my)*.07; s.h+=(s.th-s.h)*.05
      let mx=s.mx, my=s.my, hv=s.h
      if (s.h<.05) { const idle=(now-s.li)/1e3; if(idle>2){ const dt=idle-2, cyc=dt-7*Math.floor(dt/7); if(cyc>=0&&cyc<=2.4){ const p=cyc/2.4, w=.045*Math.sin(p*Math.PI*2.8+Math.sin(.6*t))+.02*Math.sin(p*Math.PI*4.5-.9*t); mx=Math.min(.96,Math.max(.04,.15+.7*p+w)); my=Math.min(.96,Math.max(.04,.85-.7*p-w)); hv=1 } } }
      if (bT && rT) {
        const asp=canvas.width/canvas.height, n=1-cur, fbN=n===0?fa:fb2, fbC=cur===0?fa:fb2
        gl.bindFramebuffer(gl.FRAMEBUFFER,fbN.fb); gl.viewport(0,0,W,H); gl.useProgram(mp)
        gl.bindBuffer(gl.ARRAY_BUFFER,qb); gl.enableVertexAttribArray(mL.a); gl.vertexAttribPointer(mL.a,2,gl.FLOAT,false,0,0)
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D,fbC.t); gl.uniform1i(mL.prev,0)
        gl.uniform2f(mL.mouse,mx,my); gl.uniform1f(mL.hover,hv); gl.uniform1f(mL.asp,asp); gl.uniform1f(mL.time,t); gl.uniform1f(mL.fs,.007); gl.uniform1f(mL.bs,.13)
        gl.drawArrays(gl.TRIANGLE_STRIP,0,4)
        gl.bindFramebuffer(gl.FRAMEBUFFER,null); gl.viewport(0,0,canvas.width,canvas.height); gl.useProgram(cp)
        gl.bindBuffer(gl.ARRAY_BUFFER,qb); gl.enableVertexAttribArray(cL.a); gl.vertexAttribPointer(cL.a,2,gl.FLOAT,false,0,0)
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D,bT); gl.uniform1i(cL.base,0)
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D,rT); gl.uniform1i(cL.rev,1)
        gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D,fbN.t); gl.uniform1i(cL.mask,2)
        gl.uniform1f(cL.asp,asp); gl.uniform1f(cL.time,t); gl.uniform1f(cL.hover,s.h); gl.uniform1f(cL.bs,.13)
        gl.drawArrays(gl.TRIANGLE_STRIP,0,4)
        cur = n
      }
      requestAnimationFrame(draw)
    }
    draw()
    return () => { alive = false }
  }, [imgSrc])

  return (
    <canvas ref={canvasRef} style={{ width:'100%', height:'100%', display:'block', cursor:'none', touchAction:'none' }} aria-label="Pratham Dabas" role="img" />
  )
}

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text) return NextResponse.json({ error: 'No text' }, { status: 400 })

    const res = await fetch('https://api.v8.unrealspeech.com/stream', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.UNREAL_SPEECH_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Text: text,
        VoiceId: 'Noah',
        Bitrate: '192k',
        Speed: '0',
        Pitch: '1',
        Codec: 'libmp3lame',
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Unreal Speech error:', err)
      return NextResponse.json({ error: 'TTS failed' }, { status: 500 })
    }

    const audio = await res.arrayBuffer()
    return new NextResponse(audio, {
      headers: { 'Content-Type': 'audio/mpeg' },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

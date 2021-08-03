import { Song } from 'mewseek'
import React, { useRef, useEffect, useState } from 'react'

type MusicVisualizerProps = {
  song: Song
}

const MusicVisualizer = ({ song }: MusicVisualizerProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)

  let rafId: number
  let audioCtx: AudioContext
  let source: MediaElementAudioSourceNode
  let analyser: AnalyserNode
  let frequency_array: Uint8Array

  const tick = () => {
    animationLooper(canvasRef.current)
    analyser.getByteFrequencyData(frequency_array)
    rafId = requestAnimationFrame(tick)
  }

  const animationLooper = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return
    const bars = 555
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 5

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'skyblue'

    for (let i = 0; i < bars; i++) {
      const bar_height = frequency_array[i] / 2
      const center_y = canvas.height / 2
      drawRect(ctx, (i * size) + 1, center_y - (bar_height / 2), size - 2, bar_height)

    }
  }

  const drawRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.fillRect(x, y, w, h)
    ctx.beginPath()
    ctx.arc(x + (w / 2), y, w / 2, 0, 2 * Math.PI, false)
    ctx.arc(x + (w / 2), y + h, w / 2, 0, 2 * Math.PI, false)
    ctx.closePath()
    ctx.fill()
  }

  useEffect(() => {
    if (audioRef) {
      audioRef.src = song.preview_url
      // audioRef.muted = true
      audioRef.setAttribute('crossOrigin', 'anonymous')
      // audioRef.load()

      audioCtx = new AudioContext()
      source = audioCtx.createMediaElementSource(audioRef)
      analyser = audioCtx.createAnalyser()
      source.connect(analyser)
      analyser.connect(audioCtx.destination)
      frequency_array = new Uint8Array(analyser.fftSize)

      // analyser.fftSize = 2048
      analyser.getByteFrequencyData(frequency_array)

      rafId = requestAnimationFrame(tick)
      audioRef.play()
    }


    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      if (analyser) analyser.disconnect()
      if (source) source.disconnect()
    }
  }, [audioRef])


  return <>
    <audio ref={c => setAudioRef(c)} />
    <canvas ref={canvasRef} />
  </>
}

export default MusicVisualizer
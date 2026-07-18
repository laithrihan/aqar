import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import {
  MdFullscreen,
  MdPause,
  MdPlayArrow,
  MdVolumeOff,
  MdVolumeUp,
} from 'react-icons/md'
import { useTranslation } from 'react-i18next'

import { formatMediaTime } from '@/shared/lib/formatMediaTime'

type PropertyTourPlayerProps = {
  videoUrl: string
  posterUrl: string
  title: string
}

/** Custom-styled HTML5 video player for the house tour. */
export function PropertyTourPlayer({
  videoUrl,
  posterUrl,
  title,
}: PropertyTourPlayerProps) {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressId = useId()

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hasPosterError, setHasPosterError] = useState(false)
  const [prevPosterUrl, setPrevPosterUrl] = useState(posterUrl)

  if (posterUrl !== prevPosterUrl) {
    setPrevPosterUrl(posterUrl)
    setHasPosterError(false)
  }

  const resolvedPoster =
    !posterUrl || hasPosterError ? undefined : posterUrl

  useEffect(() => {
    if (!posterUrl) return

    let cancelled = false
    const probe = new window.Image()
    probe.onerror = () => {
      if (!cancelled) setHasPosterError(true)
    }
    probe.src = posterUrl

    return () => {
      cancelled = true
      probe.onerror = null
    }
  }, [posterUrl])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => setCurrentTime(video.currentTime)
    const onLoaded = () => setDuration(video.duration || 0)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => setIsPlaying(false)

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('loadedmetadata', onLoaded)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('ended', onEnded)

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('loadedmetadata', onLoaded)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('ended', onEnded)
    }
  }, [])

  async function togglePlay() {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      try {
        await video.play()
      } catch {
        // Autoplay policies / interrupted play requests can reject.
      }
      return
    }

    video.pause()
  }

  function toggleMute() {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  function seekTo(value: number) {
    const video = videoRef.current
    if (!video) return
    video.currentTime = value
    setCurrentTime(value)
  }

  async function toggleFullscreen() {
    const video = videoRef.current
    if (!video) return

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        return
      }

      await video.requestFullscreen()
    } catch {
      // Fullscreen may be unsupported or blocked by the browser.
    }
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="property-tour-player">
      <video
        ref={videoRef}
        className="property-tour-video"
        src={videoUrl}
        poster={resolvedPoster}
        playsInline
        preload="metadata"
        onClick={() => void togglePlay()}
      >
        {t('property.tour.unsupported')}
      </video>

      {!isPlaying ? (
        <button
          type="button"
          className="property-tour-play-center"
          onClick={() => void togglePlay()}
          aria-label={t('property.tour.play')}
        >
          <MdPlayArrow aria-hidden />
        </button>
      ) : null}

      <div className="property-tour-controls">
        <button
          type="button"
          className="property-tour-control-btn"
          onClick={() => void togglePlay()}
          aria-label={isPlaying ? t('property.tour.pause') : t('property.tour.play')}
        >
          {isPlaying ? <MdPause aria-hidden /> : <MdPlayArrow aria-hidden />}
        </button>

        <span className="property-tour-time" aria-live="off">
          {formatMediaTime(currentTime)} / {formatMediaTime(duration)}
        </span>

        <label className="property-tour-progress-label" htmlFor={progressId}>
          <span className="sr-only">{title}</span>
          <input
            id={progressId}
            type="range"
            className="property-tour-progress"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={(event) => seekTo(Number(event.target.value))}
            style={{ '--progress': `${progress}%` } as CSSProperties}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(currentTime)}
            aria-label={t('property.tour.seek')}
          />
        </label>

        <button
          type="button"
          className="property-tour-control-btn"
          onClick={toggleMute}
          aria-label={isMuted ? t('property.tour.unmute') : t('property.tour.mute')}
        >
          {isMuted ? <MdVolumeOff aria-hidden /> : <MdVolumeUp aria-hidden />}
        </button>

        <button
          type="button"
          className="property-tour-control-btn"
          onClick={() => void toggleFullscreen()}
          aria-label={t('property.tour.fullscreen')}
        >
          <MdFullscreen aria-hidden />
        </button>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Play, Volume2, VolumeX } from "lucide-react"

const FILE_S3_URL = process.env.NEXT_PUBLIC_FILE_S3_URL || ""

const CompanyVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  const videoUrl = `${FILE_S3_URL}/pages/company_introduce.mp4`

  const handlePlayClick = () => {
    const video = document.getElementById(
      "company-video"
    ) as HTMLVideoElement | null
    if (video) {
      if (isPlaying) {
        video.pause()
      } else {
        video.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMuteToggle = () => {
    const video = document.getElementById(
      "company-video"
    ) as HTMLVideoElement | null
    if (video) {
      video.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F2FAEC] via-white to-[#EAF6DF] py-16 md:py-24">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#7DBB4C] opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-[#6BB8FF] opacity-10 blur-3xl" />

      <div className="content-container relative z-10">
        {/* Section Title */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-[#7EA965]">
            About Us
          </p>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-[#23323A] md:text-4xl">
            Discover ShinColor
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-600 md:text-lg">
            Experience our journey in delivering premium printing solutions
            worldwide
          </p>
        </div>

        {/* Video Container */}
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl border border-[#DDEFD0] bg-black shadow-2xl">
            {/* Video Element */}
            <video
              id="company-video"
              className="aspect-video w-full"
              muted={isMuted}
              loop
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              poster={`${FILE_S3_URL}/pages/company_video_poster.jpg`}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity hover:opacity-100">
              {/* Play/Pause Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handlePlayClick}
                  className="group flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7DBB4C] focus-visible:ring-offset-2 md:h-24 md:w-24"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {!isPlaying && (
                    <Play className="ml-1 h-8 w-8 fill-[#7DBB4C] text-[#7DBB4C] transition-transform group-hover:scale-110 md:h-10 md:w-10" />
                  )}
                  {isPlaying && (
                    <div className="flex gap-1.5">
                      <div className="h-8 w-2 rounded-full bg-[#7DBB4C] md:h-10 md:w-2.5" />
                      <div className="h-8 w-2 rounded-full bg-[#7DBB4C] md:h-10 md:w-2.5" />
                    </div>
                  )}
                </button>
              </div>

              {/* Mute Toggle Button */}
              <div className="absolute bottom-6 right-6">
                <button
                  onClick={handleMuteToggle}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7DBB4C] focus-visible:ring-offset-2 md:h-12 md:w-12"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5 text-[#7DBB4C] md:h-6 md:w-6" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-[#7DBB4C] md:h-6 md:w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Optional: Caption or CTA below video */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 md:text-base">
              Learn more about our commitment to quality and innovation in
              printing technology
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CompanyVideo

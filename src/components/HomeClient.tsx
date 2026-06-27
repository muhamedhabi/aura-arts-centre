"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Phone, Mail, Globe, Volume2, VolumeX } from "lucide-react"
import Image from "next/image"
import './home.css'

interface HomeClientProps {
  content: Record<string, string>
  images: any[]
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
)

const PlayableVideo = ({ src, className }: { src: string; className?: string }) => {
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted])

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsMuted(prev => !prev)
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video 
        ref={videoRef}
        autoPlay 
        loop 
        muted
        playsInline
        poster="/auralogo.png"
        className={className}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        src={src}
      />
      <button 
        onClick={toggleMute}
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20,
          backdropFilter: 'blur(4px)',
          transition: 'all 0.2s ease',
          pointerEvents: 'auto'
        }}
        aria-label="Toggle Audio"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </div>
  )
}

export default function HomeClient({ content, images }: HomeClientProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as any } }
  }

  const heroMediaUrl = content.heroMediaUrl || '/gallery/IMG_8638.webp'
  const isHeroVideo = content.heroMediaType === 'video' || heroMediaUrl.endsWith('.mp4') || heroMediaUrl.endsWith('.webm')
  
  const aboutMediaUrl = content.aboutMediaUrl || (images.length > 0 ? images[0].path : '')
  const isAboutVideo = content.aboutMediaType === 'video' || aboutMediaUrl.endsWith('.mp4') || aboutMediaUrl.endsWith('.webm')

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            style={{ background: '#000' }}
          >
            <video 
              src="/loading_video.webm" 
              autoPlay 
              loop 
              muted 
              playsInline 
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="main-wrapper">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            {isHeroVideo ? (
              <PlayableVideo src={heroMediaUrl} className="hero-video" />
            ) : (
              <Image 
                src={heroMediaUrl}
                alt="Aura Arts Centre Hero"
                fill
                priority
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
          <div className="hero-overlay"></div>
          <motion.div 
            className="container hero-content"
            variants={containerVariants}
            initial="hidden"
            animate={!loading ? "visible" : "hidden"}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
              <Image 
                src="/auralogo.png" 
                alt="Aura Arts Logo" 
                width={200} 
                height={200}
                style={{ objectFit: 'contain' }}
              />
            </motion.div>
            <motion.span variants={itemVariants} className="subtitle">Welcome to</motion.span>
            <motion.h1 variants={itemVariants} className="hero-title">
              {content.title?.split('\n')[0] || "Aura Arts Centre"}
            </motion.h1>
            <motion.p variants={itemVariants} className="hero-desc">
              {content.title?.split('\n').slice(1).join(' ') || "Bringing Artistic Excellence"}
            </motion.p>
            <motion.a variants={itemVariants} href="#about" className="cta-btn">
              Discover Our Arts
            </motion.a>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="about-section">
          <div className="container">
            <motion.div 
              className="about-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="about-text">
                <span className="subtitle">About Us</span>
                <h2>Nurturing Cultural Values & Talents</h2>
                <div className="about-content">
                  {content.about?.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="about-image">
                <div className="image-frame">
                  {aboutMediaUrl ? (
                    <div style={{ position: "relative", width: "100%", height: "100%" }}>
                      {isAboutVideo ? (
                        <PlayableVideo src={aboutMediaUrl} />
                      ) : (
                        <Image 
                          src={aboutMediaUrl} 
                          alt="Aura Arts Performance" 
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          style={{ objectFit: "cover" }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="placeholder-img"></div>
                  )}
                  <div className="frame-border"></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="gallery-section">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-5"
            >
              <span className="subtitle">Portfolio</span>
              <h2>Our Gallery</h2>
            </motion.div>

            <div className="gallery-grid-2col">
              {images.map((img, i) => {
                if (img.path === aboutMediaUrl) return null
                const isGalleryVideo = img.path.endsWith('.mp4') || img.path.endsWith('.webm')
                return (
                  <motion.div 
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (i % 2) * 0.2 }}
                    className="gallery-item-large"
                  >
                    {isGalleryVideo ? (
                      <PlayableVideo src={img.path} />
                    ) : (
                      <Image 
                        src={img.path} 
                        alt={`Gallery Image ${i + 1}`} 
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                    <div className="item-overlay" style={{ pointerEvents: 'none' }}></div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Footer / Contact Section */}
        <footer id="contact" className="footer-section">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-brand">
                <h3>Aura Arts</h3>
                <p>Bringing Artistic Excellence to the Kingdom of Bahrain.</p>
              </div>
              
              <div className="footer-contact">
                <h4>Contact Us</h4>
                <ul className="contact-list">
                  <li>
                    <MapPin size={18} className="text-gold" />
                    <span>
                      {content.address?.split('\n').map((line, i) => (
                        <span key={i}>{line}<br/></span>
                      ))}
                    </span>
                  </li>
                  <li>
                    <Phone size={18} className="text-gold" />
                    <span>{content.phone}</span>
                  </li>
                  <li>
                    <Mail size={18} className="text-gold" />
                    <span>{content.email}</span>
                  </li>
                  <li>
                    <Globe size={18} className="text-gold" />
                    <span>{content.website}</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} Aura Arts Centre. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Floating WhatsApp Button */}
        <a 
          href="https://wa.me/97334518668" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="whatsapp-float"
          aria-label="Chat on WhatsApp"
        >
          <WhatsAppIcon />
        </a>
      </main>
    </>
  )
}

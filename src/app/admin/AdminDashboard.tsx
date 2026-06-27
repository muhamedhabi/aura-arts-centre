"use client"

import { useState, useEffect, useRef } from "react"
import { signOut } from "next-auth/react"
import { LogOut, Save, Image as ImageIcon, Trash2, Upload, Eye, EyeOff, FileText, LayoutTemplate, Info } from "lucide-react"
import './admin.css'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"content" | "hero" | "about" | "gallery">("content")
  const [content, setContent] = useState<Record<string, string>>({})
  const [images, setImages] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const heroFileRef = useRef<HTMLInputElement>(null)
  const aboutFileRef = useRef<HTMLInputElement>(null)
  const galleryFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchContent()
    fetchImages()
  }, [])

  const fetchContent = async () => {
    const res = await fetch('/api/content')
    const data = await res.json()
    setContent(data)
  }

  const fetchImages = async () => {
    const res = await fetch('/api/images')
    const data = await res.json()
    setImages(data)
  }

  const handleContentChange = (key: string, value: string) => {
    setContent(prev => ({ ...prev, [key]: value }))
  }

  const saveContent = async () => {
    setIsSaving(true)
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      })
      alert("Content saved successfully!")
    } catch (e) {
      alert("Failed to save content.")
    }
    setIsSaving(false)
  }

  const handleDedicatedUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'about') => {
    if (!e.target.files?.[0]) return
    setUploading(true)
    const formData = new FormData()
    formData.append("file", e.target.files[0])
    formData.append("type", type)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        alert(`${type.toUpperCase()} media uploaded successfully!`)
        fetchContent() // refresh to get new url
      } else {
        alert(data.error || 'Failed to upload')
      }
    } catch (e) {
      alert("Failed to upload media.")
    }
    setUploading(false)
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    setUploading(true)
    const formData = new FormData()
    formData.append("file", e.target.files[0])

    try {
      await fetch('/api/images', {
        method: 'POST',
        body: formData
      })
      fetchImages()
    } catch (e) {
      alert("Failed to upload image.")
    }
    setUploading(false)
  }

  const deleteImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return
    await fetch(`/api/images/${id}`, { method: 'DELETE' })
    fetchImages()
  }

  const toggleVisibility = async (id: string, current: boolean) => {
    await fetch(`/api/images/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVisible: !current })
    })
    fetchImages()
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Aura Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-btn ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <FileText size={18} /> General Info
          </button>
          <button 
            className={`nav-btn ${activeTab === 'hero' ? 'active' : ''}`}
            onClick={() => setActiveTab('hero')}
          >
            <LayoutTemplate size={18} /> Hero Section
          </button>
          <button 
            className={`nav-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <Info size={18} /> About Section
          </button>
          <button 
            className={`nav-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <ImageIcon size={18} /> Gallery
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => signOut()}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {activeTab === 'content' && (
          <div className="admin-section">
            <div className="section-header">
              <h1>General Website Content</h1>
              <button className="save-btn" onClick={saveContent} disabled={isSaving}>
                <Save size={18} /> {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Main Title</label>
                <textarea 
                  value={content.title || ''} 
                  onChange={(e) => handleContentChange('title', e.target.value)} 
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>About Text</label>
                <textarea 
                  value={content.about || ''} 
                  onChange={(e) => handleContentChange('about', e.target.value)} 
                  rows={8}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea 
                  value={content.address || ''} 
                  onChange={(e) => handleContentChange('address', e.target.value)} 
                  rows={4}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="text" 
                    value={content.email || ''} 
                    onChange={(e) => handleContentChange('email', e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label>Phone Numbers</label>
                  <input 
                    type="text" 
                    value={content.phone || ''} 
                    onChange={(e) => handleContentChange('phone', e.target.value)} 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Website</label>
                <input 
                  type="text" 
                  value={content.website || ''} 
                  onChange={(e) => handleContentChange('website', e.target.value)} 
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="admin-section">
            <div className="section-header">
              <h1>Hero Section Media</h1>
            </div>
            <div className="form-grid">
              <div className="upload-box">
                <p style={{ marginBottom: '1rem', color: '#64748b' }}>
                  Upload an Image or Video for the top background of the site. Videos are supported.
                </p>
                <button 
                  className="upload-btn" 
                  onClick={() => heroFileRef.current?.click()}
                  disabled={uploading}
                  style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.1rem' }}
                >
                  <Upload size={20} /> {uploading ? "Uploading..." : "Select Image or Video"}
                </button>
                <input 
                  type="file" 
                  hidden 
                  accept="image/*,video/mp4,video/webm" 
                  ref={heroFileRef}
                  onChange={(e) => handleDedicatedUpload(e, 'hero')} 
                />
              </div>
              {content.heroMediaUrl && (
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Current Hero Media</h3>
                  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#000', aspectRatio: '16/9' }}>
                    {content.heroMediaType === 'video' ? (
                      <video src={content.heroMediaUrl} autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <img src={content.heroMediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Hero" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="admin-section">
            <div className="section-header">
              <h1>About Section Media</h1>
            </div>
            <div className="form-grid">
              <div className="upload-box">
                <p style={{ marginBottom: '1rem', color: '#64748b' }}>
                  Upload an image or video to display next to the About Text.
                </p>
                <button 
                  className="upload-btn" 
                  onClick={() => aboutFileRef.current?.click()}
                  disabled={uploading}
                  style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.1rem' }}
                >
                  <Upload size={20} /> {uploading ? "Uploading..." : "Select About Media"}
                </button>
                <input 
                  type="file" 
                  hidden 
                  accept="image/*,video/mp4,video/webm" 
                  ref={aboutFileRef}
                  onChange={(e) => handleDedicatedUpload(e, 'about')} 
                />
              </div>
              {content.aboutMediaUrl && (
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Current About Media</h3>
                  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', aspectRatio: '4/5', maxWidth: '400px', background: '#000' }}>
                    {content.aboutMediaType === 'video' || content.aboutMediaUrl.endsWith('.mp4') || content.aboutMediaUrl.endsWith('.webm') ? (
                      <video src={content.aboutMediaUrl} autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <img src={content.aboutMediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="About" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="admin-section">
            <div className="section-header">
              <h1>Photo & Video Gallery</h1>
              <label className="upload-btn" style={{ cursor: 'pointer' }}>
                <Upload size={18} /> {uploading ? "Uploading..." : "Upload Media"}
                <input type="file" hidden accept="image/*,video/mp4,video/webm" onChange={handleGalleryUpload} disabled={uploading} ref={galleryFileRef} />
              </label>
            </div>
            
            <div className="gallery-grid">
              {images.map(img => (
                <div key={img.id} className={`gallery-item ${!img.isVisible ? 'hidden-item' : ''}`}>
                  {img.path.endsWith('.mp4') || img.path.endsWith('.webm') ? (
                    <video src={img.path} autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <img src={img.path} alt="Gallery" />
                  )}
                  <div className="item-actions">
                    <button onClick={() => toggleVisibility(img.id, img.isVisible)} title="Toggle Visibility">
                      {img.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button onClick={() => deleteImage(img.id)} className="delete-btn" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

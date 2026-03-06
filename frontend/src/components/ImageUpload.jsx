import { useState, useRef } from 'react';
import axios from 'axios';
import { Camera, Loader, User, X } from 'lucide-react';

/**
 * Reusable image upload component with Cloudinary backend.
 *
 * Props:
 *  - currentImage  : string  – current image URL to display
 *  - onUpload      : fn(url) – called with the new Cloudinary URL after upload
 *  - token         : string  – JWT for backend auth
 *  - size          : 'sm' | 'md' | 'lg'  (default: 'md')
 *  - label         : string  (default: 'Profile Photo')
 */
const ImageUpload = ({ currentImage, onUpload, token, size = 'md', label = 'Profile Photo' }) => {
  const [uploading, setUploading]   = useState(false);
  const [preview,   setPreview]     = useState(currentImage || '');
  const [error,     setError]       = useState('');
  const fileRef = useRef(null);

  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };
  const avatarClass = sizeMap[size] || sizeMap.md;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const { data } = await axios.post('/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      onUpload(data.url);
      setPreview(data.url);  // Update to permanent Cloudinary URL
    } catch (err) {
      setError('Upload failed. Please try again.');
      setPreview(currentImage || '');
      console.error('Image upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider self-start">{label}</p>

      <div className="flex items-center gap-5">
        {/* Avatar preview */}
        <div className={`relative ${avatarClass} rounded-full flex-shrink-0`}>
          {preview ? (
            <img src={preview} alt="Profile"
              className={`${avatarClass} rounded-full object-cover border-2 border-white/10`} />
          ) : (
            <div className={`${avatarClass} rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center`}>
              <User className="w-1/2 h-1/2 text-gray-600" />
            </div>
          )}
          {uploading && (
            <div className={`absolute inset-0 ${avatarClass} rounded-full bg-black/60 flex items-center justify-center`}>
              <Loader className="w-6 h-6 text-primary animate-spin" />
            </div>
          )}
        </div>

        {/* Upload button */}
        <div className="flex flex-col gap-2">
          <button type="button" disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 text-sm text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <Camera className="w-4 h-4 text-primary" />
            {uploading ? 'Uploading...' : 'Choose Photo'}
          </button>
          <p className="text-[10px] text-gray-500">JPG, PNG, WebP — max 10MB</p>
          {preview && !uploading && (
            <button type="button"
              onClick={() => { setPreview(''); onUpload(''); }}
              className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
              <X className="w-3 h-3" /> Remove photo
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-red-400 self-start">{error}</p>}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
};

export default ImageUpload;

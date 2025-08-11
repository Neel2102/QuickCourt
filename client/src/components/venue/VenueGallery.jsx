import React, { useState } from 'react';
import Modal from '../common/Modal.jsx';

const VenueGallery = ({ images = [] }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  if (!images.length) return null;

  const openAt = (idx) => {
    setActive(idx);
    setOpen(true);
  };

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((src, idx) => (
          <button key={idx} onClick={() => openAt(idx)} className="group relative rounded overflow-hidden border border-gray-200">
            <img src={src} alt={`Venue ${idx+1}`} className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
          </button>
        ))}
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} size="xlarge">
        <div className="flex items-center justify-between mb-3">
          <button onClick={prev} className="px-3 py-1 border rounded hover:bg-gray-50">Prev</button>
          <div className="text-sm text-gray-600">{active + 1} / {images.length}</div>
          <button onClick={next} className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
        </div>
        <div className="w-full">
          <img src={images[active]} alt="Preview" className="w-full max-h-[70vh] object-contain rounded" />
        </div>
      </Modal>
    </div>
  );
};

export default VenueGallery; 

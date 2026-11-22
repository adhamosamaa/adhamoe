'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, type PanInfo, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';

export interface ProjectLightboxProps {
  images: string[];
  currentIndex: number | null;
  onClose: () => void;
  projectTitle?: string;
}

// iOS native-like bezier curve easing [0.32, 0.72, 0, 1]
const slideVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : dir < 0 ? '-100%' : 0,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'tween', duration: 0.4, ease: [0.32, 0.72, 0, 1] },
      opacity: { duration: 0.3 },
    },
  },
  exit: (dir: number) => ({
    zIndex: 0,
    x: dir < 0 ? '100%' : '-100%',
    opacity: 0,
    transition: {
      x: { type: 'tween', duration: 0.4, ease: [0.32, 0.72, 0, 1] },
      opacity: { duration: 0.3 },
    },
  }),
};

const emptySubscribe = () => () => {};

export function ProjectLightbox({
  images,
  currentIndex,
  onClose,
  projectTitle,
}: ProjectLightboxProps) {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isOpen = isClient && currentIndex !== null && images.length > 0;

  const [[page, direction], setPage] = useState<[number, number]>([currentIndex ?? 0, 0]);
  const [prevCurrentIndex, setPrevCurrentIndex] = useState<number | null>(currentIndex);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isUIVisible, setIsUIVisible] = useState(true);

  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Sync index during render when prop changes
  if (currentIndex !== null && currentIndex !== prevCurrentIndex) {
    setPrevCurrentIndex(currentIndex);
    setPage([currentIndex, 0]);
    setImageLoaded(false);
    setIsUIVisible(true);
  }

  const total = images.length;
  const currentUrl = images[page] ?? images[0] ?? '';

  const paginate = useCallback(
    (newDirection: number) => {
      if (total <= 1) return;
      setImageLoaded(false);
      setPage(([prev]) => [(prev + newDirection + total) % total, newDirection]);
    },
    [total]
  );

  const handleJump = useCallback(
    (index: number) => {
      if (index === page) return;
      setImageLoaded(false);
      setPage(([prev]) => [index, index > prev ? 1 : -1]);
    },
    [page]
  );

  const triggerActivity = useCallback(() => {
    setIsUIVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsUIVisible(false);
    }, 2600);
  }, []);

  // Auto-hide UI timer after inactivity
  useEffect(() => {
    if (!isOpen) return;

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsUIVisible(false);
    }, 2600);

    const onUserActivity = () => triggerActivity();
    window.addEventListener('mousemove', onUserActivity);
    window.addEventListener('click', onUserActivity);
    window.addEventListener('touchstart', onUserActivity);

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      window.removeEventListener('mousemove', onUserActivity);
      window.removeEventListener('click', onUserActivity);
      window.removeEventListener('touchstart', onUserActivity);
    };
  }, [isOpen, triggerActivity]);

  // Lock body scroll while open and clean up on unmount
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      triggerActivity();
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        paginate(-1);
      } else if (e.key === 'ArrowRight') {
        paginate(1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, paginate, onClose, triggerActivity]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (!isOpen) return;
    const targetThumb = thumbnailRefs.current[page];
    if (targetThumb) {
      targetThumb.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [page, isOpen]);

  // 1:1 iOS drag gesture with 50px threshold
  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    { offset }: PanInfo
  ) => {
    if (offset.x < -50) {
      paginate(1);
    } else if (offset.x > 50) {
      paginate(-1);
    }
  };

  if (!isOpen) return null;

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[99999] h-screen w-screen m-0 p-0 flex flex-col justify-between bg-black/98 backdrop-blur-xl text-white select-none overflow-hidden cursor-zoom-out"
    >
      {/* ── Auto-Hiding Top Bar ── */}
      <motion.header
        initial={false}
        animate={{
          opacity: isUIVisible ? 1 : 0,
          y: isUIVisible ? 0 : -20,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className={`relative z-30 flex h-16 shrink-0 items-center justify-between px-6 sm:px-10 border-b border-white/10 bg-black/60 backdrop-blur-md cursor-default ${
          isUIVisible ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3 font-mono text-xs sm:text-sm text-white/70">
          <span className="font-semibold text-white tracking-widest">
            {String(page + 1).padStart(2, '0')}
          </span>
          <span className="text-white/30">/</span>
          <span className="tracking-widest">{String(total).padStart(2, '0')}</span>
          {projectTitle && (
            <span className="hidden sm:inline-block truncate max-w-xs font-sans text-xs text-white/40 border-l border-white/10 pl-3">
              {projectTitle}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-white/80 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/20 hover:text-white active:scale-95"
          aria-label="Close lightbox"
        >
          <span>Close</span>
          <X className="size-4 transition-transform duration-200 group-hover:rotate-90" />
        </button>
      </motion.header>

      {/* ── Main Stage (Draggable/Swipeable Image & Arrows) ── */}
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-8 touch-none cursor-zoom-out"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Left Arrow */}
        {total > 1 && (
          <motion.button
            type="button"
            initial={false}
            animate={{
              opacity: isUIVisible ? 1 : 0,
              scale: isUIVisible ? 1 : 0.85,
            }}
            transition={{ duration: 0.25 }}
            onClick={(e) => {
              e.stopPropagation();
              paginate(-1);
            }}
            aria-label="Previous image"
            className={`absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 grid size-12 sm:size-14 place-items-center rounded-full border border-white/10 bg-black/60 text-white/80 backdrop-blur-md transition-all hover:scale-105 hover:border-white/30 hover:bg-white/20 hover:text-white active:scale-95 ${
              isUIVisible ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          >
            <ChevronLeft className="size-6 sm:size-7" />
          </motion.button>
        )}

        {/* Right Arrow */}
        {total > 1 && (
          <motion.button
            type="button"
            initial={false}
            animate={{
              opacity: isUIVisible ? 1 : 0,
              scale: isUIVisible ? 1 : 0.85,
            }}
            transition={{ duration: 0.25 }}
            onClick={(e) => {
              e.stopPropagation();
              paginate(1);
            }}
            aria-label="Next image"
            className={`absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 grid size-12 sm:size-14 place-items-center rounded-full border border-white/10 bg-black/60 text-white/80 backdrop-blur-md transition-all hover:scale-105 hover:border-white/30 hover:bg-white/20 hover:text-white active:scale-95 ${
              isUIVisible ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          >
            <ChevronRight className="size-6 sm:size-7" />
          </motion.button>
        )}

        {/* Swipeable Main Image with AnimatePresence */}
        <div
          className="relative flex max-h-[80vh] max-w-[90vw] items-center justify-center cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
              <Loader2 className="size-8 animate-spin text-white/40" />
              <span className="mt-2 font-mono text-[11px] text-white/40">Loading original…</span>
            </div>
          )}

          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              onClick={(e) => e.stopPropagation()}
              className="cursor-grab active:cursor-grabbing select-none touch-none flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUrl}
                alt={
                  projectTitle
                    ? `${projectTitle} — slide ${page + 1}`
                    : `Lightbox image ${page + 1}`
                }
                draggable={false}
                onLoad={() => setImageLoaded(true)}
                className={`max-h-[80vh] max-w-[90vw] w-auto h-auto object-contain rounded-lg shadow-2xl transition-opacity duration-300 pointer-events-none ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Auto-Hiding Bottom Thumbnail Strip ── */}
      {total > 1 && (
        <motion.footer
          initial={false}
          animate={{
            opacity: isUIVisible ? 1 : 0,
            y: isUIVisible ? 0 : 20,
          }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className={`relative z-30 flex h-20 sm:h-24 shrink-0 items-center justify-center border-t border-white/10 bg-black/60 backdrop-blur-md px-4 cursor-default ${
            isUIVisible ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto max-w-5xl py-2 px-2 scrollbar-none">
            {images.map((url, idx) => {
              const isActive = idx === page;
              return (
                <button
                  key={`${url}-${idx}`}
                  ref={(el) => {
                    thumbnailRefs.current[idx] = el;
                  }}
                  type="button"
                  onClick={() => handleJump(idx)}
                  aria-label={`Jump to slide ${idx + 1}`}
                  className={`group relative h-12 w-16 sm:h-14 sm:w-20 shrink-0 overflow-hidden rounded-md border transition-all duration-200 ${
                    isActive
                      ? 'border-white ring-2 ring-white/60 scale-105 opacity-100 shadow-lg'
                      : 'border-white/15 opacity-40 hover:opacity-80 scale-100 hover:border-white/40'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Thumb ${idx + 1}`}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="absolute bottom-0.5 right-1 rounded bg-black/80 px-1 font-mono text-[9px] text-white/90">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.footer>
      )}
    </div>
  );

  return createPortal(content, document.body);
}

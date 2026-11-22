'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import type { MediaBlock } from '@/types';
import { ProjectLightbox } from '@/components/ui/ProjectLightbox';

interface ProjectMediaBlocksProps {
  blocks?: MediaBlock[];
  fallbackGallery?: string[];
  projectTitle: string;
  coverImage?: string;
}

export function ProjectMediaBlocks({
  blocks,
  fallbackGallery = [],
  projectTitle,
  coverImage,
}: ProjectMediaBlocksProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const validBlocks = (blocks || []).filter((b) => b.urls && b.urls.length > 0);

  // Flatten all images across blocks into a continuous list for the lightbox
  const allImages = useMemo(() => {
    const urls: string[] = [];
    if (coverImage && coverImage.trim()) {
      urls.push(coverImage.trim());
    }

    const source = validBlocks.length > 0
      ? validBlocks.flatMap((b) => b.urls)
      : fallbackGallery;

    for (const u of source) {
      if (u && !urls.includes(u)) {
        urls.push(u);
      }
    }
    return urls;
  }, [validBlocks, fallbackGallery, coverImage]);

  const handleOpenLightbox = (url: string) => {
    const idx = allImages.indexOf(url);
    setLightboxIndex(idx >= 0 ? idx : 0);
  };

  if (validBlocks.length === 0) {
    if (fallbackGallery.length === 0) return null;

    // Fallback: stacked legacy gallery uncropped
    return (
      <>
        <div className="flex flex-col gap-10 md:gap-16">
          {fallbackGallery.map((img, i) => (
            <div key={i} className="w-full overflow-hidden border border-white/10 bg-white/[0.02]">
              <PublicImage
                src={img}
                alt={`${projectTitle} — image ${i + 1}`}
                priority={i === 0}
                fit="contain"
                onClick={() => handleOpenLightbox(img)}
              />
            </div>
          ))}
        </div>

        <ProjectLightbox
          images={allImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          projectTitle={projectTitle}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-12 md:gap-20">
        {validBlocks.map((block, index) => {
          if (block.type === 'single') {
            return (
              <SingleBlock
                key={block.id || index}
                block={block}
                title={projectTitle}
                index={index}
                onImageClick={handleOpenLightbox}
              />
            );
          }
          if (block.type === 'grid') {
            return (
              <GridBlock
                key={block.id || index}
                block={block}
                title={projectTitle}
                index={index}
                onImageClick={handleOpenLightbox}
              />
            );
          }
          if (block.type === 'carousel') {
            return (
              <CarouselBlock
                key={block.id || index}
                block={block}
                title={projectTitle}
                index={index}
                onImageClick={handleOpenLightbox}
              />
            );
          }
          return null;
        })}
      </div>

      <ProjectLightbox
        images={allImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        projectTitle={projectTitle}
      />
    </>
  );
}

function PublicImage({
  src,
  alt,
  priority = false,
  fit = 'contain',
  aspectRatio,
  onClick,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  fit?: 'contain' | 'cover';
  aspectRatio?: string;
  onClick?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`relative w-full overflow-hidden bg-white/[0.02] ${onClick ? 'cursor-zoom-in' : ''} ${aspectRatio || ''}`}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/[0.04] animate-pulse">
          <ImageIcon className="size-8 text-white/20 animate-pulse" />
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        className={`w-full transition-all duration-500 ease-out ${
          fit === 'contain' ? 'h-auto max-h-[90vh] object-contain mx-auto block' : 'h-full object-cover'
        } ${loaded ? 'opacity-100' : 'opacity-0'} ${onClick ? 'hover:scale-[1.01]' : ''}`}
      />
    </div>
  );
}

function SingleBlock({
  block,
  title,
  index,
  onImageClick,
}: {
  block: MediaBlock;
  title: string;
  index: number;
  onImageClick: (url: string) => void;
}) {
  const url = block.urls[0];
  if (!url) return null;

  return (
    <div className="w-full overflow-hidden rounded-xl md:rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl transition-all duration-300">
      <PublicImage
        src={url}
        alt={`${title} — showcase ${index + 1}`}
        priority={index === 0}
        fit="contain"
        onClick={() => onImageClick(url)}
      />
    </div>
  );
}

function GridBlock({
  block,
  title,
  index,
  onImageClick,
}: {
  block: MediaBlock;
  title: string;
  index: number;
  onImageClick: (url: string) => void;
}) {
  const urls = block.urls.filter(Boolean);
  if (urls.length === 0) return null;

  const colsClass =
    urls.length === 1
      ? 'grid-cols-1'
      : urls.length === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid items-start gap-4 md:gap-6 ${colsClass}`}>
      {urls.map((url, slotIdx) => (
        <div
          key={slotIdx}
          className="group relative overflow-hidden rounded-xl md:rounded-2xl border border-white/10 bg-white/[0.02] shadow-xl"
        >
          <PublicImage
            src={url}
            alt={`${title} — grid block ${index + 1} item ${slotIdx + 1}`}
            fit="contain"
            onClick={() => onImageClick(url)}
          />
        </div>
      ))}
    </div>
  );
}

function CarouselBlock({
  block,
  title,
  index,
  onImageClick,
}: {
  block: MediaBlock;
  title: string;
  index: number;
  onImageClick: (url: string) => void;
}) {
  const urls = block.urls.filter(Boolean);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    skipSnaps: false,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (urls.length === 0) return null;

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="relative overflow-hidden rounded-xl md:rounded-2xl border border-white/10 bg-black/40 shadow-2xl">
      {/* Slide viewport with fluid touch swipe */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {urls.map((url, slideIdx) => (
            <div key={slideIdx} className="min-w-0 flex-[0_0_100%] relative flex items-center justify-center p-2 sm:p-4">
              <PublicImage
                src={url}
                alt={`${title} — carousel ${index + 1} slide ${slideIdx + 1}`}
                fit="contain"
                onClick={() => onImageClick(url)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Floating arrows */}
      {urls.length > 1 && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            disabled={selectedIndex === 0}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 grid size-11 place-items-center rounded-full bg-black/60 text-white/90 backdrop-blur-md transition-all hover:scale-105 hover:bg-black/90 active:scale-95 disabled:opacity-20 disabled:pointer-events-none"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={selectedIndex === urls.length - 1}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 grid size-11 place-items-center rounded-full bg-black/60 text-white/90 backdrop-blur-md transition-all hover:scale-105 hover:bg-black/90 active:scale-95 disabled:opacity-20 disabled:pointer-events-none"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}

      {/* Counter Badge */}
      {urls.length > 1 && (
        <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 font-mono text-xs font-medium text-white/80 backdrop-blur-md">
          {selectedIndex + 1} / {urls.length}
        </div>
      )}

      {/* Mini Slide Dots */}
      {urls.length > 1 && (
        <div className="flex items-center justify-center gap-2 p-3 bg-white/[0.02] border-t border-white/5">
          {urls.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => emblaApi?.scrollTo(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                dotIdx === selectedIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

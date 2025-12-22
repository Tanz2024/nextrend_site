"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";

type LightboxImage = string | { src: string; description?: string };

type Props = {
  images: LightboxImage[];
  title: string;
  heading?: string;
  subheading?: string;
  showHeader?: boolean;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const getSrc = (img: LightboxImage): string =>
  typeof img === "string" ? img : img.src;

const getDescription = (img: LightboxImage): string =>
  typeof img === "string" ? "" : img.description ?? "";

// Native-Photos swipe feel
const swipeConfidenceThreshold = 9000;
const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 70 : -70,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -70 : 70,
    opacity: 0,
  }),
};

export default function LuxuryLightboxGallery({
  images,
  title,
  heading,
  subheading,
  showHeader = true,
}: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});

  const totalImages = images.length;

  const handleImageClick = useCallback(
    (index: number) => {
      if (!totalImages) return;
      setDirection(1);
      setSelectedImageIndex(index);
    },
    [totalImages],
  );

  const closeModal = useCallback(() => {
    setSelectedImageIndex(null);
  }, []);

  const nextImage = useCallback(() => {
    setDirection(1);
    setSelectedImageIndex((current) => {
      if (current === null || totalImages === 0) return current;
      return (current + 1) % totalImages;
    });
  }, [totalImages]);

  const prevImage = useCallback(() => {
    setDirection(-1);
    setSelectedImageIndex((current) => {
      if (current === null || totalImages === 0) return current;
      return (current - 1 + totalImages) % totalImages;
    });
  }, [totalImages]);

  // Scroll lock (incl. iOS Safari)
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const scrollY = window.scrollY;

    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevLeft = document.body.style.left;
    const prevRight = document.body.style.right;
    const prevWidth = document.body.style.width;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      const top = document.body.style.top; // e.g. "-123px"
      const restoredY = top ? Math.abs(parseInt(top, 10)) : scrollY;

      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.left = prevLeft;
      document.body.style.right = prevRight;
      document.body.style.width = prevWidth;

      window.scrollTo(0, restoredY);
    };
  }, [selectedImageIndex]);

  // Keyboard nav
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedImageIndex, prevImage, nextImage, closeModal]);

  const markLoaded = useCallback((src: string) => {
    setLoadedMap((prev) => ({ ...prev, [src]: true }));
  }, []);

  if (!images.length) return null;

  const activeImage =
    selectedImageIndex !== null && totalImages > 0 ? images[selectedImageIndex] : null;

  const activeSrc = activeImage ? getSrc(activeImage) : "";
  const activeDescription = activeImage ? getDescription(activeImage) : "";

  return (
    <motion.section
      className="space-y-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeInUp}
    >
      {showHeader && (
        <div className="text-center space-y-3">
          <h2
            className="text-[clamp(1.8rem,3vw,2.4rem)] font-light text-[#2f2921]"
            style={{
              fontFamily:
                '"Playfair Display","Bodoni Moda","Times New Roman",ui-serif,Georgia,serif',
            }}
          >
            {heading ?? "Project Gallery"}
          </h2>
          <p className="text-[0.85rem] uppercase tracking-[0.3em] text-[#C6AA76]">
            {subheading ?? "Signature Installation Gallery"}
          </p>
          <div className="mx-auto h-[2px] w-24 bg-gradient-to-r from-transparent via-[#C6AA76] to-transparent" />
        </div>
      )}

      {/* thumbnails */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => {
          const src = getSrc(image);
          const description = getDescription(image);
          const isLoaded = src ? loadedMap[src] === true : false;

          return (
            <motion.div
              key={src || index}
              className="group relative aspect-[4/3] overflow-hidden rounded-[1.6rem] cursor-pointer bg-[#f5f5f5]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              onClick={() => handleImageClick(index)}
            >
              {src && !isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5f5] z-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C6AA76] border-t-transparent" />
                </div>
              )}

              {src ? (
                <Image
                  src={src}
                  alt={description ? description : `${title} gallery ${index + 1}`}
                  fill
                  sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading={index < 6 ? "eager" : "lazy"}
                  onLoadingComplete={() => markLoaded(src)}
                  onError={() => markLoaded(src)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
                  <span>No image</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-4 left-4 right-4 transform translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-xs font-medium text-white/90 backdrop-blur-sm bg-black/30 rounded-lg px-3 py-1.5">
                  Click to view
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImageIndex !== null && activeSrc && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={closeModal}
          >
            <div
              className="relative max-h-[90vh] max-w-[90vw] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Native Photos feel: drag follows finger + snap */}
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={selectedImageIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 380, damping: 34 },
                    opacity: { duration: 0.18 },
                  }}
                  className="relative w-full h-full touch-pan-y"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={(_, info) => {
                    const power = swipePower(info.offset.x, info.velocity.x);

                    if (power > swipeConfidenceThreshold) {
                      // swipe right => previous
                      prevImage();
                      return;
                    }
                    if (power < -swipeConfidenceThreshold) {
                      // swipe left => next
                      nextImage();
                      return;
                    }
                  }}
                >
                  <Image
                    src={activeSrc}
                    alt={
                      activeDescription
                        ? activeDescription
                        : `${title} gallery ${selectedImageIndex + 1}`
                    }
                    fill
                    className="object-contain select-none"
                    sizes="90vw"
                    priority
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>

              {/* arrows (desktop) */}
              {totalImages > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-12 h-12 items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                    aria-label="Previous image"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-12 h-12 items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                    aria-label="Next image"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
                }}
                className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-12 h-12 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                aria-label="Close gallery"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-white/90 text-sm font-medium">
                {selectedImageIndex + 1} of {totalImages}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

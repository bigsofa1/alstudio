//this component handles image focusing with navigation and accessibility features
//this was ported from the imagefocus component I developped on another project

import { useRef, useCallback, useEffect, useState } from "react"
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import GridIcon from "../icons/GridIcon.jsx"
import CarouselIcon from "../icons/CarouselIcon.jsx"
import { buildImageUrl } from "../sanity/imageUrl.js"

export default function ProjectImages({
  images = [],
  activeProject,
  activeTag = '',
  language = "en",
  isGridView = false,
  setIsGridView,
}) {
const [focusIndex, setFocusIndex] = useState(null)
const [isClosing, setIsClosing] = useState(false)
const [gridColumns, setGridColumns] = useState(5)
const scrollThreshold = 35;
const scrollAccumulator = useRef(0);
const touchStartRef = useRef(null);
const touchThreshold = 30;
const scrollStepSize = 100; 
const touchStepSize = 80;
const closeButtonRef = useRef(null);
const closeTimerRef = useRef(null);
const deviceDpr = typeof window !== 'undefined' ? Math.min(2, window.devicePixelRatio || 1) : 1;
const getLayoutId = (img, fallback) =>
  img?._id ||
  img?.image?.asset?._ref ||
  img?.fallbackUrl ||
  (typeof img?.image === 'string' ? img.image : undefined) ||
  `img-${fallback}`;
const MotionImg = motion.img;
const MotionFigure = motion.figure;

const getImageSrc = useCallback(
  (imageDoc, { width, height } = {}) =>
    buildImageUrl(imageDoc?.image, {
      width,
      height,
      fit: 'max',
      quality: 85,
      dpr: deviceDpr,
    }) || imageDoc?.fallbackUrl || (typeof imageDoc?.image === 'string' ? imageDoc.image : ''),
  [deviceDpr],
);

const openImage = useCallback(
   (index) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsClosing(false);
    setFocusIndex(index);
   },
   [setFocusIndex]
);

const closeImage = useCallback(() => {
    if (focusIndex === null) return;
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setFocusIndex(null);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, 200);
}, [focusIndex, setFocusIndex]
);

// Filter images by collection and tag
const visible = images.filter((img) => {
  const inCollection = !activeProject || img.collections?.includes(activeProject);
  const matchesTag = activeTag ? img.tags?.includes(activeTag) : true;
  return inCollection && matchesTag;
});
const focusImage = focusIndex !== null ? visible[focusIndex] : null;
const focusSrc = focusImage ? getImageSrc(focusImage, { width: 2000 }) : '';

const showNext = useCallback(() => {
    if (!visible.length) return;
    setFocusIndex((prev) => (prev + 1) % visible.length);
  }, [visible.length, setFocusIndex]);

  const showPrev = useCallback(() => {
    if (!visible.length) return;
    setFocusIndex((prev) => (prev - 1 + visible.length) % visible.length);
  }, [visible.length, setFocusIndex]);

  useEffect(() => {
    if (focusIndex === null) return;

    if (closeButtonRef.current){
      closeButtonRef.current.focus();
    }

    const handleKey = (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrev();
      } else if (event.key === "Escape") {
        event.preventDefault();
        closeImage();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [focusIndex, showNext, showPrev, closeImage]);

useEffect(() => {
  if (focusIndex === null) return;

  const handleWheel = (event) => {
    const primaryDelta =
      Math.abs(event.deltaY) >= Math.abs(event.deltaX)
        ? event.deltaY
        : event.deltaX;

    scrollAccumulator.current += primaryDelta;

    if (Math.abs(scrollAccumulator.current) < scrollThreshold) return;

    event.preventDefault();
    const steps = Math.max(1, Math.floor(Math.abs(scrollAccumulator.current) / scrollStepSize));
    if (scrollAccumulator.current > 0) {
      for (let i = 0; i < steps; i += 1) showNext();
    } else {
      for (let i = 0; i < steps; i += 1) showPrev();
    }
    scrollAccumulator.current = 0;
  };

  window.addEventListener("wheel", handleWheel, { passive: false });
  return () => window.removeEventListener("wheel", handleWheel);
}, [focusIndex, showNext, showPrev]);

useEffect(() => {
  if (focusIndex === null) return;

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (event) => {
    if (!touchStartRef.current) return;

    const touch = event.touches[0];
    const deltaX = touchStartRef.current.x - touch.clientX;
    const deltaY = touchStartRef.current.y - touch.clientY;
    const primaryDelta =
      Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : deltaY;

    if (Math.abs(primaryDelta) < touchThreshold) return;

    event.preventDefault();
    const steps = Math.max(1, Math.floor(Math.abs(primaryDelta) / touchStepSize));
    if (primaryDelta > 0) {
      for (let i = 0; i < steps; i += 1) showNext();
    } else {
      for (let i = 0; i < steps; i += 1) showPrev();
    }

    touchStartRef.current = null;
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  window.addEventListener("touchstart", handleTouchStart, { passive: false });
  window.addEventListener("touchmove", handleTouchMove, { passive: false });
  window.addEventListener("touchend", handleTouchEnd);

  return () => {
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
  };
}, [focusIndex, showNext, showPrev]);

useEffect(() => {
  return () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
  };
}, []);

if  (!images.length) return null;
const closeLabel = language === "fr" ? "Fermer l'image" : "Close image";

return(
    <>
      {focusImage && (
        <figure
          className={`image-focus ${isClosing ? 'image-focus--closing' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label={focusImage.label || "Expanded project image"}
          onClick={closeImage}
        >
          <div
            className="image-focus__counter"
            aria-label={`Image ${focusIndex + 1} of ${visible.length}`}
            onClick={(e) => e.stopPropagation()}
          >
            {`${focusIndex + 1}/${visible.length}`}
          </div>
          <img
            src={focusSrc}
            alt={focusImage.alt || focusImage.label || "Project image"}
            className="project-image"
          />
          <button
            type="button"
            className="hoverable image-focus-btn-exit"
            onClick={closeImage}
            ref={closeButtonRef}
            aria-label={closeLabel}
          >
            {language === "fr" ? "Fermer" : "Close"}
          </button>
          <button
            type="button"
            className="hoverable image-focus-btn-prev"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Show previous image"
          >
            &lt;
          </button>
          <button
            type="button"
            className="hoverable image-focus-btn-next"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Show next image"
          >
            &gt;
          </button>
          {focusImage.caption && (
            <figcaption className="image-focus__caption">
              {focusImage.caption}
            </figcaption>
          )}
        </figure>
      )}

      {images?.length > 0 && (
        <LayoutGroup>
          <div className="project-images">
            <button
              type="button"
              className="frosted hoverable nav__toggle project-layout__toggle"
              aria-pressed={isGridView}
              aria-label={isGridView ? 'Switch to carousel view' : 'Switch to grid view'}
              onClick={() => setIsGridView?.((prev) => !prev)}
              style={{
                position: 'fixed',
                left: 'calc(var(--margin) * 2)',
                bottom: 'calc(var(--margin) * 2)',
                pointerEvents: 'auto',
                zIndex: 3,
              }}
            >
              {isGridView ? <GridIcon /> : <CarouselIcon />}
            </button>
            {isGridView ? (
              <div className="project-images-grid-bleed">
                <div
                  className="project-images-grid"
                  role="list"
                  style={{ '--grid-columns': gridColumns }}
                >
                  <AnimatePresence mode="popLayout">
                    {visible.map((img, idx) => (
                      <MotionFigure
                        key={img._id || img.image?.asset?._ref || img.fallbackUrl || (typeof img.image === 'string' ? img.image : idx)}
                        className="project-figure project-figure--grid hoverable"
                        role="listitem"
                        layout="position"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <MotionImg
                          layoutId={getLayoutId(img, `grid-${idx}`)}
                          onClick={() => openImage(idx)}
                          src={getImageSrc(img, { width: 1200 })}
                          alt={img.alt}
                          className="project-image project-image--grid"
                        />
                      </MotionFigure>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="grid-columns-control">
                  {/* <label htmlFor="grid-columns-slider">
                    Columns: {gridColumns}
                  </label> */}
                  <input
                    className="frosted"
                    id="grid-columns-slider"
                    type="range"
                    min="3"
                    max="7"
                    step="1"
                    value={gridColumns}
                    onChange={(e) => setGridColumns(Number(e.target.value))}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="project-images-bleed">
                  <div className="project-images-carousel">
                    <AnimatePresence mode="popLayout">
                      {visible.map((img, idx) => (
                      <MotionFigure
                        key={img._id || img.image?.asset?._ref || img.fallbackUrl || (typeof img.image === 'string' ? img.image : idx)}
                        
                        className="project-figure hoverable"
                        layout="position"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        >
                          <MotionImg
                            layoutId={getLayoutId(img, `carousel-${idx}`)}
                            onClick={() => openImage(idx)}
                            src={getImageSrc(img, { width: 1600 })}
                            alt={img.alt}
                            className="project-image"
                          />
                        </MotionFigure>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </>
            )}
          </div> 
        </LayoutGroup>
      )}
    </>
);
}

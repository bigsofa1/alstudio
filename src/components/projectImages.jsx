//this component handles image focusing with navigation and accessibility features
//this was ported from the imagefocus component I developped on another project

import { useRef, useCallback, useEffect, useState } from "react"
import GridIcon from "../icons/GridIcon.jsx"
import CarouselIcon from "../icons/CarouselIcon.jsx"

export default function ProjectImages({
  images = [],
  activeProject,
  activeTag = '',
  language = "en",
  isGridView = false,
  setIsGridView,
}) {
const [focusIndex, setFocusIndex] = useState(null)
const scrollThreshold = 35;
const scrollAccumulator = useRef(0);
const touchStartRef = useRef(null);
const touchThreshold = 30;
const scrollStepSize = 100; // adjust for multi-step wheel sensitivity
const touchStepSize = 80; // adjust for multi-step swipe sensitivity
const closeButtonRef = useRef(null);

const openImage = useCallback(
   (index) => {
    setFocusIndex(index);
   },
   []
);

const closeImage = useCallback(() => {
    setFocusIndex(null);
}, []
);

// Filter images by collection and tag
const visible = images.filter((img) => {
  const inCollection = !activeProject || img.collections?.includes(activeProject);
  const matchesTag = activeTag ? img.tags?.includes(activeTag) : true;
  return inCollection && matchesTag;
});
const focusImage = focusIndex !== null ? visible[focusIndex] : null;

const showNext = useCallback(() => {
    if (!visible.length) return;
    setFocusIndex((prev) => (prev + 1) % visible.length);
  }, [visible.length]);

  const showPrev = useCallback(() => {
    if (!visible.length) return;
    setFocusIndex((prev) => (prev - 1 + visible.length) % visible.length);
  }, [visible.length]);

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

if  (!images.length) return null;
const closeLabel = language === "fr" ? "Fermer l'image" : "Close image";

return(
    <>
        {focusImage && (
            <figure
                className="image-focus"
                role="dialog"
                aria-modal="true"
                aria-label={focusImage.label || "Expanded project image"}
                onClick={closeImage}
            >
                <img src={focusImage.image} alt={focusImage.alt || focusImage.label || "Project image"}/>
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
                    onClick={(e) => {e.stopPropagation(); showPrev();}}
                    aria-label="Show previous image"
                >
                    &lt;
                </button>
                <button
                    type="button"
                    className="hoverable image-focus-btn-next"
                    onClick={(e) => {e.stopPropagation(); showNext();}}
                    aria-label="Show next image"
                >
                    &gt;
                </button>
            </figure>
        )}

        {images?.length > 0 && (
            <div className="project-images">
            <button
              type="button"
              className="hoverable nav__toggle"
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
                <div className="project-images-grid" role="list">
                  {visible.map((img, idx) => (
                    <figure
                      key={img.image}
                      onClick={() => openImage(idx)}
                      className="project-figure project-figure--grid hoverable"
                      role="listitem"
                    >
                      <img src={img.image} alt={img.alt} className="project-image project-image--grid" />
                    </figure>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="project-images-bleed">
                  <div className="project-images-carousel">
                    {visible.map((img, idx) => (
                      <figure
                        key={img.image}
                        onClick={() => openImage(idx)}
                        className="project-figure hoverable"
                      >
                        <img src={img.image} alt={img.alt} className="project-image" />
                      </figure>
                    ))}
                  </div>
                </div>
              </>
            )}
        </div> 
        )}
</>
);
}

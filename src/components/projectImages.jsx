//this component handles image focusing with navigation and accessibility features
//this was ported from the imagefocus component I developped on another project

import { useRef, useCallback, useEffect, useState, useMemo } from "react"
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import GridIcon from "../icons/GridIcon.jsx"
import CarouselIcon from "../icons/CarouselIcon.jsx"
import { buildImageUrl } from "../sanity/imageUrl.js"

export default function ProjectImages({
  images = [],
  activeProject,
  activeTag = '',
  projects = [],
  tags = [],
  // language = "en",
  isGridView = false,
  setIsGridView,
  setActiveProject,
  setActiveTag,
}) {
const [focusIndex, setFocusIndex] = useState(null)
const [isClosing, setIsClosing] = useState(false)
const [gridColumns, setGridColumns] = useState(5)
const [sliderRange, setSliderRange] = useState({ min: 3, max: 7 })
const [isProjectsOpen, setIsProjectsOpen] = useState(false)
const [isTagsOpen, setIsTagsOpen] = useState(false)
const [isFiltersOpen, setIsFiltersOpen] = useState(false)
const controlsRef = useRef(null);
const filtersRef = useRef(null);
const scrollThreshold = 35;
const scrollAccumulator = useRef(0);
const touchStartRef = useRef(null);
const touchThreshold = 30;
const scrollStepSize = 100; 
const touchStepSize = 80;
const closeButtonRef = useRef(null);
const closeTimerRef = useRef(null);
const skipNextFocusCloseRef = useRef(false);
const deviceDpr = typeof window !== 'undefined' ? Math.min(2, window.devicePixelRatio || 1) : 1;
const focusKeyRef = useRef(null);
const getLayoutId = (img, fallback) =>
  img?._id ||
  img?.image?.asset?._ref ||
  img?.fallbackUrl ||
  (typeof img?.image === 'string' ? img.image : undefined) ||
  `img-${fallback}`;
const getImageKey = useCallback(
  (img, fallback) =>
    img?._id ||
    img?.image?.asset?._ref ||
    img?.fallbackUrl ||
    (typeof img?.image === 'string' ? img.image : undefined) ||
    `img-${fallback}`,
  [],
);
const MotionImg = motion.img;
const MotionFigure = motion.figure;
const MotionDiv = motion.div;

const getImageSrc = useCallback(
  (imageDoc, { width, height, quality = 85, dpr = deviceDpr } = {}) =>
    buildImageUrl(imageDoc?.image, {
      width,
      height,
      fit: 'max',
      quality,
      dpr,
    }) || imageDoc?.fallbackUrl || (typeof imageDoc?.image === 'string' ? imageDoc.image : ''),
  [deviceDpr],
);

const visible = useMemo(() => {
  return images.filter((img) => {
    const inCollection = !activeProject || img.collections?.includes(activeProject);
    const matchesTag = activeTag ? img.tags?.includes(activeTag) : true;
    return inCollection && matchesTag;
  });
}, [images, activeProject, activeTag]);
const visibleRef = useRef(visible);
useEffect(() => {
  visibleRef.current = visible;
}, [visible]);

// Filter images by collection and tag (placed after getImageSrc so it’s defined)
const visibleCount = visible.length;
const focusImage =
  focusIndex !== null
    ? visible[focusIndex] ?? (visibleCount > 0 ? visible[0] : null)
    : null;
const focusSrc = focusImage ? getImageSrc(focusImage, { width: 2000 }) : '';

const openImage = useCallback(
   (index) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsClosing(false);
    const img = visible[index];
    focusKeyRef.current = getImageKey(img, index);
    setFocusIndex(index);
   },
   [setFocusIndex, visible, getImageKey]
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

const handleFocusClick = useCallback(
  (event) => {
    if (isFiltersOpen) {
      event.stopPropagation();
      setIsFiltersOpen(false);
      setIsProjectsOpen(false);
      setIsTagsOpen(false);
      return;
    }
    closeImage();
  },
  [isFiltersOpen, closeImage],
);

const showNext = useCallback(() => {
    const list = visibleRef.current;
    const count = list.length;
    if (!count) return;
    setFocusIndex((prev) => {
      const next = (prev + 1) % count;
      const img = list[next];
      focusKeyRef.current = getImageKey(img, next);
      return next;
    });
  }, [getImageKey]);

  const showPrev = useCallback(() => {
    const list = visibleRef.current;
    const count = list.length;
    if (!count) return;
    setFocusIndex((prev) => {
      const next = (prev - 1 + count) % count;
      const img = list[next];
      focusKeyRef.current = getImageKey(img, next);
      return next;
    });
  }, [getImageKey]);

  useEffect(() => {
    if (focusIndex === null) return;

    const asyncSetIndex = (nextIdx) =>
      setTimeout(() => {
        setFocusIndex(nextIdx);
      }, 0);

    const list = visible;
    const count = list.length;
    const key = focusKeyRef.current;
    if (key) {
      const newIdx = list.findIndex((img, idx) => getImageKey(img, idx) === key);
      if (count === 0) return;
      if (newIdx === -1) {
        // Focused image no longer visible: keep image-focus open and jump to first item
        asyncSetIndex(0);
        focusKeyRef.current = getImageKey(list[0], 0);
        return;
      }
      if (newIdx !== focusIndex) {
        asyncSetIndex(newIdx);
        return;
      }
    } else if (!count || focusIndex >= count) {
      if (count === 0) {
        return;
      }
      const newIdx = Math.min(focusIndex ?? 0, count - 1);
      asyncSetIndex(newIdx);
      focusKeyRef.current = getImageKey(list[newIdx], newIdx);
      return;
    }

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
  }, [focusIndex, showNext, showPrev, closeImage, visible, getImageKey]);

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
    if (event.touches.length > 1) {
      // Allow native pinch/zoom
      touchStartRef.current = null;
      return;
    }
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (event) => {
    if (event.touches.length > 1) {
      // Allow native pinch/zoom
      return;
    }
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

useEffect(() => {
  if (typeof window === 'undefined') return;
  const updateRange = () => {
    const isMobile = window.innerWidth <= 768;
    setSliderRange(isMobile ? { min: 1, max: 3 } : { min: 3, max: 7 });
  };
  updateRange();
  window.addEventListener('resize', updateRange);
  return () => window.removeEventListener('resize', updateRange);
}, []);

useEffect(() => {
  const handleClickOutside = (event) => {
    const container = filtersRef.current || controlsRef.current;
    if (!container) return;
    if (!container.contains(event.target)) {
      skipNextFocusCloseRef.current = false;
      // Close filter menus, but keep image focus open
      setIsProjectsOpen(false);
      setIsTagsOpen(false);
      setIsFiltersOpen(false);
      if (focusIndex !== null) return;
    }
  };
  document.addEventListener('pointerdown', handleClickOutside, true);
  return () => document.removeEventListener('pointerdown', handleClickOutside, true);
}, []);

const clampedGridColumns = Math.min(
  Math.max(gridColumns, sliderRange.min),
  sliderRange.max
);

if  (!images.length) return null;
// const closeLabel = language === "fr" ? "Fermer l'image" : "Close image";

return(
    <>
      {focusIndex !== null && visibleCount > 0 && focusImage && (
        <figure
          className={`image-focus ${isClosing ? 'image-focus--closing' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label={focusImage.label || "Expanded project image"}
          onClick={handleFocusClick}
        >
          <div className="image-focus__thumbs-row" onClick={(e) => e.stopPropagation()}>
            <div className="image-focus__thumbs" role="list">
              {visible.map((img, idx) => (
                <button
                  key={img._id || img.image?.asset?._ref || img.fallbackUrl || (typeof img.image === 'string' ? img.image : idx)}
                  type="button"
                  className={`image-focus__thumb ${idx === focusIndex ? 'is-active' : ''}`}
                  onClick={() => {
                    focusKeyRef.current = getImageKey(img, idx);
                    setFocusIndex(idx);
                  }}
                  aria-label={`Go to image ${idx + 1}`}
                  role="listitem"
                >
                  <img
                    src={getImageSrc(img, { width: 120, quality: 60, dpr: 1 })}
                    alt={img.alt || img.label || `Image ${idx + 1}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <img
            src={focusSrc}
            alt={focusImage.alt || focusImage.label || "Project image"}
            className="project-image"
          />
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
          <div className="image-focus__caption-row">
            {/* <span className="image-focus__counter">{`${focusIndex + 1}/${visible.length}`}</span> */}
            <div className="image-focus__caption">
              {focusImage.caption || ''}
            </div>
          </div>
        </figure>
      )}

      {images?.length > 0 && (
        <LayoutGroup>
          <div className="project-images">
            <div className="project-controls" ref={controlsRef}>
              <div className="project-controls__filters frosted" ref={filtersRef}>
                <button
                  className={`filter-master-toggle ${isFiltersOpen ? '' : 'muted'}`}
                  aria-expanded={isFiltersOpen}
                  onClick={() => {
                    setIsFiltersOpen((open) => {
                      if (open) {
                        setIsProjectsOpen(false);
                        setIsTagsOpen(false);
                      }
                      return !open;
                    });
                  }}
                >
                  Sort
                </button>
                {isFiltersOpen && (
                  <ul className="filter-menu nav__list">
                    <li className={`nav__group filter-menu__group ${isProjectsOpen ? 'is-open' : ''}`}>
                      <ul id="nav-items-dropdown" className="nav__dropdown filter-menu__dropdown">
                        {activeProject && (
                          <li>
                            <button
                              onClick={() => setActiveProject?.('')}
                              className="nav__link muted"
                            >
                              All
                            </button>
                          </li>
                        )}
                        {projects
                          .filter((project) => project.slug !== activeProject)
                          .map((project) => (
                            <li key={project.slug}>
                              <button
                                onClick={() => setActiveProject?.(project.slug)}
                                className="nav__link muted"
                              >
                                {project.name}
                              </button>
                            </li>
                          ))}
                      </ul>
                      <button
                        className="nav__toggle filter-menu__toggle"
                        aria-expanded={isProjectsOpen}
                        aria-controls="nav-items-dropdown"
                        onClick={() => setIsProjectsOpen((open) => !open)}
                      >
                        {activeProject
                          ? projects.find((p) => p.slug === activeProject)?.name || 'Projects'
                          : 'All'}
                      </button>
                    </li>
                    <li className={`nav__group filter-menu__group ${isTagsOpen ? 'is-open' : ''}`}>
                      {tags.length > 0 && (
                        <ul id="nav-tags-dropdown" className="nav__dropdown filter-menu__dropdown">
                          {tags
                            .filter((tag) => tag.slug !== activeTag)
                            .map((tag) => (
                              <li key={tag.slug}>
                                <button
                                  className="nav__link muted"
                                  onClick={() => setActiveTag?.(tag.slug)}
                                >
                                  {tag.name}
                                </button>
                              </li>
                            ))}
                          {activeTag && (
                            <li>
                              <button
                                className="nav__link muted"
                                onClick={() => setActiveTag?.('')}
                              >
                                All
                              </button>
                            </li>
                          )}
                        </ul>
                      )}
                      <button
                        className="nav__toggle filter-menu__toggle"
                        aria-expanded={isTagsOpen}
                        aria-controls="nav-tags-dropdown"
                        onClick={() => setIsTagsOpen((open) => !open)}
                      >
                        {tags.find((t) => t.slug === activeTag)?.name || 'All'}
                      </button>
                    </li>
                  </ul>
                )}
              </div>
              <div className="project-controls__spacer" />
              <div className="project-controls__layout-group frosted">
                <div
                  className="project-controls__slider"
                  style={{ visibility: isGridView ? 'visible' : 'hidden' }}
                >
                  <div className="grid-columns-control">
                    <input
                      id="grid-columns-slider"
                      type="range"
                      min={sliderRange.min}
                      max={sliderRange.max}
                      step="1"
                      value={clampedGridColumns}
                      onChange={(e) => setGridColumns(Number(e.target.value))}
                      disabled={!isGridView}
                    />
                  </div>
                </div>
                <div className="project-controls__layout">
                  <button
                    type="button"
                    className="hoverable nav__toggle project-layout__toggle"
                    aria-pressed={isGridView}
                    aria-label={isGridView ? 'Switch to carousel view' : 'Switch to grid view'}
                    onClick={() => setIsGridView?.((prev) => !prev)}
                  >
                    {isGridView ? <GridIcon /> : <CarouselIcon />}
                  </button>
                </div>
              </div>
            </div>
            {isGridView ? (
              <div className="project-images-grid-bleed">
                <MotionDiv
                  className="project-images-grid"
                  role="list"
                  style={{ '--grid-columns': clampedGridColumns }}
                  layout
                  layoutDependency={clampedGridColumns}
                  transition={{ layout: { duration: focusIndex === null ? 0.25 : 0, ease: 'easeInOut' } }}
                >
                  {visible.map((img, idx) => (
                    <MotionFigure
                      key={img._id || img.image?.asset?._ref || img.fallbackUrl || (typeof img.image === 'string' ? img.image : idx)}
                      className="project-figure project-figure--grid"
                      role="listitem"
                      layout
                      transition={{ layout: { duration: focusIndex === null ? 0.25 : 0, ease: 'easeInOut' } }}
                    >
                      <MotionImg
                        layoutId={getLayoutId(img, `grid-${idx}`)}
                        onClick={() => openImage(idx)}
                        src={getImageSrc(img, { width: 800, quality: 70, dpr: 1 })}
                        alt={img.alt}
                        className="project-image project-image--grid"
                      />
                    </MotionFigure>
                  ))}
                </MotionDiv>
              </div>
            ) : (
              <>
                <div className="project-images-bleed">
                  <div className="project-images-carousel">
                  <AnimatePresence mode="sync" initial={false}>
                    {visible.map((img, idx) => (
                    <MotionFigure
                      key={img._id || img.image?.asset?._ref || img.fallbackUrl || (typeof img.image === 'string' ? img.image : idx)}
                      
                      className="project-figure"
                      layout="position"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 1 }}
                      transition={{ duration: focusIndex === null ? 0.2 : 0 }}
                        >
                          <MotionImg
                            layoutId={getLayoutId(img, `carousel-${idx}`)}
                            onClick={() => openImage(idx)}
                            src={getImageSrc(img, { width: 1400 })}
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

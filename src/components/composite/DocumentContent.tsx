import React, { useEffect, useMemo, useRef, useState } from 'react';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

export interface DocumentContentProps {
  content: string;
  isHtml?: boolean;
  className?: string;
  showToc?: boolean;
  tocLabel?: string;
  progressLabel?: string;
  contentId?: string;
  id?: string;
  editorAttrs?: React.HTMLAttributes<HTMLDivElement>;
}

interface TocEntry {
  level: 2 | 3 | 4;
  text: string;
  id: string;
}

interface PreparedDocument {
  html: string;
  headings: TocEntry[];
}

function prepareDocument(content: string): PreparedDocument {
  const sanitizedHtml = sanitizeHtml(content);

  if (typeof DOMParser === 'undefined') {
    return { html: sanitizedHtml, headings: [] };
  }

  const parsed = new DOMParser().parseFromString(sanitizedHtml, 'text/html');
  const allIdElements = Array.from(parsed.body.querySelectorAll<HTMLElement>('[id]'));
  const usedIds = new Set<string>();
  const existingIds = allIdElements
    .map((element) => element.id.trim())
    .filter(Boolean);
  existingIds.forEach((id) => usedIds.add(id));
  const nonHeadingIds = new Set(
    allIdElements
      .filter((element) => !/^(H2|H3|H4)$/.test(element.tagName))
      .map((element) => element.id.trim())
      .filter(Boolean)
  );

  const headings: TocEntry[] = [];
  const seenHeadingIds = new Set<string>();
  let generatedIndex = 1;
  const headingElements = Array.from(parsed.body.querySelectorAll<HTMLElement>('h2, h3, h4'));

  headingElements.forEach((heading) => {
    const level = Number(heading.tagName.slice(1)) as 2 | 3 | 4;
    const existingId = heading.id.trim();
    let id = existingId;

    if (!id || seenHeadingIds.has(id) || nonHeadingIds.has(id)) {
      do {
        id = `gk-section-${generatedIndex++}`;
      } while (usedIds.has(id));
    }

    heading.id = id;
    usedIds.add(id);
    seenHeadingIds.add(id);
    const text = heading.textContent?.trim() ?? '';
    if (text) {
      headings.push({ level, text, id });
    }
  });

  return { html: parsed.body.innerHTML, headings };
}

export const DocumentContent: React.FC<DocumentContentProps> = ({
  content,
  isHtml = true,
  className = '',
  showToc = true,
  tocLabel = '',
  progressLabel = '',
  contentId = 'gk-reader-document-content',
  id,
  editorAttrs,
}) => {
  const actualContent = content ?? '';
  const contentRootRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);

  const prepared = useMemo(() => {
    if (!isHtml) return { html: '', headings: [] };

    try {
      return prepareDocument(actualContent);
    } catch {
      return { html: sanitizeHtml(actualContent), headings: [] };
    }
  }, [actualContent, isHtml]);

  useEffect(() => {
    if (!isHtml || !prepared.html || typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (!hash || hash === '#') return;

    let decodedId: string;
    try {
      decodedId = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }

    if (!decodedId) return;

    const target = Array.from(
      contentRootRef.current?.querySelectorAll<HTMLElement>('h2, h3, h4') ?? []
    ).find((heading) => heading.id === decodedId);

    if (target && typeof target.scrollIntoView === 'function') {
      setActiveHeadingId(target.id);
      target.scrollIntoView({ block: 'start' });
    }
  }, [isHtml, prepared.html]);

  useEffect(() => {
    if (
      !isHtml ||
      !showToc ||
      prepared.headings.length < 2 ||
      typeof window === 'undefined' ||
      typeof IntersectionObserver === 'undefined'
    ) {
      setActiveHeadingId(null);
      return;
    }

    const root = contentRootRef.current;
    if (!root) return;

    const headingIds = new Set(prepared.headings.map((heading) => heading.id));
    const headingElements = Array.from(
      root.querySelectorAll<HTMLElement>('h2, h3, h4')
    ).filter((heading) => headingIds.has(heading.id));

    if (headingElements.length === 0) return;

    setActiveHeadingId((currentHeadingId) => currentHeadingId ?? headingElements[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeading = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0]
          ?.target as HTMLElement | undefined;

        if (visibleHeading) setActiveHeadingId(visibleHeading.id);
      },
      { rootMargin: '-15% 0px -65% 0px', threshold: [0, 1] }
    );

    headingElements.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [isHtml, prepared.headings, showToc]);

  useEffect(() => {
    if (!actualContent || typeof window === 'undefined') return;

    const root = contentRootRef.current;
    if (!root) return;

    let frameId: number | null = null;

    const measureProgress = () => {
      frameId = null;

      const rect = root.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset;
      const documentTop = rect.top + scrollY;
      const documentHeight = Math.max(rect.height, root.scrollHeight);
      const scrollRange = documentHeight - viewportHeight;

      let nextProgress = 0;
      if (Number.isFinite(documentHeight) && Number.isFinite(scrollRange)) {
        nextProgress = scrollRange <= 0
          ? 100
          : ((scrollY - documentTop) / scrollRange) * 100;
      }

      if (!Number.isFinite(nextProgress)) nextProgress = 0;
      nextProgress = Math.min(100, Math.max(0, Math.round(nextProgress)));
      setProgress((currentProgress) => currentProgress === nextProgress ? currentProgress : nextProgress);
    };

    const scheduleMeasure = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(measureProgress);
    };

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(scheduleMeasure)
      : null;

    resizeObserver?.observe(root);
    window.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure);
    setProgress(0);
    scheduleMeasure();

    return () => {
      window.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
      resizeObserver?.disconnect();
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [actualContent, isHtml, prepared.html]);

  if (!actualContent || actualContent.trim() === '') return null;

  const progressIndicator = (
    <div
      className="gk-reading-progress"
      role="progressbar"
      aria-label={progressLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div className="gk-reading-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );

  if (!isHtml) {
    return <>
      {progressIndicator}
      <div className={`gk-reader-text ${className}`.trim()} id={id ?? contentId} {...editorAttrs}>{actualContent}</div>
    </>;
  }

  const showTableOfContents = showToc && prepared.headings.length >= 2;

  return (
    <>
      {progressIndicator}
      {showTableOfContents && (
        <nav className="gk-reader-toc" aria-label={tocLabel}>
          <p className="gk-reader-toc-label">{tocLabel}</p>
          <ul className="gk-reader-toc-list">
            {prepared.headings.map((heading) => (
              <li key={heading.id} className={`gk-reader-toc-item gk-reader-toc-level-${heading.level}`}>
                <a
                  className={`gk-reader-toc-link ${activeHeadingId === heading.id ? 'is-current' : ''}`.trim()}
                  href={`#${heading.id}`}
                  aria-current={activeHeadingId === heading.id ? 'location' : undefined}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div ref={contentRootRef} className={`gk-reader-content ${className}`.trim()} id={id ?? contentId} {...editorAttrs} dangerouslySetInnerHTML={{ __html: prepared.html }} />
    </>
  );
};

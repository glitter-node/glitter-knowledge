import React from 'react';

export interface KnowledgeCollectionNavigationProps {
  categories?: unknown;
  currentCategory?: string;
  basePath: string;
  navigationLabel?: string;
  invalidLabel?: string;
  emptyLabel?: string;
  searchEmptyLabel?: string;
  searchQuery?: string;
  posts?: unknown;
  loading?: boolean;
  error?: boolean;
  showEmptyState?: boolean;
  className?: string;
  id?: string;
}

function normalizeCategories(categories: unknown): string[] {
  if (!Array.isArray(categories)) return [];

  return categories
    .filter((category): category is string => typeof category === 'string')
    .map((category) => category.trim())
    .filter((category, index, values) => category && category !== 'unclassified' && values.indexOf(category) === index);
}

export const KnowledgeCollectionNavigation: React.FC<KnowledgeCollectionNavigationProps> = ({
  categories,
  currentCategory = '',
  basePath,
  navigationLabel = '',
  invalidLabel = '',
  emptyLabel = '',
  searchEmptyLabel = '',
  searchQuery = '',
  posts,
  loading = false,
  error = false,
  showEmptyState = false,
  className = '',
  id,
}) => {
  const visibleCategories = normalizeCategories(categories);
  const category = currentCategory.trim();
  const search = searchQuery.trim();
  const searchSuffix = search ? `&q=${encodeURIComponent(search)}` : '';
  const isValidCategory = visibleCategories.includes(category);
  const postItems = Array.isArray(posts) ? posts : [];
  const showEmpty = showEmptyState && !loading && !error && isValidCategory && postItems.length === 0;

  return (
    <>
      <nav id={id} className={`gk-collection-navigation ${className}`.trim()} aria-label={navigationLabel}>
        <ul className="gk-collection-navigation-list">
          {visibleCategories.map((item) => (
            <li key={item} className="gk-collection-navigation-item">
              <a
                className="gk-collection-navigation-link"
                href={`${basePath}?category=${encodeURIComponent(item)}${searchSuffix}`}
                aria-current={item === category ? 'page' : undefined}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {category && !isValidCategory && (
        <div className="gk-empty-card gk-collection-invalid" role="alert">
          <p className="gk-empty-body">{invalidLabel}</p>
        </div>
      )}
      {showEmpty && (
        <div className="gk-empty-card gk-collection-empty" role="status" aria-live="polite">
          <h3 className="gk-empty-title">{searchQuery.trim() ? searchEmptyLabel : emptyLabel}</h3>
        </div>
      )}
    </>
  );
};

KnowledgeCollectionNavigation.displayName = 'KnowledgeCollectionNavigation';

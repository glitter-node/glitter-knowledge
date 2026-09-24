import React, { useMemo } from 'react';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

export interface HtmlContentProps {
  content: string;
  isHtml?: boolean;
  className?: string;
  purifyConfig?: any;
  text?: string;
  id?: string;
  editorAttrs?: React.HTMLAttributes<HTMLDivElement>;
}

export const HtmlContent: React.FC<HtmlContentProps> = ({
  content,
  text,
  isHtml = true,
  className = '',
  purifyConfig,
  id,
  editorAttrs,
}) => {
  const actualContent = text ?? content ?? '';

  if (!actualContent || actualContent.trim() === '') return null;

  if (!isHtml) {
    return (
      <div className={`gk-reader-text ${className}`.trim()} id={id} {...editorAttrs}>
        {actualContent}
      </div>
    );
  }

  const sanitizedHtml = useMemo(() => {
    return sanitizeHtml(actualContent, purifyConfig);
  }, [actualContent, purifyConfig]);

  return <div className={`gk-reader-content ${className}`.trim()} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} id={id} {...editorAttrs} />;
};

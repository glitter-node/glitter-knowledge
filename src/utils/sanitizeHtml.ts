// @ts-ignore - DOMPurify 타입 정의는 런타임 dependency가 제공한다.
import DOMPurify from 'dompurify';

export const defaultPurifyConfig: any = {
  FORBID_TAGS: [
    'script', 'noscript', 'iframe', 'frame', 'frameset', 'object', 'embed', 'applet', 'portal',
    'form', 'input', 'textarea', 'select', 'button', 'style', 'link', 'meta', 'base',
    'body', 'head', 'html', 'title', 'svg', 'math', 'audio', 'video', 'source', 'track', 'canvas',
    'details', 'dialog', 'plaintext', 'xmp', 'listing', 'marquee', 'noframes', 'noembed', 'template', 'slot'
  ],
  FORBID_ATTR: [
    'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'ontoggle', 'oncanplay',
    'onloadstart', 'formaction', 'xlink:href', 'action'
  ],
  ALLOW_DATA_ATTR: true,
  ADD_ATTR: ['target'],
};

export function sanitizeHtml(content: string, purifyConfig?: any): string {
  const config = purifyConfig
    ? {
        ...defaultPurifyConfig,
        ...purifyConfig,
        FORBID_TAGS: [...defaultPurifyConfig.FORBID_TAGS, ...(purifyConfig.FORBID_TAGS || [])],
        FORBID_ATTR: [...defaultPurifyConfig.FORBID_ATTR, ...(purifyConfig.FORBID_ATTR || [])],
      }
    : defaultPurifyConfig;
  const cleaned = DOMPurify.sanitize(content, config) as unknown as string;

  return cleaned.replace(
    /<a\s+([^>]*?)href=["']([^"']+)["']([^>]*?)>/gi,
    (match: string, before: string, href: string, after: string) => {
      if ((href.startsWith('http://') || href.startsWith('https://')) && !match.includes('rel=')) {
        return `<a ${before}href="${href}"${after} rel="noopener noreferrer">`;
      }
      return match;
    }
  );
}

import DOMPurify from 'dompurify';

interface SafeHtmlProps {
    html: string;
    className?: string;
}

export default function SafeHtml({ html, className = '' }: SafeHtmlProps) {
    const sanitized = DOMPurify.sanitize(html);

    return (
        <div
            className={className}
            // safe because html is sanitized by DOMPurify before injection
            // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized HTML
            dangerouslySetInnerHTML={{ __html: sanitized }}
        />
    );
}

import { useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import 'jodit/es2015/jodit.min.css';

interface WysiwygEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    id?: string;
}

export default function WysiwygEditor({ value, onChange, placeholder, id }: WysiwygEditorProps) {
    const editor = useRef(null);

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: placeholder || 'Start typing...',
            toolbarButtonSize: 'small',
            buttons: [
                'bold',
                'italic',
                'underline',
                'strikethrough',
                '|',
                'ul',
                'ol',
                '|',
                'paragraph',
                'h1',
                'h2',
                'h3',
                '|',
                'link',
                'image',
                '|',
                'undo',
                'redo',
            ],
            uploader: {
                insertImageAsBase64URI: true,
            },
            askBeforePasteHTML: false,
            askBeforePasteFromWord: false,
            defaultActionOnPaste: 'insert_as_html',
        }),
        [placeholder]
    );

    return (
        <div id={id} className="wysiwyg-editor">
            <JoditEditor ref={editor} value={value || ''} config={config} onChange={onChange} />
        </div>
    );
}

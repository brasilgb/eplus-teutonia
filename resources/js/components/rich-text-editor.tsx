import { Bold, Eraser, Italic, Link, List, ListOrdered, Quote } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    const editor = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editor.current && document.activeElement !== editor.current && editor.current.innerHTML !== value) editor.current.innerHTML = value;
    }, [value]);

    const command = (name: string, argument?: string) => {
        editor.current?.focus();
        document.execCommand(name, false, argument);
        onChange(editor.current?.innerHTML ?? '');
    };
    const addLink = () => { const url = window.prompt('Informe a URL do link:'); if (url) command('createLink', url); };

    return <div className="overflow-hidden border border-black/15 bg-[#f4f4f2] focus-within:border-[#d60057]"><div className="flex flex-wrap gap-1 border-b border-black/10 bg-white p-2"><Tool label="Negrito" onClick={() => command('bold')}><Bold size={16}/></Tool><Tool label="Itálico" onClick={() => command('italic')}><Italic size={16}/></Tool><Tool label="Título" onClick={() => command('formatBlock', 'h2')}><b>H2</b></Tool><Tool label="Subtítulo" onClick={() => command('formatBlock', 'h3')}><b>H3</b></Tool><Tool label="Lista" onClick={() => command('insertUnorderedList')}><List size={16}/></Tool><Tool label="Lista numerada" onClick={() => command('insertOrderedList')}><ListOrdered size={16}/></Tool><Tool label="Citação" onClick={() => command('formatBlock', 'blockquote')}><Quote size={16}/></Tool><Tool label="Link" onClick={addLink}><Link size={16}/></Tool><Tool label="Limpar formatação" onClick={() => command('removeFormat')}><Eraser size={16}/></Tool></div><div ref={editor} contentEditable suppressContentEditableWarning onInput={event => onChange(event.currentTarget.innerHTML)} className="min-h-56 p-4 leading-relaxed outline-none [&_blockquote]:border-l-4 [&_blockquote]:border-[#d60057] [&_blockquote]:pl-4 [&_h2]:text-2xl [&_h2]:font-black [&_h3]:text-xl [&_h3]:font-bold [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"/></div>;
}

function Tool({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
    return <button type="button" title={label} aria-label={label} onMouseDown={event => { event.preventDefault(); onClick(); }} className="grid h-9 min-w-9 place-items-center border border-transparent px-2 hover:border-black/15 hover:bg-black/5">{children}</button>;
}

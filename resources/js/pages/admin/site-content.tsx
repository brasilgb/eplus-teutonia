import InputError from '@/components/input-error';
import PanelLayout from '@/components/panel-layout';
import RichTextEditor from '@/components/rich-text-editor';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { toast } from 'sonner';

type Field = { name: string; label: string; type?: 'textarea' | 'file' | 'select' };
type ContentValue = string | number | File | null;
type Props = { page: string; title: string; fields: Field[]; content: Record<string, string | number | null> | null; categories: { id: number; name: string }[] };

export default function SiteContent({ page, title, fields, content, categories }: Props) {
    const initial = Object.fromEntries(fields.map(field => [field.name, field.type === 'file' ? null : content?.[field.name] ?? '']));
    const { data, setData, post, processing, errors } = useForm<Record<string, ContentValue>>(initial);
    const flash = usePage().props.flash as { success?: string } | undefined;
    useEffect(() => { if (flash?.success) toast.success(flash.success); }, [flash?.success]);
    const submit = (event: FormEvent) => { event.preventDefault(); post(`/admin/paginas/${page}`, { forceFormData: true, preserveScroll: true }); };

    return <PanelLayout area="admin" title={title} description="Edite o conteúdo exibido nesta página pública.">
        <Head title={`${title} | Conteúdo`}/>
        <form onSubmit={submit} className="border border-black/10 bg-white">
            <div className="grid gap-6 p-6 sm:grid-cols-2 lg:p-8">{fields.map(field => <label key={field.name} className={field.type === 'textarea' || field.type === 'file' || field.name === 'content' ? 'sm:col-span-2' : ''}><span className="mb-2 block text-sm font-bold">{field.label}</span>{field.name === 'content' ? <RichTextEditor value={String(data[field.name] ?? '')} onChange={value => setData(field.name, value)}/> : field.type === 'textarea' ? <textarea value={String(data[field.name] ?? '')} onChange={event => setData(field.name, event.target.value)} className="min-h-40 w-full border border-black/15 bg-[#f4f4f2] p-4 outline-none focus:border-[#d60057]"/> : field.type === 'file' ? <div><input type="file" accept="image/*" onChange={event => setData(field.name, event.target.files?.[0] ?? null)} className="w-full border border-dashed border-black/20 bg-[#f4f4f2] p-5 text-sm file:mr-4 file:border-0 file:bg-black file:px-4 file:py-2 file:font-bold file:text-white"/>{content?.[field.name]&&<img src={`/storage/${content[field.name]}`} alt="Imagem atual" className="mt-3 h-24 w-40 border border-black/10 object-cover"/>}</div> : field.type === 'select' ? <select value={String(data[field.name] ?? '')} onChange={event => setData(field.name, event.target.value)} className="h-12 w-full border border-black/15 bg-[#f4f4f2] px-4 outline-none focus:border-[#d60057]"><option value="">Nenhuma categoria</option>{categories.map(category=><option key={category.id} value={category.id}>{category.name}</option>)}</select> : <input value={String(data[field.name] ?? '')} onChange={event => setData(field.name, event.target.value)} className="h-12 w-full border border-black/15 bg-[#f4f4f2] px-4 outline-none focus:border-[#d60057]"/>}<InputError message={errors[field.name]}/></label>)}</div>
            <div className="flex justify-end border-t border-black/10 bg-black/[.02] p-5"><button disabled={processing} className="flex items-center gap-2 bg-[#d60057] px-7 py-4 font-bold text-white hover:bg-[#b8004b] disabled:opacity-50"><Save size={18}/>{processing ? 'Salvando...' : 'Salvar conteúdo'}</button></div>
        </form>
    </PanelLayout>;
}

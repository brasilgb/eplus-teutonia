import PanelLayout from '@/components/panel-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

type RecordValue = string | number | boolean | null;
type Props = { resource: string; title: string; columns: string[]; records: Record<string, RecordValue>[] };
const labels: Record<string, string> = { id: 'ID', client_id: 'Cliente', defect: 'Defeito', status: 'Status', cost: 'Total', title: 'Título', brand: 'Marca', featured: 'Imagem', thumbnail: 'Imagem', image: 'Imagem', link: 'Link', valnormal: 'Valor', active: 'Ativo', summary: 'Descrição', name: 'Nome', type: 'Tipo', email: 'E-mail', is_active: 'Ativo', updated_at: 'Atualização' };

function display(column: string, value: RecordValue) {
    if (['featured', 'thumbnail', 'image'].includes(column) && value) return <img src={`/storage/${value}`} alt="" className="h-12 w-16 border border-black/10 object-cover"/>;
    if (column === 'active' || column === 'is_active') return value ? 'Sim' : 'Não';
    if (column === 'cost' || column === 'valnormal') return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value ?? 0));
    if (column === 'updated_at' && value) return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(String(value)));
    return value === null || value === '' ? '—' : String(value);
}

export default function Resource({ resource, title, columns, records }: Props) {
    const [query, setQuery] = useState('');
    const flash = usePage().props.flash as { success?: string } | undefined;
    useEffect(() => { if (flash?.success) toast.success(flash.success); }, [flash?.success]);
    const visible = useMemo(() => records.filter(record => Object.values(record).some(value => String(value ?? '').toLowerCase().includes(query.toLowerCase()))), [records, query]);
    const remove = (id: RecordValue) => {
        if (!window.confirm('Deseja realmente excluir este registro? Esta ação não pode ser desfeita.')) return;
        router.delete(`/admin/${resource}/${id}`, { preserveScroll: true, onSuccess: () => toast.success('Registro excluído.'), onError: () => toast.error('Não foi possível excluir o registro.') });
    };

    return <PanelLayout area="admin" title={title} description={`${records.length} registros encontrados`}>
        <Head title={`${title} | Administrativo`}/>
        <section className="border border-black/10 bg-white">
            <div className="flex flex-col justify-between gap-4 border-b border-black/10 p-5 sm:flex-row sm:items-center"><label className="flex w-full max-w-md items-center gap-3 border border-black/15 bg-[#f4f4f2] px-4 py-3"><Search size={18}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder={`Buscar em ${title.toLowerCase()}...`} className="w-full bg-transparent text-sm outline-none"/></label><div className="flex items-center gap-4"><span className="text-sm font-bold text-black/40">{visible.length} exibidos</span><Link href={`/admin/${resource}/novo`} className="flex items-center gap-2 bg-[#d60057] px-4 py-3 text-sm font-bold text-white hover:bg-[#b8004b]"><Plus size={17}/> Novo</Link></div></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[860px] text-left text-sm"><thead className="bg-black/[.025] text-xs text-black/45 uppercase"><tr>{columns.map(column => <th key={column} className="px-5 py-4">{labels[column] ?? column}</th>)}<th className="px-5 py-4 text-right">Ações</th></tr></thead><tbody>{visible.map((record, index) => <tr key={String(record.id ?? index)} className="border-t border-black/5 hover:bg-black/[.015]">{columns.map(column => <td key={column} className={`max-w-sm truncate px-5 py-4 ${column === 'id' ? 'font-black' : ''}`}>{display(column, record[column])}</td>)}<td className="px-5 py-3"><div className="flex justify-end gap-2"><Link href={`/admin/${resource}/${record.id}/editar`} className="grid h-9 w-9 place-items-center border border-black/10 hover:border-black" title="Editar"><Pencil size={16}/></Link><button onClick={() => remove(record.id)} className="grid h-9 w-9 place-items-center border border-black/10 text-red-600 hover:border-red-600" title="Excluir"><Trash2 size={16}/></button></div></td></tr>)}{visible.length === 0 && <tr><td colSpan={columns.length + 1} className="px-5 py-14 text-center text-black/40">Nenhum registro encontrado.</td></tr>}</tbody></table></div>
        </section>
    </PanelLayout>;
}

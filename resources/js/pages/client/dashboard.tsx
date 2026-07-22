import PanelLayout from '@/components/panel-layout';
import { Head } from '@inertiajs/react';
import { CheckCircle2, Clock3, Wrench } from 'lucide-react';

type Order = { id: number; defect: string | null; details: string | null; descbudget: string | null; valuebudget: string; cost: string; status: string | null; dtentry: string | null; dtdelivery: string | null };
type Props = { orders: Order[]; stats: { pending: number; completed: number; total: number } };
const money = (value: string) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));
const date = (value: string | null) => value ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(value)) : '—';

export default function ClientDashboard({ orders, stats }: Props) {
    const cards = [['Em andamento', stats.pending, Clock3], ['Concluídas', stats.completed, CheckCircle2], ['Total de ordens', stats.total, Wrench]] as const;
    return <PanelLayout area="client" title="Minhas ordens" description="Acompanhe o andamento dos seus equipamentos.">
        <Head title="Área do cliente"/>
        <section className="grid gap-4 sm:grid-cols-3">{cards.map(([label, value, Icon]) => <article key={label} className="flex items-center gap-5 border border-black/10 bg-white p-5"><span className="grid h-12 w-12 place-items-center bg-[#d60057] text-white"><Icon size={22}/></span><div><p className="text-3xl font-black">{value}</p><p className="text-sm text-black/45">{label}</p></div></article>)}</section>
        <section className="mt-6 space-y-4">{orders.map(order => <article key={order.id} className="border border-black/10 bg-white"><div className="flex flex-col justify-between gap-4 border-b border-black/10 p-5 sm:flex-row sm:items-center"><div><p className="text-xs font-bold text-[#d60057]">ORDEM DE SERVIÇO</p><h2 className="mt-1 text-2xl font-black">#{order.id}</h2></div><span className={`self-start px-4 py-2 text-xs font-black uppercase ${order.status === 'Entregue ao Cliente' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{order.status ?? 'Em análise'}</span></div><div className="grid gap-6 p-5 md:grid-cols-2 lg:grid-cols-4"><Info label="Defeito informado" value={order.defect}/><Info label="Serviços executados" value={order.details}/><Info label="Entrada" value={date(order.dtentry)}/><Info label="Entrega" value={date(order.dtdelivery)}/></div><div className="flex flex-col justify-between gap-3 bg-black/[.025] px-5 py-4 sm:flex-row sm:items-center"><p className="text-sm text-black/50">{order.descbudget ?? 'Orçamento sem observações.'}</p><p className="whitespace-nowrap font-black">Total: {money(order.cost)}</p></div></article>)}{orders.length === 0 && <div className="border border-dashed border-black/20 bg-white px-6 py-16 text-center"><Wrench className="mx-auto text-black/20" size={42}/><h2 className="mt-4 text-xl font-black">Nenhuma ordem encontrada</h2><p className="mt-2 text-black/45">Quando uma ordem for vinculada ao seu cadastro, ela aparecerá aqui.</p></div>}</section>
    </PanelLayout>;
}

function Info({ label, value }: { label: string; value: string | null }) { return <div><p className="text-xs font-bold text-black/35 uppercase">{label}</p><p className="mt-2 text-sm font-medium">{value || '—'}</p></div>; }

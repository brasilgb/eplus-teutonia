import PanelLayout from '@/components/panel-layout';
import { Head } from '@inertiajs/react';
import { FolderTree, ShoppingBag, Users, Wrench } from 'lucide-react';

type Props = { stats: { users: number; categories: number; services: number; products: number } };

export default function AdminDashboard({ stats }: Props) {
    const cards = [['Usuários', stats.users, Users, 'Cadastros no sistema'], ['Categorias', stats.categories, FolderTree, 'Categorias cadastradas'], ['Serviços', stats.services, Wrench, 'Serviços cadastrados'], ['Produtos', stats.products, ShoppingBag, 'Itens no catálogo']] as const;
    return <PanelLayout area="admin" title="Visão geral" description="Acompanhe os principais números da Eplus.">
        <Head title="Painel administrativo"/>
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label,value,Icon,helper])=><article key={label} className="border border-black/10 bg-white p-7"><div className="flex items-start justify-between"><div><p className="text-sm font-bold text-black/45">{label}</p><p className="mt-3 text-4xl font-black">{value}</p></div><span className="grid h-12 w-12 place-items-center bg-[#d60057] text-white"><Icon size={22}/></span></div><p className="mt-6 text-xs text-black/40">{helper}</p></article>)}</section>
    </PanelLayout>;
}

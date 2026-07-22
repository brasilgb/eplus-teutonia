import { Link, router, usePage } from '@inertiajs/react';
import { Boxes, Contact, FileText, House, Image, Info, LogOut, Menu, Package, Settings, ShoppingBag, Tags, Users, Wrench, X } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';

type PanelLayoutProps = PropsWithChildren<{
    area: 'admin' | 'client';
    title: string;
    description?: string;
}>;

const adminLinks = [
    ['/admin', 'Visão geral', House],
    ['/admin/produtos', 'Produtos', ShoppingBag],
    ['/admin/servicos', 'Serviços', Package],
    ['/admin/categorias', 'Categorias', Boxes],
    ['/admin/marcas', 'Marcas', Tags],
    ['/admin/banners', 'Banners da Home', Image],
    ['/admin/paginas/home', 'Página inicial', FileText],
    ['/admin/paginas/sobre', 'Página Sobre', Info],
    ['/admin/paginas/contato', 'Página Contato', Contact],
    ['/admin/usuarios', 'Usuários', Users],
    ['/admin/configuracoes', 'Configurações do site', Settings],
] as const;

const clientLinks = [
    ['/painel', 'Minhas ordens', Wrench],
    ['/settings/profile', 'Meus dados', Settings],
] as const;

export default function PanelLayout({ area, title, description, children }: PanelLayoutProps) {
    const [open, setOpen] = useState(false);
    const { url, props } = usePage();
    const links = area === 'admin' ? adminLinks : clientLinks;
    const user = props.auth.user as { name: string; email: string };
    const settings = props.siteSettings as { logo?: string; title?: string } | null;

    const navigation = <>
        <Link href="/" className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
            {settings?.logo ? <img src={`/storage/${settings.logo}`} alt={settings.title || 'Eplus'} className="h-12 w-auto max-w-48 object-contain" /> : <span className="text-2xl font-black tracking-[-.08em] text-white">EPLUS<span className="text-[#d60057]">.</span></span>}
        </Link>
        <div className="px-4 py-6">
            <p className="mb-3 px-3 text-[10px] font-black tracking-[.2em] text-white/35 uppercase">{area === 'admin' ? 'Administrativo' : 'Área do cliente'}</p>
            <nav className="space-y-1">{links.map(([href, label, Icon]) => {
                const active = url === href || (href !== '/admin' && href !== '/painel' && url.startsWith(href));
                return <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-3 py-3 text-sm font-bold transition ${active ? 'bg-[#d60057] text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}><Icon size={19}/>{label}</Link>;
            })}</nav>
        </div>
    </>;

    return <div className="min-h-screen bg-[#f4f4f2] text-[#161616]">
        <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 bg-[#111] lg:block">{navigation}</aside>
        {open && <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-black/55" onClick={() => setOpen(false)} aria-label="Fechar menu"/><aside className="relative h-full w-72 bg-[#111]">{navigation}</aside></div>}
        <div className="lg:pl-72">
            <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-black/10 bg-[#f4f4f2]/95 px-5 backdrop-blur-xl sm:px-8">
                <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Abrir menu">{open ? <X/> : <Menu/>}</button>
                <Link href="/" className="hidden text-sm font-bold text-black/45 hover:text-black lg:block">← Voltar ao site</Link>
                <div className="ml-auto flex items-center gap-4"><div className="hidden text-right sm:block"><p className="text-sm font-bold">{user.name}</p><p className="text-xs text-black/45">{user.email}</p></div><button onClick={() => router.post('/logout')} className="grid h-10 w-10 place-items-center border border-black/15 hover:border-[#d60057] hover:text-[#d60057]" title="Sair"><LogOut size={18}/></button></div>
            </header>
            <main className="px-5 py-8 sm:px-8 lg:px-10"><div className="mx-auto max-w-7xl"><div className="mb-8"><p className="text-xs font-black tracking-[.2em] text-[#d60057] uppercase">{area === 'admin' ? 'Painel de controle' : 'Eplus • Cliente'}</p><h1 className="mt-2 text-3xl font-black tracking-[-.04em] sm:text-4xl">{title}</h1>{description && <p className="mt-2 text-black/50">{description}</p>}</div>{children}</div></main>
        </div>
    </div>;
}

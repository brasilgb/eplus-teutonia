import { Link, usePage } from '@inertiajs/react';
import { Instagram, LockKeyhole, Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';

const links = [
    ['/', 'Início'],
    ['/servicos', 'Serviços'],
    ['/produtos', 'Produtos'],
    ['/sobre', 'Sobre'],
    ['/contato', 'Contato'],
];

export default function SiteLayout({ children }: PropsWithChildren) {
    const [open, setOpen] = useState(false);
    const { url, props } = usePage();
    const restrictedArea = props.auth.user ? '/dashboard' : '/login';
    const settings = props.siteSettings as { logo?: string; title?: string; description?: string; email?: string; telephone?: string; celular?: string; street?: string; number?: string; neighborhood?: string; city?: string; state?: string; whatsapp?: string; instagram?: string } | null;
    const whatsapp = settings?.whatsapp?.replace(/\D/g, '');
    const whatsappMessage = encodeURIComponent('Olá! Gostaria de mais informações sobre os produtos e serviços da Eplus.');
    const address = [settings?.street, settings?.number, settings?.neighborhood, settings?.city, settings?.state].filter(Boolean).join(', ');
    const contactPhone = settings?.celular || (settings?.telephone !== '(00) 0000-0000' ? settings?.telephone : undefined);

    return (
        <div className="min-h-screen bg-[#f4f4f2] text-[#161616]">
            <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f4f4f2]/95 backdrop-blur-xl">
                <div className="border-b border-black/10 bg-[#e7e7e2] text-black">
                    <div className="mx-auto grid min-h-9 max-w-7xl grid-cols-2 items-center gap-x-5 gap-y-2 px-5 py-2 text-xs lg:grid-cols-[2fr_1fr_1.5fr_auto]">
                        <span className="flex min-w-0 items-center gap-2 text-black/55"><MapPin size={14} className="shrink-0 text-[#b3264f]"/><span className="truncate">{address || 'Teutônia, RS'}</span></span>
                        {contactPhone && <a href={`tel:${contactPhone.replace(/\D/g, '')}`} className="group flex items-center gap-2 text-black/60 transition hover:text-black lg:justify-self-center"><Phone size={14} className="text-[#b3264f] transition group-hover:text-[#d60057]"/>{contactPhone}</a>}
                        {settings?.email && <a href={`mailto:${settings.email}`} className="group flex items-center gap-2 text-black/60 transition hover:text-black lg:justify-self-center"><Mail size={14} className="text-[#b3264f] transition group-hover:text-[#d60057]"/><span className="hidden sm:inline">{settings.email}</span><span className="sm:hidden">E-mail</span></a>}
                        {settings?.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram da Eplus" title="Instagram" className="justify-self-end text-[#b3264f] transition hover:text-[#d60057]"><Instagram size={17}/></a>}
                    </div>
                </div>
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
                    <Link href="/" className="flex items-center gap-3" aria-label="Eplus - início">
                        {settings?.logo ? <img src={`/storage/${settings.logo}`} alt={settings.title || 'Eplus'} className="h-12 w-auto max-w-44 object-contain brightness-0" /> : <span className="text-2xl font-black tracking-[-.08em]">EPLUS<span className="text-[#d60057]">.</span></span>}
                    </Link>
                    <nav className="hidden items-center gap-1 md:flex">
                        {links.map(([href, label]) => <Link key={href} href={href} className={`px-4 py-2 text-sm font-bold transition ${url === href || (href !== '/' && url.startsWith(href)) ? 'bg-black text-white' : 'hover:bg-black/5'}`}>{label}</Link>)}
                    </nav>
                    <div className="hidden items-center gap-3 md:flex">
                        <Link href="/contato" className="flex items-center gap-2 border border-black px-4 py-2 text-sm font-bold hover:bg-black hover:text-white"><Phone size={16} /> Falar agora</Link>
                        <Link href={restrictedArea} className="flex items-center gap-2 bg-[#b3264f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#d60057]"><LockKeyhole size={16} /> Área restrita</Link>
                    </div>
                    <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Abrir menu">{open ? <X /> : <Menu />}</button>
                </div>
                {open && <nav className="border-t border-black/10 bg-[#f4f4f2] p-5 md:hidden">{links.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-black/10 py-4 text-lg font-bold">{label}</Link>)}<Link href={restrictedArea} onClick={() => setOpen(false)} className="mt-4 flex items-center justify-center gap-2 bg-[#b3264f] px-4 py-4 font-bold text-white transition hover:bg-[#d60057]"><LockKeyhole size={18}/> Área restrita</Link></nav>}
            </header>
            <main>{children}</main>
            <footer className="bg-[#111] text-white">
                <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4">
                    <div className="md:col-span-2">{settings?.logo ? <img src={`/storage/${settings.logo}`} alt={settings.title || 'Eplus'} className="h-16 w-auto max-w-64 object-contain" /> : <p className="text-3xl font-black tracking-[-.08em]">EPLUS<span className="text-[#d60057]">.</span></p>}<p className="mt-4 max-w-md text-white/55">{settings?.description || 'Tecnologia precisa de cuidado. A gente resolve com transparência, agilidade e um atendimento realmente próximo.'}</p></div>
                    <div><p className="mb-4 text-xs font-bold tracking-[.2em] text-[#d60057] uppercase">Navegue</p>{links.slice(1).map(([href,label]) => <Link key={href} href={href} className="mb-2 block text-sm text-white/70 hover:text-white">{label}</Link>)}</div>
                    <div><p className="mb-4 text-xs font-bold tracking-[.2em] text-[#d60057] uppercase">Contato</p><p className="text-sm text-white/70">{settings?.email || 'contato@eplusteutonia.com.br'}</p><p className="mt-2 text-sm text-white/70">{settings?.city || 'Teutônia'}, {settings?.state || 'Rio Grande do Sul'}</p><a href={settings?.instagram || '#'} target={settings?.instagram ? '_blank' : undefined} rel="noreferrer" className="mt-5 inline-flex"><Instagram size={20}/></a></div>
                </div>
                <div className="border-t border-white/10 px-5 py-5 text-xs text-white/35"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left"><span>© {new Date().getFullYear()} Eplus. Todos os direitos reservados.</span><a href="https://abrasilsistemas.com.br" target="_blank" rel="noreferrer" title="Desenvolvido por A Brasil Sistemas" className="opacity-70 transition hover:opacity-100"><img src="/images/logo_ab.png" alt="Desenvolvido por A Brasil Sistemas" className="h-10 w-10 rounded-md object-cover"/></a></div></div>
            </footer>
            <a href="https://www.whatsapp.com/channel/0029VayHmUB3AzNaXog1gq1K" target="_blank" rel="noreferrer" aria-label="Acessar o canal de ofertas da Eplus no WhatsApp" className="fixed bottom-5 left-5 z-50 w-24 overflow-hidden rounded-md border-2 border-white bg-black p-1.5 shadow-xl transition hover:scale-105 sm:w-36"><img src="/canal-de-ofertas.jpg" alt="Canal de ofertas da Eplus no WhatsApp" className="h-auto w-full rounded-sm"/></a>
            <a href={whatsapp ? `https://wa.me/${whatsapp}?text=${whatsappMessage}` : '/contato'} target={whatsapp ? '_blank' : undefined} rel="noreferrer" aria-label="Solicitar atendimento pelo WhatsApp" className="fixed right-5 bottom-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-xl transition hover:scale-105"><Phone fill="currentColor" /></a>
        </div>
    );
}

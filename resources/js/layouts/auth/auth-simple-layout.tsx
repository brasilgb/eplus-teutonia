import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, ShieldCheck, Wrench } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

type SiteSettings = { logo?: string; title?: string } | null;

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    const settings = usePage().props.siteSettings as SiteSettings;
    const logo = settings?.logo ? `/storage/${settings.logo}` : null;

    return <main className="min-h-screen bg-[#f4f4f2] text-[#161616] lg:grid lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative hidden min-h-screen overflow-hidden bg-[#111] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
            <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-[#b3264f]/25 blur-3xl"/><div className="absolute -right-40 -bottom-44 h-[32rem] w-[32rem] rounded-full bg-[#d60057]/15 blur-3xl"/>
            <Link href={home()} className="relative z-10 inline-flex self-start">{logo?<img src={logo} alt={settings?.title||'Eplus Teutônia'} className="h-20 w-auto max-w-72 object-contain"/>:<span className="text-4xl font-black tracking-[-.08em]">EPLUS<span className="text-[#d60057]">.</span></span>}</Link>
            <div className="relative z-10 max-w-xl"><p className="text-xs font-black tracking-[.25em] text-[#e84b7e] uppercase">Área restrita</p><h2 className="mt-5 text-5xl leading-[.96] font-black tracking-[-.055em] xl:text-6xl">TECNOLOGIA COM CUIDADO E CONFIANÇA.</h2><p className="mt-6 max-w-lg text-lg leading-relaxed text-white/55">Acompanhe seus atendimentos e mantenha seus dados atualizados em um ambiente seguro.</p><div className="mt-10 grid gap-4 text-sm text-white/70"><span className="flex items-center gap-3"><CheckCircle2 size={19} className="text-[#e84b7e]"/>Acesso rápido aos seus atendimentos</span><span className="flex items-center gap-3"><ShieldCheck size={19} className="text-[#e84b7e]"/>Seus dados protegidos</span><span className="flex items-center gap-3"><Wrench size={19} className="text-[#e84b7e]"/>Suporte especializado Eplus</span></div></div>
            <p className="relative z-10 text-xs text-white/30">Eplus Teutônia • Assistência Técnica</p>
        </section>
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
            <div className="w-full max-w-md">
                <div className="mb-8 flex items-center justify-between lg:hidden"><Link href={home()}>{logo?<img src={logo} alt={settings?.title||'Eplus Teutônia'} className="h-14 w-auto max-w-52 object-contain brightness-0"/>:<span className="text-3xl font-black tracking-[-.08em]">EPLUS<span className="text-[#d60057]">.</span></span>}</Link></div>
                <Link href={home()} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-black/45 transition hover:text-black"><ArrowLeft size={17}/> Voltar ao site</Link>
                <div className="border border-black/10 bg-white p-7 shadow-[0_24px_70px_rgba(0,0,0,.08)] sm:p-10"><div className="mb-8"><p className="text-xs font-black tracking-[.2em] text-[#b3264f] uppercase">Eplus Teutônia</p><h1 className="mt-3 text-3xl font-black tracking-[-.04em]">{title}</h1>{description&&<p className="mt-3 leading-relaxed text-black/50">{description}</p>}</div>{children}</div>
                <p className="mt-6 text-center text-xs text-black/35">Problemas para acessar? Entre em contato com nossa equipe.</p>
            </div>
        </section>
    </main>;
}

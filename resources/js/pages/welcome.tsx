import SiteLayout from '@/components/site-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Check, Clock3, Headphones, ShieldCheck, Smartphone, Wrench, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const services = [
    { icon: Smartphone, title: 'Smartphones', text: 'Troca de tela, bateria, conectores e reparos em placa.' },
    { icon: Wrench, title: 'Assistência técnica', text: 'Diagnóstico preciso e manutenção para seus equipamentos.' },
    { icon: Headphones, title: 'Acessórios', text: 'Produtos selecionados para proteger e completar seu dia a dia.' },
];

type Banner = { title: string; description: string | null; image: string; link: string | null };
type SectionItem = { id: number; title: string; slug: string; summary: string | null; featured: string | null; valnormal?: string | null; valpromo?: string | null };
type HomeSection = { id: number; name: string; type: 'product' | 'service'; description: string | null; featured: string | null; items: SectionItem[] };
type Brand = { id: number; brand: string; thumbnail: string };

export default function Welcome({ banners = [], homeSections = [], brands = [] }: { banners?: Banner[]; homeSections?: HomeSection[]; brands?: Brand[] }) {
    const [activeSlide, setActiveSlide] = useState(0);
    const banner = banners[activeSlide];
    useEffect(() => {
        if (banners.length < 2) return;
        const timer = window.setInterval(() => setActiveSlide(current => (current + 1) % banners.length), 6000);
        return () => window.clearInterval(timer);
    }, [banners.length]);
    return <SiteLayout>
        <Head title="Eplus | Tecnologia e assistência técnica"><meta name="description" content="Consertos de celulares e assistência técnica em Teutônia." /></Head>
        {banner ? <section className="relative aspect-[1300/450] overflow-hidden bg-[#090909]">
            {banner.link ? <a href={banner.link} aria-label={banner.title || `Abrir slide ${activeSlide + 1}`} className="block h-full w-full"><img src={`/storage/${banner.image}`} className="h-full w-full object-cover" alt={banner.title || `Slide ${activeSlide + 1}`} /></a> : <img src={`/storage/${banner.image}`} className="h-full w-full object-cover" alt={banner.title || `Slide ${activeSlide + 1}`} />}
            {banners.length > 1 && <div className="absolute right-0 bottom-4 left-0 z-10 flex justify-center gap-2">{banners.map((slide,index)=><button key={`${slide.image}-${index}`} onClick={()=>setActiveSlide(index)} aria-label={`Exibir slide ${index+1}`} className={`h-1.5 shadow transition-all ${index===activeSlide?'w-10 bg-[#d60057]':'w-5 bg-white/70 hover:bg-white'}`}/>)}</div>}
        </section> : <section className="relative min-h-[560px] overflow-hidden bg-[#090909] text-white lg:aspect-[1300/450] lg:min-h-0">
            <img src="/images/exemplo.jpg" className="absolute inset-0 h-full w-full object-cover object-center opacity-55 md:object-right" alt="Técnico realizando conserto em smartphone" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/10" />
            <div className="relative mx-auto flex h-full min-h-[560px] max-w-7xl items-center px-5 py-16 lg:min-h-0">
                <div className="max-w-3xl">
                    <div className="mb-7 inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-2 text-xs font-bold tracking-[.18em] uppercase"><span className="h-2 w-2 animate-pulse rounded-full bg-[#d60057]"/> Assistência especializada em Teutônia</div>
                    <h1 className="text-5xl leading-[.94] font-black tracking-[-.065em] sm:text-7xl lg:text-[92px]">SEU CELULAR<br/><span className="text-[#d60057]">NOVO DE NOVO.</span></h1>
                    <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/65">Consertos rápidos, orçamento transparente e o cuidado que seu aparelho merece.</p>
                    <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/contato" className="inline-flex items-center justify-center gap-3 bg-[#d60057] px-7 py-4 font-bold hover:bg-[#b8004b]">Pedir orçamento <ArrowRight size={18}/></Link><Link href="/servicos" className="inline-flex items-center justify-center border border-white/30 px-7 py-4 font-bold hover:bg-white hover:text-black">Conhecer serviços</Link></div>
                </div>
            </div>
        </section>}
        <section className="border-b border-black/10 bg-white"><div className="mx-auto grid max-w-7xl divide-y divide-black/10 px-5 md:grid-cols-3 md:divide-x md:divide-y-0">{([[Clock3,'Agilidade','Consertos no mesmo dia*'],[ShieldCheck,'Garantia','Segurança em cada reparo'],[Check,'Transparência','Você aprova antes do serviço']] as const).map(([Icon,t,d]) => <div key={t} className="flex items-center gap-4 py-7 md:px-8 first:pl-0"><Icon className="text-[#d60057]"/><div><b>{t}</b><p className="text-sm text-black/50">{d}</p></div></div>)}</div></section>
        <section className="mx-auto max-w-7xl px-5 py-24"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-3 text-xs font-black tracking-[.2em] text-[#d60057] uppercase">O que fazemos</p><h2 className="max-w-2xl text-4xl font-black tracking-[-.05em] sm:text-6xl">SOLUÇÕES PARA SUA VIDA DIGITAL.</h2></div><p className="max-w-md text-black/55">Do diagnóstico ao reparo, explicamos tudo sem termos complicados e entregamos uma solução que faz sentido.</p></div><div className="mt-14 grid gap-5 md:grid-cols-3">{services.map(({icon:Icon,title,text},i) => <article key={title} className="group border border-black/10 bg-white p-8 transition hover:-translate-y-1 hover:border-[#d60057]"><div className="flex items-start justify-between"><span className="grid h-14 w-14 place-items-center bg-black text-white group-hover:bg-[#d60057]"><Icon/></span><span className="text-5xl font-black text-black/5">0{i+1}</span></div><h3 className="mt-10 text-2xl font-black">{title}</h3><p className="mt-3 text-black/55">{text}</p><Link href="/servicos" className="mt-8 inline-flex items-center gap-2 text-sm font-bold">Saiba mais <ArrowRight size={16}/></Link></article>)}</div></section>
        {brands.length > 0 && <section className="border-y border-black/10 bg-white"><div className="mx-auto max-w-7xl px-5 py-14"><p className="text-center text-xs font-black tracking-[.2em] text-black/35 uppercase">Marcas que você encontra na Eplus</p><div className="mt-9 grid grid-cols-2 items-center gap-px overflow-hidden bg-black/10 sm:grid-cols-3 lg:grid-cols-5">{brands.map(brand=><div key={brand.id} className="grid h-32 place-items-center bg-white p-6" title={brand.brand}><img src={`/storage/${brand.thumbnail}`} alt={brand.brand} className="max-h-16 max-w-full object-contain grayscale transition hover:grayscale-0"/></div>)}</div></div></section>}
        {homeSections.map((section,index) => <section key={section.id} className={index % 2 === 0 ? 'border-y border-black/10 bg-white' : 'bg-[#f4f4f2]'}><div className="mx-auto max-w-7xl px-5 py-20"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-black tracking-[.2em] text-[#d60057] uppercase">Seleção Eplus</p><h2 className="mt-3 text-4xl font-black tracking-[-.04em]">{section.name}</h2></div>{section.description&&<p className="max-w-md text-black/55">{section.description}</p>}</div>{section.items.length>0?<div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{section.items.map(item=><Link key={item.id} href={section.type==='service'?`/servicos/${item.id}`:`/produtos/detalhes/${item.slug}`} className="group overflow-hidden border border-black/10 bg-white"><div className="aspect-[4/3] overflow-hidden bg-black/5">{item.featured?<img src={`/storage/${item.featured}`} alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105"/>:<div className="grid h-full place-items-center text-5xl font-black text-black/10">{item.title.charAt(0)}</div>}</div><div className="p-5"><h3 className="text-lg font-black">{item.title}</h3><p className="mt-2 line-clamp-2 text-sm text-black/50">{item.summary}</p>{section.type==='product'&&(item.valpromo||item.valnormal)&&<p className="mt-4 font-black text-[#d60057]">R$ {item.valpromo||item.valnormal}</p>}</div></Link>)}</div>:<div className="mt-10 border border-dashed border-black/15 p-10 text-center text-sm text-black/40">Nenhum item ativo nesta categoria.</div>}</div></section>)}
        <section className="bg-[#d60057] text-white"><div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2"><div><Zap size={45} fill="currentColor"/><h2 className="mt-6 text-4xl font-black tracking-[-.05em] sm:text-6xl">DEU PROBLEMA?<br/>A EPLUS RESOLVE.</h2></div><div><p className="max-w-lg text-lg text-white/80">Conte para a gente o que aconteceu. Nossa equipe avalia seu aparelho e apresenta as melhores alternativas.</p><Link href="/contato" className="mt-7 inline-flex items-center gap-3 bg-black px-7 py-4 font-bold">Solicitar atendimento <ArrowRight size={18}/></Link></div></div></section>
    </SiteLayout>;
}

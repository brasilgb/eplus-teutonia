import SiteLayout from '@/components/site-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Wrench } from 'lucide-react';

type Category = { id: number; name: string; description: string | null };
type Service = { id: number; title: string; slug: string; summary: string | null; content: string | null; featured: string | null };
type Props = { heroImage?: string | null; categories: Category[]; selectedCategory: Category | null; services: Service[] };

export default function Services({ heroImage, categories, selectedCategory, services }: Props) {
    return <SiteLayout>
        <Head title="Serviços | Eplus"/>
        <Hero eyebrow="Assistência técnica" title="SERVIÇOS ESPECIALIZADOS." text="Seu aparelho nas mãos de quem entende e explica cada etapa." image={heroImage}/>
        <div className="border-b border-black/10 bg-[#111] px-5 py-4"><div className="mx-auto max-w-7xl"><label className="block w-full md:w-72"><span className="sr-only">Selecionar categoria de serviço</span><select value={String(selectedCategory?.id ?? '')} onChange={event=>event.target.value&&router.get(`/servicos/${event.target.value}`)} className="h-11 w-full cursor-pointer border border-white/15 bg-white/10 px-4 text-sm font-bold text-white outline-none transition focus:border-[#d60057]"><option value="" className="text-black">Selecione uma categoria</option>{categories.map(category=><option key={category.id} value={category.id} className="text-black">{category.name}</option>)}</select></label></div></div>
        <section className="mx-auto max-w-7xl px-5 py-16"><div className="mb-10"><p className="text-xs font-black tracking-[.2em] text-[#d60057] uppercase">Categoria</p><h1 className="mt-2 text-4xl font-black tracking-[-.04em]">{selectedCategory?.name||'Serviços'}</h1>{selectedCategory?.description&&<p className="mt-3 max-w-2xl text-black/50">{selectedCategory.description}</p>}</div>{services.length>0?<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{services.map(service=><article key={service.id} className="overflow-hidden border border-black/10 bg-white"><div className="aspect-[4/3] overflow-hidden bg-black/5">{service.featured?<img src={`/storage/${service.featured}`} alt={service.title} className="h-full w-full object-cover"/>:<div className="grid h-full place-items-center"><Wrench size={48} className="text-black/15"/></div>}</div><div className="p-6"><h2 className="text-2xl font-black">{service.title}</h2><p className="mt-3 text-black/50">{service.summary}</p><Link href="/contato" className="mt-6 inline-flex items-center gap-2 bg-[#d60057] px-5 py-3 text-sm font-bold text-white">Solicitar orçamento <ArrowRight size={16}/></Link></div></article>)}</div>:<div className="border border-dashed border-black/20 bg-white py-16 text-center text-black/45">Nenhum serviço cadastrado nesta categoria.</div>}</section>
    </SiteLayout>;
}

export function Hero({ eyebrow, title, text, image }: { eyebrow: string; title: string; text: string; image?: string | null }) {
    if (image) {
        return <section className="aspect-[1900/250] overflow-hidden bg-[#111]"><img src={`/storage/${image}`} alt="" className="h-full w-full object-cover object-center"/></section>;
    }

    return <section className="flex min-h-[280px] items-center bg-[#111] text-white"><div className="mx-auto w-full max-w-7xl px-5 py-10"><p className="text-xs font-black tracking-[.2em] text-[#d60057] uppercase">{eyebrow}</p><h1 className="mt-3 max-w-4xl text-4xl leading-[.95] font-black tracking-[-.055em] sm:text-5xl">{title}</h1><p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">{text}</p></div></section>;
}

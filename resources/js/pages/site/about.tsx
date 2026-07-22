import SiteLayout from '@/components/site-layout';
import { Hero } from './services';
import { Head } from '@inertiajs/react';
import { HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';

type AboutContent = { title: string; summary: string | null; content: string | null; featured: string | null };

export default function About({ content }: { content: AboutContent | null }) {
    const values = [[ShieldCheck, 'Confiança', 'Clareza do diagnóstico à entrega.'], [Sparkles, 'Qualidade', 'Cuidado em cada detalhe do serviço.'], [HeartHandshake, 'Proximidade', 'Atendimento humano e sem complicação.']] as const;
    return <SiteLayout>
        <Head title="Sobre | Eplus"/>
        <Hero eyebrow="Nossa história" title={content?.title || 'TECNOLOGIA COM PROXIMIDADE.'} text={content?.summary || 'A Eplus nasceu para tornar a assistência técnica mais simples, clara e confiável.'} image={content?.featured}/>
        <section className="mx-auto grid max-w-7xl gap-14 px-5 py-24 lg:grid-cols-2"><div><p className="text-xs font-black tracking-[.2em] text-[#d60057] uppercase">Quem somos</p><h2 className="mt-5 text-4xl font-black tracking-[-.04em] sm:text-5xl">Cuidamos do aparelho. Respeitamos a sua confiança.</h2></div>{content?.content ? <div className="space-y-5 text-lg leading-relaxed text-black/60" dangerouslySetInnerHTML={{ __html: content.content }}/> : <div className="space-y-5 text-lg leading-relaxed text-black/60"><p>Sabemos quanto um celular é importante para trabalhar, conversar e guardar memórias. Por isso, cada atendimento começa ouvindo você.</p><p>Unimos conhecimento técnico, processos transparentes e atendimento próximo para entregar soluções duradouras.</p></div>}</section>
        <section className="bg-white"><div className="mx-auto grid max-w-7xl gap-px bg-black/10 md:grid-cols-3">{values.map(([Icon,title,description]) => <div key={title} className="bg-white p-10"><Icon className="text-[#d60057]"/><h3 className="mt-7 text-2xl font-black">{title}</h3><p className="mt-2 text-black/50">{description}</p></div>)}</div></section>
    </SiteLayout>;
}

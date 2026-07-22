import SiteLayout from '@/components/site-layout';
import { Hero } from './services';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ExternalLink, MessageCircle } from 'lucide-react';

type Product = { title: string; slug: string; brand: string | null; summary: string | null; content: string | null; featured: string | null; url: string | null; valnormal: string | null; valpromo: string | null };
const money = (value: string) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));

export default function ProductDetail({ product, heroImage, whatsapp }: { product: Product; heroImage?: string | null; whatsapp?: string | null }) {
    const message = encodeURIComponent(`Gostaria de mais informações sobre ${product.title}`);
    return <SiteLayout>
        <Head title={`${product.title} | Eplus`}><meta name="description" content={product.summary || product.title}/></Head>
        <Hero eyebrow={product.brand || 'Produto Eplus'} title={product.title} text={product.summary || 'Consulte disponibilidade e condições em nossa loja.'} image={heroImage}/>
        <section className="mx-auto max-w-7xl px-5 py-16"><Link href="/produtos" className="inline-flex items-center gap-2 text-sm font-bold text-black/50 hover:text-black"><ArrowLeft size={17}/> Voltar aos produtos</Link><div className="mt-8 grid gap-12 lg:grid-cols-2"><div>{product.featured&&<img src={`/storage/${product.featured}`} alt={product.title} className="w-full border border-black/10 bg-white object-contain p-6"/>}<div className="mt-6 flex flex-wrap items-center gap-4">{Number(product.valpromo)>0&&<><del className="text-black/40">{money(product.valnormal||'0')}</del><strong className="text-3xl text-[#d60057]">{money(product.valpromo!)}</strong></>}{Number(product.valpromo)<=0&&Number(product.valnormal)>0&&<strong className="text-3xl text-[#d60057]">{money(product.valnormal!)}</strong>}</div><div className="mt-6 flex flex-col gap-3 sm:flex-row">{whatsapp&&<a href={`https://wa.me/${whatsapp.replace(/\D/g,'')}?text=${message}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25d366] px-6 py-4 font-bold text-white"><MessageCircle size={19}/> Consultar pelo WhatsApp</a>}{product.url&&<a href={product.url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 border border-black px-6 py-4 font-bold">Mais informações <ExternalLink size={18}/></a>}</div></div><div className="prose prose-neutral max-w-none text-black/65" dangerouslySetInnerHTML={{__html:product.content||product.summary||''}}/></div></section>
    </SiteLayout>;
}

import SiteLayout from '@/components/site-layout';
import { Hero } from './services';
import { Head, Link, router } from '@inertiajs/react';
import { Search, ShoppingBag } from 'lucide-react';
import { FormEvent, useState } from 'react';

type Category = { id: number; name: string; description: string | null };
type Product = { id: number; title: string; slug: string; brand: string | null; summary: string | null; featured: string | null; valnormal: string | null; valpromo: string | null };
type Props = { heroImage?: string | null; categories: Category[]; selectedCategory: Category | null; products: Product[]; filters: { search: string } };

const money = (value: string) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));

export default function Products({ heroImage, categories, selectedCategory, products, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const submit = (event: FormEvent) => { event.preventDefault(); router.get('/produtos', { busca: search }, { preserveState: true }); };

    return <SiteLayout>
        <Head title="Produtos | Eplus"/>
        <Hero eyebrow="Loja Eplus" title="PRODUTOS E ACESSÓRIOS." text="Encontre no catálogo da Eplus a opção certa para sua rotina." image={heroImage}/>
        <div className="border-b border-black/10 bg-[#111] px-5 py-4"><div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between"><label className="w-full md:w-72"><span className="sr-only">Selecionar categoria</span><select value={filters.search ? '' : String(selectedCategory?.id ?? '')} onChange={event=>event.target.value&&router.get('/produtos',{categoria:event.target.value})} className="h-11 w-full cursor-pointer border border-white/15 bg-white/10 px-4 text-sm font-bold text-white outline-none transition focus:border-[#d60057]"><option value="" className="text-black">Selecione uma categoria</option>{categories.map(category=><option key={category.id} value={category.id} className="text-black">{category.name}</option>)}</select></label><form onSubmit={submit} className="flex w-full bg-white md:w-auto md:min-w-80"><input value={search} onChange={event=>setSearch(event.target.value)} className="min-w-0 flex-1 px-4 outline-none" placeholder="Buscar produto..."/><button type="submit" className="inline-flex items-center justify-center gap-2 bg-[#d60057] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b8004b]"><Search size={17}/> Buscar</button></form></div></div>
        <section className="mx-auto max-w-7xl px-5 py-16"><div className="mb-10"><p className="text-xs font-black tracking-[.2em] text-[#d60057] uppercase">{filters.search?'Resultado da busca':'Categoria'}</p><h1 className="mt-2 text-4xl font-black tracking-[-.04em]">{filters.search?`Busca por “${filters.search}”`:selectedCategory?.name||'Produtos'}</h1>{!filters.search&&selectedCategory?.description&&<p className="mt-3 max-w-2xl text-black/50">{selectedCategory.description}</p>}</div>
            {products.length>0?<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map(product=><article key={product.id} className="group overflow-hidden border border-black/10 bg-white"><Link href={`/produtos/detalhes/${product.slug}`} className="block aspect-[4/3] overflow-hidden bg-black/5">{product.featured?<img src={`/storage/${product.featured}`} alt={product.title} className="h-full w-full object-contain p-4 transition group-hover:scale-105"/>:<div className="grid h-full place-items-center"><ShoppingBag size={48} className="text-black/15"/></div>}</Link><div className="p-5"><p className="text-xs font-bold text-black/35 uppercase">{product.brand||'Eplus'}</p><Link href={`/produtos/detalhes/${product.slug}`} className="mt-2 block text-lg font-black hover:text-[#d60057]">{product.title}</Link><p className="mt-2 line-clamp-2 text-sm text-black/50">{product.summary}</p><div className="mt-5 flex items-end gap-2">{Number(product.valpromo)>0&&<><del className="text-xs text-black/35">{money(product.valnormal||'0')}</del><strong className="text-lg text-[#d60057]">{money(product.valpromo!)}</strong></>}{Number(product.valpromo)<=0&&Number(product.valnormal)>0&&<strong className="text-lg text-[#d60057]">{money(product.valnormal!)}</strong>}</div></div></article>)}</div>:<div className="border border-dashed border-black/20 bg-white py-16 text-center text-black/45">Nenhum produto encontrado.</div>}
        </section>
    </SiteLayout>;
}

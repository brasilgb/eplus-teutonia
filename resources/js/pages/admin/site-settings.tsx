import PanelLayout from '@/components/panel-layout';
import InputError from '@/components/input-error';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { toast } from 'sonner';

type Settings = Record<string, string | number | null>;
type Field = { name: string; label: string; type?: 'email' | 'url' | 'textarea' | 'file' };
type Section = { title: string; description: string; fields: Field[] };

const sections: Section[] = [
    { title: 'Dados da empresa', description: 'Identidade e informações gerais exibidas no site.', fields: [{ name: 'logo', label: 'Logotipo', type: 'file' }, { name: 'title', label: 'Nome do site' }, { name: 'description', label: 'Descrição', type: 'textarea' }, { name: 'url', label: 'URL do site', type: 'url' }, { name: 'opening', label: 'Horário de funcionamento', type: 'textarea' }] },
    { title: 'Localização', description: 'Endereço físico e integração com o mapa.', fields: [{ name: 'state', label: 'Estado' }, { name: 'city', label: 'Cidade' }, { name: 'neighborhood', label: 'Bairro' }, { name: 'street', label: 'Logradouro' }, { name: 'number', label: 'Número' }, { name: 'complement', label: 'Complemento' }, { name: 'maps', label: 'Google Maps', type: 'textarea' }] },
    { title: 'Contatos e redes sociais', description: 'Canais usados pelos visitantes para falar com a Eplus.', fields: [{ name: 'telephone', label: 'Telefone fixo' }, { name: 'celular', label: 'Celular' }, { name: 'email', label: 'E-mail', type: 'email' }, { name: 'whatsapp', label: 'WhatsApp' }, { name: 'instagram', label: 'Instagram' }, { name: 'facebook', label: 'Facebook' }, { name: 'redex', label: 'X / Twitter' }, { name: 'youtube', label: 'YouTube' }] },
    { title: 'SEO', description: 'Informações usadas por buscadores e compartilhamentos.', fields: [{ name: 'metatitle', label: 'Meta título', type: 'textarea' }, { name: 'metakeyword', label: 'Palavras-chave', type: 'textarea' }, { name: 'metadescription', label: 'Meta descrição', type: 'textarea' }] },
];

export default function SiteSettings({ settings }: { settings: Settings | null }) {
    const names = sections.flatMap(section => section.fields.map(field => field.name));
    const { data, setData, post, processing, errors } = useForm<Record<string, string | File | null>>(Object.fromEntries(names.map(name => [name, name === 'logo' ? null : String(settings?.[name] ?? '')])));
    const flash = usePage().props.flash as { success?: string } | undefined;
    useEffect(() => { if (flash?.success) toast.success(flash.success); }, [flash?.success]);
    const submit = (event: FormEvent) => { event.preventDefault(); post('/admin/configuracoes', { preserveScroll: true, forceFormData: true }); };

    return <PanelLayout area="admin" title="Configurações do site" description="Gerencie os dados institucionais e canais de contato.">
        <Head title="Configurações do site"/>
        <form onSubmit={submit} className="space-y-5">{sections.map(section => <section key={section.title} className="border border-black/10 bg-white"><div className="border-b border-black/10 p-6"><h2 className="text-xl font-black">{section.title}</h2><p className="mt-1 text-sm text-black/45">{section.description}</p></div><div className="grid gap-5 p-6 sm:grid-cols-2">{section.fields.map(field => <label key={field.name} className={field.type === 'textarea' || field.type === 'file' ? 'sm:col-span-2' : ''}><span className="mb-2 block text-sm font-bold">{field.label}</span>{field.type === 'textarea' ? <textarea value={String(data[field.name] ?? '')} onChange={event => setData(field.name, event.target.value)} className="min-h-28 w-full border border-black/15 bg-[#f4f4f2] p-4 outline-none focus:border-[#d60057]"/> : field.type === 'file' ? <div><input type="file" accept="image/*" onChange={event => setData(field.name, event.target.files?.[0] ?? null)} className="w-full border border-dashed border-black/20 bg-[#f4f4f2] p-5 text-sm file:mr-4 file:border-0 file:bg-black file:px-4 file:py-2 file:font-bold file:text-white"/>{settings?.logo && <p className="mt-2 text-xs text-black/40">Arquivo atual: {settings.logo}</p>}</div> : <input type={field.type ?? 'text'} value={String(data[field.name] ?? '')} onChange={event => setData(field.name, event.target.value)} className="h-12 w-full border border-black/15 bg-[#f4f4f2] px-4 outline-none focus:border-[#d60057]"/>}<InputError message={errors[field.name]}/></label>)}</div></section>)}<div className="sticky bottom-4 flex justify-end"><button disabled={processing} className="flex items-center gap-2 bg-[#d60057] px-7 py-4 font-bold text-white shadow-xl hover:bg-[#b8004b] disabled:opacity-50"><Save size={18}/>{processing ? 'Salvando...' : 'Salvar configurações'}</button></div></form>
    </PanelLayout>;
}

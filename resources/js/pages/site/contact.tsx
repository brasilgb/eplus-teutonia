import InputError from '@/components/input-error';
import SiteLayout from '@/components/site-layout';
import { Hero } from './services';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { toast } from 'sonner';

type ContactContent = { title: string; content: string | null; featured: string | null };
type Settings = { email: string | null; whatsapp: string | null; telephone: string | null; celular: string | null; opening: string | null; state: string | null; city: string | null; neighborhood: string | null; street: string | null; number: string | null; complement: string | null; maps: string | null };

export default function Contact({ content, settings }: { content: ContactContent | null; settings: Settings | null }) {
    const text = content?.content?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() || 'Utilize uma das formas de contato abaixo.';
    const whatsapp = settings?.whatsapp?.replace(/\D/g, '');
    const whatsappMessage = encodeURIComponent('Olá! Gostaria de entrar em contato com a Eplus.');
    const address = [settings?.street, settings?.number, settings?.neighborhood, settings?.city, settings?.state].filter(Boolean).join(', ');
    const { data, setData, post, processing, errors, reset } = useForm({ name: '', email: '', message: '' });
    const flash = usePage().props.flash as { success?: string; error?: string } | undefined;
    useEffect(() => { if (flash?.success) { toast.success(flash.success); reset(); } if (flash?.error) toast.error(flash.error); }, [flash?.success, flash?.error]);
    const submit = (event: FormEvent) => { event.preventDefault(); post('/contato', { preserveScroll: true }); };

    return <SiteLayout>
        <Head title="Contato | Eplus"/>
        <Hero eyebrow="Fale com a Eplus" title={content?.title || 'FALE CONOSCO'} text={text} image={content?.featured}/>
        <section className="mx-auto max-w-7xl px-5 py-16">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><ContactCard icon={Mail} title="E-mail" value={settings?.email || 'contato@eplusteutonia.com.br'} href={settings?.email?`mailto:${settings.email}`:undefined}/><ContactCard icon={MessageCircle} title="WhatsApp" value={settings?.celular || 'Iniciar conversa'} href={whatsapp?`https://wa.me/${whatsapp}?text=${whatsappMessage}`:undefined}/><ContactCard icon={Phone} title="Telefone" value={[settings?.celular,settings?.telephone].filter(phone=>phone&&phone!=='(00) 0000-0000').join(' / ')||'Consulte nossos canais'}/><ContactCard icon={MapPin} title="Nossa loja" value={address||'Teutônia, RS'}/></div>
            <div className="mt-12 grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><div className="border border-black/10 bg-white p-7"><Clock3 className="text-[#d60057]"/><h2 className="mt-5 text-2xl font-black">Horário de atendimento</h2><div className="mt-4 whitespace-pre-line text-black/55">{settings?.opening?.replace(/;/g,'\n')||'Consulte nossos horários de atendimento.'}</div><h3 className="mt-8 font-black">Endereço</h3><p className="mt-2 text-black/55">{address}</p>{settings?.complement&&settings.complement!=='N/A'&&<p className="text-sm text-black/40">{settings.complement}</p>}</div>
                <form className="bg-white p-7" onSubmit={submit}><h2 className="text-2xl font-black">Envie uma mensagem</h2><div className="mt-6 grid gap-4"><Field label="Nome" value={data.name} onChange={value=>setData('name',value)} error={errors.name}/><Field label="E-mail" type="email" value={data.email} onChange={value=>setData('email',value)} error={errors.email}/><label><span className="mb-2 block text-sm font-bold">Mensagem</span><textarea value={data.message} onChange={event=>setData('message',event.target.value)} className="min-h-36 w-full border border-black/15 bg-[#f6f6f3] p-4 outline-none focus:border-[#d60057]"/><InputError message={errors.message}/></label></div><button disabled={processing} className="mt-4 w-full bg-[#d60057] px-6 py-4 font-bold text-white disabled:opacity-50">{processing?'Enviando...':'Enviar mensagem'}</button></form>
            </div>
            {settings?.maps&&<div className="mt-10 overflow-hidden border border-black/10 [&_iframe]:h-[400px] [&_iframe]:w-full" dangerouslySetInnerHTML={{__html:settings.maps}}/>}
        </section>
    </SiteLayout>;
}

function ContactCard({icon:Icon,title,value,href}:{icon:typeof Mail;title:string;value:string;href?:string}){const body=<><Icon className="text-[#d60057]"/><h2 className="mt-5 font-black">{title}</h2><p className="mt-2 text-sm text-black/50">{value}</p></>;return href?<a href={href} target={href.startsWith('http')?'_blank':undefined} rel="noreferrer" className="border border-black/10 bg-white p-6 hover:border-[#d60057]">{body}</a>:<div className="border border-black/10 bg-white p-6">{body}</div>}
function Field({label,type='text',value,onChange,error}:{label:string;type?:string;value:string;onChange:(value:string)=>void;error?:string}){return <label><span className="mb-2 block text-sm font-bold">{label}</span><input type={type} value={value} onChange={event=>onChange(event.target.value)} className="w-full border border-black/15 bg-[#f6f6f3] p-4 outline-none focus:border-[#d60057]"/><InputError message={error}/></label>}

import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import PanelLayout from '@/components/panel-layout';
import type { Auth } from '@/types';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Mail, Save, UserRound } from 'lucide-react';
import { send } from '@/routes/verification';

type PageProps = {
    auth: Auth;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<PageProps>().props;

    return <PanelLayout area="client" title="Meus dados" description="Mantenha suas informações de acesso sempre atualizadas.">
        <Head title="Meus dados"/>
        <section className="overflow-hidden border border-black/10 bg-white">
            <div className="flex items-center gap-4 border-b border-black/10 p-6 lg:p-8">
                <span className="grid h-12 w-12 shrink-0 place-items-center bg-[#b3264f] text-white"><UserRound size={22}/></span>
                <div><h2 className="text-xl font-black">Informações pessoais</h2><p className="mt-1 text-sm text-black/45">Altere seu nome ou endereço de e-mail.</p></div>
            </div>
            <Form {...ProfileController.update.form()} options={{ preserveScroll: true }} className="p-6 lg:p-8">
                {({ processing, errors }) => <div className="grid gap-6 sm:grid-cols-2">
                    <label><span className="mb-2 block text-sm font-bold">Nome completo</span><div className="flex h-12 items-center border border-black/15 bg-[#f4f4f2] px-4 focus-within:border-[#d60057]"><UserRound size={18} className="mr-3 shrink-0 text-black/30"/><input name="name" defaultValue={auth.user.name} required autoComplete="name" className="min-w-0 flex-1 bg-transparent outline-none" placeholder="Seu nome completo"/></div><InputError className="mt-2" message={errors.name}/></label>
                    <label><span className="mb-2 block text-sm font-bold">E-mail</span><div className="flex h-12 items-center border border-black/15 bg-[#f4f4f2] px-4 focus-within:border-[#d60057]"><Mail size={18} className="mr-3 shrink-0 text-black/30"/><input name="email" type="email" defaultValue={auth.user.email} required autoComplete="username" className="min-w-0 flex-1 bg-transparent outline-none" placeholder="seu@email.com"/></div><InputError className="mt-2" message={errors.email}/></label>
                    {mustVerifyEmail && auth.user.email_verified_at === null && <div className="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 sm:col-span-2">Seu endereço de e-mail ainda não foi verificado. <Link href={send()} as="button" className="font-bold underline">Reenviar e-mail de verificação</Link>{status === 'verification-link-sent' && <p className="mt-2 font-bold text-green-700">Um novo link de verificação foi enviado.</p>}</div>}
                    <div className="flex justify-end border-t border-black/10 pt-6 sm:col-span-2"><button type="submit" disabled={processing} className="inline-flex items-center gap-2 bg-[#b3264f] px-7 py-4 font-bold text-white transition hover:bg-[#d60057] disabled:opacity-50"><Save size={18}/>{processing ? 'Salvando...' : 'Salvar alterações'}</button></div>
                </div>}
            </Form>
        </section>
    </PanelLayout>;
}

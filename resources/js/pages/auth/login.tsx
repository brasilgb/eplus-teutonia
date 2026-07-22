import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowRight, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return <>
        <Head title="Entrar | Eplus Teutônia"/>
        {status && <div className="mb-5 border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">{status}</div>}
        <Form {...store.form()} resetOnSuccess={['password']} className="space-y-5">
            {({ processing, errors }) => <>
                <label className="block"><span className="mb-2 block text-sm font-bold">E-mail</span><div className="flex h-13 items-center border border-black/15 bg-[#f4f4f2] px-4 transition focus-within:border-[#b3264f]"><Mail size={18} className="mr-3 shrink-0 text-black/30"/><input id="email" type="email" name="email" required autoFocus tabIndex={1} autoComplete="email" placeholder="seu@email.com" className="min-w-0 flex-1 bg-transparent outline-none"/></div><InputError className="mt-2" message={errors.email}/></label>
                <label className="block"><span className="mb-2 flex items-center justify-between gap-3 text-sm font-bold"><span>Senha</span>{canResetPassword&&<Link href={request()} tabIndex={5} className="font-medium text-[#b3264f] hover:underline">Esqueci minha senha</Link>}</span><div className="relative"><LockKeyhole size={18} className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 text-black/30"/><PasswordInput id="password" name="password" required tabIndex={2} autoComplete="current-password" placeholder="Digite sua senha" className="h-13 rounded-none border-black/15 bg-[#f4f4f2] pr-11 pl-11 shadow-none focus-visible:border-[#b3264f] focus-visible:ring-0"/></div><InputError className="mt-2" message={errors.password}/></label>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-black/60"><Checkbox id="remember" name="remember" tabIndex={3} className="rounded-none data-[state=checked]:border-[#b3264f] data-[state=checked]:bg-[#b3264f]"/><span>Lembrar meu acesso</span></label>
                <button type="submit" tabIndex={4} disabled={processing} data-test="login-button" className="flex w-full items-center justify-center gap-3 bg-[#b3264f] px-6 py-4 font-bold text-white transition hover:bg-[#d60057] disabled:cursor-not-allowed disabled:opacity-60">{processing?<><LoaderCircle size={18} className="animate-spin"/>Entrando...</>:<>Entrar na área restrita <ArrowRight size={18}/></>}</button>
            </>}
        </Form>
    </>;
}

Login.layout = {
    title: 'Bem-vindo de volta',
    description: 'Entre com seu e-mail e senha para acessar sua conta.',
};

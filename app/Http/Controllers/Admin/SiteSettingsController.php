<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingsController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/site-settings', [
            'settings' => DB::table('settings')->first(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'logo' => ['nullable', 'image', 'max:5120'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'url' => ['nullable', 'url'],
            'opening' => ['nullable', 'string'],
            'state' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'neighborhood' => ['nullable', 'string', 'max:255'],
            'street' => ['nullable', 'string', 'max:255'],
            'number' => ['nullable', 'string', 'max:255'],
            'complement' => ['nullable', 'string', 'max:255'],
            'maps' => ['nullable', 'string'],
            'telephone' => ['nullable', 'string', 'max:255'],
            'celular' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'whatsapp' => ['nullable', 'string', 'max:255'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'facebook' => ['nullable', 'string', 'max:255'],
            'redex' => ['nullable', 'string', 'max:255'],
            'youtube' => ['nullable', 'string', 'max:255'],
            'metatitle' => ['nullable', 'string'],
            'metakeyword' => ['nullable', 'string'],
            'metadescription' => ['nullable', 'string'],
        ]);

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('logo', 'public');
        } else {
            unset($data['logo']);
        }

        $settings = DB::table('settings')->first();
        $data['updated_at'] = now();

        if ($settings) {
            DB::table('settings')->where('id', $settings->id)->update($data);
        } else {
            $data['created_at'] = now();
            DB::table('settings')->insert($data);
        }

        return back()->with('success', 'Configurações do site atualizadas.');
    }
}

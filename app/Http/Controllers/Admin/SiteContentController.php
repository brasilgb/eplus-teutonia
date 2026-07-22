<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SiteContentController extends Controller
{
    public function edit(string $page): Response
    {
        $config = $this->config($page);

        return Inertia::render('admin/site-content', [
            'page' => $page,
            'title' => $config['title'],
            'fields' => $config['fields'],
            'content' => DB::table($config['table'])->first(),
            'categories' => $page === 'home'
                ? DB::table('categories')->where('active', true)->orderBy('name')->get(['id', 'name', 'type'])->map(function ($category) {
                    $category->items_count = $category->type === 'service'
                        ? DB::table('category_service')->where('category_id', $category->id)->count()
                        : DB::table('category_product')->where('category_id', $category->id)->count();

                    return $category;
                })
                : [],
        ]);
    }

    public function update(Request $request, string $page): RedirectResponse
    {
        $config = $this->config($page);
        $data = $request->validate($config['rules']);

        if (isset($config['upload'])) {
            $field = $config['upload'];
            if ($request->hasFile($field)) {
                $data[$field] = $request->file($field)->store($page, 'public');
            } else {
                unset($data[$field]);
            }
        }

        $record = DB::table($config['table'])->first();
        $data['updated_at'] = now();

        if ($record) {
            DB::table($config['table'])->where('id', $record->id)->update($data);
        } else {
            $data['created_at'] = now();
            DB::table($config['table'])->insert($data);
        }

        return back()->with('success', "Conteúdo de {$config['title']} atualizado.");
    }

    private function config(string $page): array
    {
        $configs = [
            'home' => [
                'title' => 'Página inicial',
                'table' => 'home',
                'fields' => collect(range(1, 5))->map(fn ($number) => ['name' => "section{$number}", 'label' => "Categoria da seção {$number}", 'type' => 'select'])->all(),
                'rules' => collect(range(1, 5))->mapWithKeys(fn ($number) => ["section{$number}" => ['nullable', 'integer', 'exists:categories,id']])->all(),
            ],
            'sobre' => [
                'title' => 'Página Sobre',
                'table' => 'about',
                'fields' => [['name' => 'title', 'label' => 'Título'], ['name' => 'summary', 'label' => 'Resumo', 'type' => 'textarea'], ['name' => 'content', 'label' => 'Conteúdo', 'type' => 'textarea'], ['name' => 'featured', 'label' => 'Imagem destacada', 'type' => 'file']],
                'rules' => ['title' => ['required', 'string', 'max:255'], 'summary' => ['nullable', 'string'], 'content' => ['required', 'string'], 'featured' => ['nullable', 'image', 'max:8192']],
                'upload' => 'featured',
            ],
            'contato' => [
                'title' => 'Página de Contato',
                'table' => 'contact',
                'fields' => [['name' => 'title', 'label' => 'Título'], ['name' => 'content', 'label' => 'Texto de apresentação', 'type' => 'textarea'], ['name' => 'featured', 'label' => 'Imagem destacada', 'type' => 'file']],
                'rules' => ['title' => ['required', 'string', 'max:255'], 'content' => ['required', 'string'], 'featured' => ['nullable', 'image', 'max:8192']],
                'upload' => 'featured',
            ],
        ];

        abort_unless(isset($configs[$page]), 404);

        return $configs[$page];
    }
}

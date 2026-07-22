<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ResourceController extends Controller
{
    public function index(string $resource): Response
    {
        $config = $this->config($resource);

        return Inertia::render('admin/resource', [
            'resource' => $resource,
            'title' => $config['title'],
            'columns' => $config['columns'],
            'records' => DB::table($config['table'])->latest('updated_at')->limit(100)->get($config['columns']),
        ]);
    }

    public function create(string $resource): Response
    {
        $config = $this->config($resource);

        return Inertia::render('admin/resource-form', [
            'resource' => $resource,
            'title' => $config['title'],
            'fields' => $config['fields'],
            'record' => null,
        ]);
    }

    public function store(Request $request, string $resource): RedirectResponse
    {
        $config = $this->config($resource);
        $data = $request->validate($this->rules($resource));
        $data = $this->prepare($resource, $data);
        $data['created_at'] = now();
        $data['updated_at'] = now();

        DB::table($config['table'])->insert($data);

        return to_route('admin.resource.index', $resource)->with('success', 'Registro criado com sucesso.');
    }

    public function edit(string $resource, int $record): Response
    {
        $config = $this->config($resource);
        $item = DB::table($config['table'])->where('id', $record)->first();
        abort_unless($item, 404);

        return Inertia::render('admin/resource-form', [
            'resource' => $resource,
            'title' => $config['title'],
            'fields' => $config['fields'],
            'record' => $item,
        ]);
    }

    public function update(Request $request, string $resource, int $record): RedirectResponse
    {
        $config = $this->config($resource);
        abort_unless(DB::table($config['table'])->where('id', $record)->exists(), 404);
        $data = $request->validate($this->rules($resource, $record));
        $data = $this->prepare($resource, $data, true, $record);
        $data['updated_at'] = now();

        DB::table($config['table'])->where('id', $record)->update($data);

        return to_route('admin.resource.index', $resource)->with('success', 'Registro atualizado com sucesso.');
    }

    public function destroy(Request $request, string $resource, int $record): RedirectResponse
    {
        $config = $this->config($resource);
        abort_if($resource === 'usuarios' && $request->user()->id === $record, 422, 'Você não pode excluir seu próprio usuário.');
        DB::table($config['table'])->where('id', $record)->delete();

        return back()->with('success', 'Registro excluído com sucesso.');
    }

    private function config(string $resource): array
    {
        $configs = [
            'ordens' => [
                'title' => 'Ordens de serviço', 'table' => 'orders',
                'columns' => ['id', 'client_id', 'defect', 'status', 'cost', 'updated_at'],
                'fields' => [
                    ['name' => 'id', 'label' => 'Número da OS', 'type' => 'number'], ['name' => 'client_id', 'label' => 'Código do cliente'],
                    ['name' => 'defect', 'label' => 'Defeito informado', 'type' => 'textarea'], ['name' => 'details', 'label' => 'Serviços executados', 'type' => 'textarea'],
                    ['name' => 'descbudget', 'label' => 'Descrição do orçamento', 'type' => 'textarea'], ['name' => 'status', 'label' => 'Status'],
                    ['name' => 'valuebudget', 'label' => 'Valor do orçamento', 'type' => 'number'], ['name' => 'valueservice', 'label' => 'Valor do serviço', 'type' => 'number'],
                    ['name' => 'valueparts', 'label' => 'Valor das peças', 'type' => 'number'], ['name' => 'cost', 'label' => 'Custo total', 'type' => 'number'],
                    ['name' => 'dtentry', 'label' => 'Data de entrada', 'type' => 'datetime-local'], ['name' => 'dtdelivery', 'label' => 'Data de entrega', 'type' => 'datetime-local'],
                ],
            ],
            'produtos' => [
                'title' => 'Produtos', 'table' => 'products', 'columns' => ['id', 'featured', 'title', 'brand', 'valnormal', 'active', 'updated_at'],
                'fields' => [['name' => 'title', 'label' => 'Produto'], ['name' => 'brand', 'label' => 'Fabricante'], ['name' => 'summary', 'label' => 'Breve descrição', 'type' => 'textarea'], ['name' => 'content', 'label' => 'Descrição completa', 'type' => 'textarea'], ['name' => 'featured', 'label' => 'Imagem do produto', 'type' => 'file'], ['name' => 'url', 'label' => 'URL externa'], ['name' => 'valnormal', 'label' => 'Valor normal', 'type' => 'number'], ['name' => 'valpromo', 'label' => 'Valor promocional', 'type' => 'number'], ['name' => 'active', 'label' => 'Produto ativo', 'type' => 'checkbox'], ['name' => 'home', 'label' => 'Exibir na página inicial', 'type' => 'checkbox']],
            ],
            'servicos' => [
                'title' => 'Serviços', 'table' => 'services', 'columns' => ['id', 'featured', 'title', 'summary', 'active', 'updated_at'],
                'fields' => [['name' => 'title', 'label' => 'Serviço'], ['name' => 'summary', 'label' => 'Breve descrição', 'type' => 'textarea'], ['name' => 'content', 'label' => 'Descrição completa', 'type' => 'textarea'], ['name' => 'featured', 'label' => 'Imagem do serviço', 'type' => 'file'], ['name' => 'active', 'label' => 'Serviço ativo', 'type' => 'checkbox']],
            ],
            'categorias' => [
                'title' => 'Categorias', 'table' => 'categories', 'columns' => ['id', 'thumbnail', 'name', 'type', 'active', 'updated_at'],
                'fields' => [['name' => 'name', 'label' => 'Nome'], ['name' => 'type', 'label' => 'Tipo'], ['name' => 'description', 'label' => 'Descrição', 'type' => 'textarea'], ['name' => 'thumbnail', 'label' => 'Imagem da categoria', 'type' => 'file'], ['name' => 'active', 'label' => 'Categoria ativa', 'type' => 'checkbox'], ['name' => 'visiblehome', 'label' => 'Exibir na página inicial', 'type' => 'checkbox']],
            ],
            'marcas' => [
                'title' => 'Marcas', 'table' => 'brands', 'columns' => ['id', 'brand', 'thumbnail', 'updated_at'],
                'fields' => [['name' => 'brand', 'label' => 'Fabricante'], ['name' => 'thumbnail', 'label' => 'Logotipo', 'type' => 'file']],
            ],
            'banners' => [
                'title' => 'Banners da Home', 'table' => 'sliders', 'columns' => ['id', 'title', 'image', 'link', 'active', 'updated_at'],
                'fields' => [['name' => 'title', 'label' => 'Título'], ['name' => 'description', 'label' => 'Descrição', 'type' => 'textarea'], ['name' => 'image', 'label' => 'Imagem do banner', 'type' => 'file'], ['name' => 'link', 'label' => 'Link'], ['name' => 'active', 'label' => 'Banner ativo', 'type' => 'checkbox']],
            ],
            'usuarios' => [
                'title' => 'Usuários', 'table' => 'users', 'columns' => ['id', 'name', 'email', 'client_id', 'is_active', 'updated_at'],
                'fields' => [['name' => 'name', 'label' => 'Nome'], ['name' => 'email', 'label' => 'E-mail', 'type' => 'email'], ['name' => 'client_id', 'label' => 'Código do cliente'], ['name' => 'cpf', 'label' => 'CPF'], ['name' => 'password', 'label' => 'Senha', 'type' => 'password'], ['name' => 'is_admin', 'label' => 'Administrador', 'type' => 'checkbox'], ['name' => 'is_active', 'label' => 'Usuário ativo', 'type' => 'checkbox']],
            ],
        ];

        abort_unless(isset($configs[$resource]), 404);

        return $configs[$resource];
    }

    private function rules(string $resource, ?int $record = null): array
    {
        return match ($resource) {
            'ordens' => ['id' => [$record ? 'sometimes' : 'required', 'integer', Rule::unique('orders', 'id')->ignore($record)], 'client_id' => ['nullable', 'string', 'max:255'], 'defect' => ['nullable', 'string'], 'details' => ['nullable', 'string'], 'descbudget' => ['nullable', 'string'], 'status' => ['nullable', 'string', 'max:255'], 'valuebudget' => ['nullable', 'numeric'], 'valueservice' => ['nullable', 'numeric'], 'valueparts' => ['nullable', 'numeric'], 'cost' => ['nullable', 'numeric'], 'dtentry' => ['nullable', 'date'], 'dtdelivery' => ['nullable', 'date']],
            'produtos' => ['title' => ['required', 'string', 'max:255'], 'brand' => ['nullable', 'string', 'max:255'], 'summary' => ['nullable', 'string'], 'content' => ['nullable', 'string'], 'featured' => ['nullable', 'image', 'max:5120'], 'url' => ['nullable', 'url', 'max:255'], 'valnormal' => ['nullable', 'numeric', 'min:0'], 'valpromo' => ['nullable', 'numeric', 'min:0'], 'active' => ['boolean'], 'home' => ['boolean']],
            'servicos' => ['title' => ['required', 'string', 'max:255'], 'summary' => ['nullable', 'string'], 'content' => ['nullable', 'string'], 'featured' => [$record ? 'nullable' : 'required', 'image', 'max:5120'], 'active' => ['boolean']],
            'categorias' => ['name' => ['required', 'string', 'max:255'], 'type' => ['nullable', 'string', 'max:10'], 'description' => ['nullable', 'string'], 'thumbnail' => ['nullable', 'image', 'max:5120'], 'active' => ['boolean'], 'visiblehome' => ['boolean']],
            'marcas' => ['brand' => ['required', 'string', 'max:255'], 'thumbnail' => [$record ? 'nullable' : 'required', 'image', 'max:5120']],
            'banners' => ['title' => ['required', 'string', 'max:255'], 'description' => ['nullable', 'string'], 'image' => [$record ? 'nullable' : 'required', 'image', 'max:8192'], 'link' => ['nullable', 'string', 'max:255'], 'active' => ['boolean']],
            'usuarios' => ['name' => ['required', 'string', 'max:255'], 'email' => ['nullable', 'email', Rule::unique('users', 'email')->ignore($record)], 'client_id' => ['required', 'string', 'max:255'], 'cpf' => ['required', 'string', 'max:255', Rule::unique('users', 'cpf')->ignore($record)], 'password' => [$record ? 'nullable' : 'required', 'string', 'min:8'], 'is_admin' => ['boolean'], 'is_active' => ['boolean']],
        };
    }

    private function prepare(string $resource, array $data, bool $updating = false, ?int $record = null): array
    {
        $uploads = [
            'produtos' => ['featured' => 'product'],
            'servicos' => ['featured' => 'service'],
            'categorias' => ['thumbnail' => 'categories'],
            'marcas' => ['thumbnail' => 'brands'],
            'banners' => ['image' => 'slides'],
        ];

        foreach ($uploads[$resource] ?? [] as $field => $directory) {
            if (isset($data[$field])) {
                $data[$field] = $data[$field]->store($directory, 'public');
            } elseif ($updating) {
                unset($data[$field]);
            }
        }

        foreach (['active', 'home', 'visiblehome', 'is_admin', 'is_active'] as $boolean) {
            if (array_key_exists($boolean, $data)) {
                $data[$boolean] = (bool) $data[$boolean];
            }
        }

        if (in_array($resource, ['produtos', 'servicos'], true)) {
            $data['slug'] = $this->uniqueSlug($resource === 'produtos' ? 'products' : 'services', $data['title'], $record);
        } elseif ($resource === 'categorias') {
            $data['slug'] = $this->uniqueSlug('categories', $data['name'], $record);
        }

        if ($resource === 'usuarios') {
            if (empty($data['password']) && $updating) {
                unset($data['password']);
            } else {
                $data['password'] = Hash::make($data['password']);
            }
        }

        if ($resource === 'ordens' && $updating) {
            unset($data['id']);
        }

        return $data;
    }

    private function uniqueSlug(string $table, string $value, ?int $record): string
    {
        $base = Str::slug($value) ?: Str::random(8);
        $slug = $base;
        $suffix = 2;

        while (DB::table($table)->where('slug', $slug)->when($record, fn ($query) => $query->where('id', '!=', $record))->exists()) {
            $slug = $base.'-'.$suffix++;
        }

        return $slug;
    }
}

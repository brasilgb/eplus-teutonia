<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class PublicSiteController extends Controller
{
    public function home(): Response
    {
        $home = DB::table('home')->first();
        $categoryIds = $home ? collect(range(1, 5))->map(fn ($section) => $home->{"section{$section}"})->filter()->values() : collect();
        $sections = DB::table('categories')->whereIn('id', $categoryIds)->get()->sortBy(fn ($category) => $categoryIds->search($category->id))->values()->map(function ($category) {
            if ($category->type === 'service' && is_null($category->category_id)) {
                $category->items = DB::table('categories')
                    ->where('category_id', $category->id)->where('type', 'service')->where('active', true)->where('visiblehome', true)
                    ->orderBy('id')->get(['id', DB::raw('name as title'), 'slug', DB::raw('description as summary'), DB::raw('COALESCE(thumbnail, featured) as featured')]);
            } elseif ($category->type === 'service') {
                $category->items = DB::table('services')->join('category_service', 'services.id', '=', 'category_service.service_id')
                    ->where('category_service.category_id', $category->id)->where('services.active', true)
                    ->get(['services.id', 'services.title', 'services.slug', 'services.summary', 'services.featured']);
            } elseif (is_null($category->category_id)) {
                $category->items = DB::table('products')->where('active', true)->where('home', true)
                    ->get(['id', 'title', 'slug', 'summary', 'featured', 'valnormal', 'valpromo']);
            } else {
                $category->items = DB::table('products')->join('category_product', 'products.id', '=', 'category_product.product_id')
                    ->where('category_product.category_id', $category->id)->where('products.active', true)->where('products.home', true)
                    ->get(['products.id', 'products.title', 'products.slug', 'products.summary', 'products.featured', 'products.valnormal', 'products.valpromo']);
            }

            $category->description = $this->plainText($category->description);
            $category->items->each(function ($item) {
                $item->summary = $this->plainText($item->summary ?? null);
            });

            return $category;
        });

        return Inertia::render('welcome', [
            'banners' => DB::table('sliders')->where('active', true)->orderByDesc('updated_at')->get(),
            'homeSections' => $sections,
            'brands' => DB::table('brands')->whereNotNull('thumbnail')->orderBy('brand')->get(['id', 'brand', 'thumbnail']),
        ]);
    }

    public function about(): Response
    {
        $content = DB::table('about')->first();
        if ($content) {
            $content->summary = $this->plainText($content->summary);
        }

        return Inertia::render('site/about', ['content' => $content]);
    }

    public function contact(): Response
    {
        return Inertia::render('site/contact', [
            'content' => DB::table('contact')->first(),
            'settings' => DB::table('settings')->first(),
        ]);
    }

    public function sendContact(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'message' => ['required', 'string', 'min:3', 'max:1000'],
        ]);

        try {
            Mail::to(DB::table('settings')->value('email') ?: 'contato@eplusteutonia.com.br')->send(new ContactMessage($data));
        } catch (\Throwable $exception) {
            Log::error('Falha ao enviar formulário de contato.', ['exception' => $exception]);

            return back()->with('error', 'Não foi possível enviar a mensagem. Tente novamente mais tarde.');
        }

        return back()->with('success', 'Mensagem enviada com sucesso!');
    }

    public function services(Request $request, ?int $id = null): Response
    {
        $categories = DB::table('categories')->where('type', 'service')->whereNotNull('category_id')->where('active', true)->orderBy('id')->get();
        $categories->each(fn ($category) => $category->description = $this->plainText($category->description));
        $selectedId = $categories->contains('id', $id) ? $id : $categories->first()?->id;
        $services = $selectedId
            ? DB::table('services')->join('category_service', 'services.id', '=', 'category_service.service_id')->where('category_service.category_id', $selectedId)->where('services.active', true)->orderBy('services.title')->get(['services.*'])
            : collect();
        $services->each(fn ($service) => $service->summary = $this->plainText($service->summary));

        return Inertia::render('site/services', [
            'heroImage' => DB::table('categories')->where('type', 'service')->whereNull('category_id')->value('featured'),
            'categories' => $categories,
            'selectedCategory' => $categories->firstWhere('id', $selectedId),
            'services' => $services,
        ]);
    }

    public function products(Request $request): Response
    {
        $categories = DB::table('categories')->where('type', 'product')->whereNotNull('category_id')->where('active', true)->orderBy('name')->get();
        $categories->each(fn ($category) => $category->description = $this->plainText($category->description));
        $requestedCategory = $request->integer('categoria');
        $selectedId = $categories->contains('id', $requestedCategory) ? $requestedCategory : $categories->first()?->id;
        $products = DB::table('products')
            ->when($request->filled('busca'), fn ($query) => $query->where('products.title', 'like', '%'.$request->string('busca').'%'))
            ->when(! $request->filled('busca') && $selectedId, fn ($query) => $query->join('category_product', 'products.id', '=', 'category_product.product_id')->where('category_product.category_id', $selectedId))
            ->where('products.active', true)->orderBy('products.title')->get(['products.*']);
        $products->each(fn ($product) => $product->summary = $this->plainText($product->summary));

        return Inertia::render('site/products', [
            'heroImage' => DB::table('categories')->where('type', 'product')->whereNull('category_id')->value('featured'),
            'categories' => $categories,
            'selectedCategory' => $categories->firstWhere('id', $selectedId),
            'products' => $products,
            'filters' => ['search' => $request->string('busca')->toString()],
        ]);
    }

    public function product(Request $request, string $slug): Response
    {
        $product = DB::table('products')->where('slug', $slug)->where('active', true)->first();
        abort_unless($product, 404);
        $product->summary = $this->plainText($product->summary);

        $shareImage = $product->featured
            ? url('/storage/'.ltrim($product->featured, '/'))
            : null;

        return Inertia::render('site/product-detail', [
            'product' => $product,
            'heroImage' => DB::table('categories')->where('type', 'product')->whereNull('category_id')->value('featured'),
            'whatsapp' => DB::table('settings')->value('whatsapp'),
            'shareImage' => $shareImage,
            'shareUrl' => $request->url(),
        ])->withViewData('socialMeta', [
            'title' => $product->title.' | Eplus',
            'description' => $product->summary ?: $product->title,
            'image' => $shareImage,
            'url' => $request->url(),
        ]);
    }

    private function plainText(?string $value): ?string
    {
        if (blank($value)) {
            return $value;
        }

        return trim(preg_replace('/\s+/u', ' ', html_entity_decode(strip_tags($value), ENT_QUOTES | ENT_HTML5, 'UTF-8')));
    }
}

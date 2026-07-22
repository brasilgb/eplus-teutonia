<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ResourceController as AdminResourceController;
use App\Http\Controllers\Admin\SiteContentController;
use App\Http\Controllers\Admin\SiteSettingsController;
use App\Http\Controllers\Client\DashboardController as ClientDashboardController;
use App\Http\Controllers\PublicSiteController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicSiteController::class, 'home'])->name('home');
Route::get('/servicos/{id?}', [PublicSiteController::class, 'services'])->name('services');
Route::get('/produtos', [PublicSiteController::class, 'products'])->name('products');
Route::get('/produtos/detalhes/{slug}', [PublicSiteController::class, 'product'])->name('products.show');
Route::get('/sobre', [PublicSiteController::class, 'about'])->name('about');
Route::get('/contato', [PublicSiteController::class, 'contact'])->name('contact');
Route::post('/contato', [PublicSiteController::class, 'sendContact'])->middleware('throttle:5,1')->name('contact.send');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', fn () => redirect()->route(
        request()->user()->is_admin ? 'admin.dashboard' : 'client.dashboard'
    ))->name('dashboard');

    Route::get('/painel', ClientDashboardController::class)->name('client.dashboard');

    Route::middleware('admin')->group(function () {
        Route::get('/admin', AdminDashboardController::class)->name('admin.dashboard');
        Route::get('/admin/configuracoes', [SiteSettingsController::class, 'edit'])->name('admin.settings.edit');
        Route::put('/admin/configuracoes', [SiteSettingsController::class, 'update'])->name('admin.settings.update');
        Route::post('/admin/configuracoes', [SiteSettingsController::class, 'update'])->name('admin.settings.update-upload');
        Route::get('/admin/paginas/{page}', [SiteContentController::class, 'edit'])->whereIn('page', ['home', 'sobre', 'contato'])->name('admin.content.edit');
        Route::post('/admin/paginas/{page}', [SiteContentController::class, 'update'])->whereIn('page', ['home', 'sobre', 'contato'])->name('admin.content.update');
        Route::get('/admin/{resource}', [AdminResourceController::class, 'index'])
            ->whereIn('resource', ['ordens', 'produtos', 'servicos', 'categorias', 'marcas', 'banners', 'usuarios'])
            ->name('admin.resource.index');
        Route::get('/admin/{resource}/novo', [AdminResourceController::class, 'create'])->name('admin.resource.create');
        Route::post('/admin/{resource}', [AdminResourceController::class, 'store'])->name('admin.resource.store');
        Route::get('/admin/{resource}/{record}/editar', [AdminResourceController::class, 'edit'])->name('admin.resource.edit');
        Route::put('/admin/{resource}/{record}', [AdminResourceController::class, 'update'])->name('admin.resource.update');
        Route::post('/admin/{resource}/{record}', [AdminResourceController::class, 'update'])->name('admin.resource.update-upload');
        Route::delete('/admin/{resource}/{record}', [AdminResourceController::class, 'destroy'])->name('admin.resource.destroy');
    });
});

require __DIR__.'/settings.php';

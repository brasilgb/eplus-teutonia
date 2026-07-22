<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'users' => DB::table('users')->count(),
                'categories' => DB::table('categories')->count(),
                'services' => DB::table('services')->count(),
                'products' => DB::table('products')->count(),
            ],
        ]);
    }
}

<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $orders = Order::where('client_id', $request->user()->client_id)
            ->latest('updated_at')
            ->get();

        return Inertia::render('client/dashboard', [
            'orders' => $orders,
            'stats' => [
                'pending' => $orders->where('status', '!=', 'Entregue ao Cliente')->count(),
                'completed' => $orders->where('status', 'Entregue ao Cliente')->count(),
                'total' => $orders->count(),
            ],
        ]);
    }
}

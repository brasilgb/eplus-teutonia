<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    protected $guarded = [];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id', 'client_id');
    }

    protected function casts(): array
    {
        return [
            'dtentry' => 'datetime',
            'dtdelivery' => 'datetime',
            'valuebudget' => 'decimal:2',
            'valueservice' => 'decimal:2',
            'valueparts' => 'decimal:2',
            'cost' => 'decimal:2',
        ];
    }
}

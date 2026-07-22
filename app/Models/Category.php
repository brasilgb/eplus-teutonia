<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $guarded = [];

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function subCategories(): HasMany
    {
        return $this->hasMany(Category::class)->with('categories');
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class);
    }
}

<?php

use Illuminate\Support\Facades\DB;

it('renders the product image in the social sharing metadata', function () {
    DB::table('products')->insert([
        'title' => 'Produto de teste',
        'slug' => 'produto-de-teste',
        'summary' => '<p>Descrição do produto</p>',
        'featured' => 'product/produto.jpg',
        'active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->get('/produtos/detalhes/produto-de-teste');

    $response->assertOk()
        ->assertSee('<meta property="og:title" content="Produto de teste | Eplus">', false)
        ->assertSee('<meta property="og:description" content="Descrição do produto">', false)
        ->assertSee('<meta property="og:image" content="http://localhost/storage/product/produto.jpg">', false)
        ->assertSee('<meta property="og:url" content="http://localhost/produtos/detalhes/produto-de-teste?v=', false);
});

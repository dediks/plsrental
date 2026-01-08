<?php

use App\Models\Article;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;

it('displays the homepage with featured products and articles', function () {
    $productCategory = Category::factory()->create(['type' => 'product']);
    $articleCategory = Category::factory()->create(['type' => 'article']);
    $author = User::factory()->create();

    $featuredProduct = Product::factory()->create([
        'category_id' => $productCategory->id,
        'is_featured' => true,
    ]);

    $featuredArticle = Article::factory()->create([
        'category_id' => $articleCategory->id,
        'author_id' => $author->id,
        'is_featured' => true,
        'published_at' => now(),
    ]);

    $response = $this->get('/');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Home/Index')
        ->has('featuredProducts', 1)
        ->has('featuredArticles', 1)
    );
});

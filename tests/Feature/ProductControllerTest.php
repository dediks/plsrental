<?php

use App\Models\Category;
use App\Models\Product;

it('displays the products listing page', function () {
    /** @var Tests\TestCase $this */
    $category = Category::factory()->create(['type' => 'product']);
    Product::factory()->count(5)->create(['category_id' => $category->id]);

    $response = $this->get('/products');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Products/Index')
        ->has('products.data', 5)
        ->has('categories')
    );
});

it('filters products by category', function () {
    /** @var Tests\TestCase $this */
    $category1 = Category::factory()->create(['type' => 'product', 'name' => 'Category 1']);
    $category2 = Category::factory()->create(['type' => 'product', 'name' => 'Category 2']);

    Product::factory()->count(3)->create(['category_id' => $category1->id]);
    Product::factory()->count(2)->create(['category_id' => $category2->id]);

    $response = $this->get('/products?category='.$category1->id);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Products/Index')
        ->has('products.data', 3)
    );
});

it('searches products by name', function () {
    /** @var Tests\TestCase $this */
    $category = Category::factory()->create(['type' => 'product']);
    Product::factory()->create(['name' => 'Special Product', 'category_id' => $category->id]);
    Product::factory()->create(['name' => 'Another Product', 'category_id' => $category->id]);

    $response = $this->get('/products?search=Special');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Products/Index')
        ->has('products.data', 1)
        ->where('products.data.0.name', 'Special Product')
    );
});

it('displays a product detail page', function () {
    /** @var Tests\TestCase $this */
    $category = Category::factory()->create(['type' => 'product']);
    $product = Product::factory()->create([
        'slug' => 'test-product',
        'category_id' => $category->id,
    ]);

    $response = $this->get('/products/'.$product->slug);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Products/Show')
        ->where('product.id', $product->id)
    );
});

it('returns 404 for non-existent product', function () {
    /** @var Tests\TestCase $this */
    $response = $this->get('/products/non-existent-product');

    $response->assertNotFound();
});

it('returns empty key specs when overview specs are not set', function () {
    /** @var Tests\TestCase $this */
    $category = Category::factory()->create(['type' => 'product']);
    $product = Product::factory()->create([
        'slug' => 'test-product',
        'category_id' => $category->id,
        'overview_specs' => null,
    ]);

    $response = $this->get("/products/{$product->slug}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Products/Show')
        ->where('product.id', $product->id)
        ->where('product.key_specs', [])
    );
});

it('includes dimension image in product detail page', function () {
    /** @var Tests\TestCase $this */
    $category = Category::factory()->create(['type' => 'product']);
    $product = Product::factory()->create([
        'slug' => 'test-product',
        'category_id' => $category->id,
        'dimension_image' => 'products/dimensions/test-image.png',
    ]);

    $response = $this->get("/products/{$product->slug}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Products/Show')
        ->where('product.id', $product->id)
        ->where('product.dimension_image', '/storage/products/dimensions/test-image.png')
    );
});

it('returns null dimension image when not set', function () {
    /** @var Tests\TestCase $this */
    $category = Category::factory()->create(['type' => 'product']);
    $product = Product::factory()->create([
        'slug' => 'test-product',
        'category_id' => $category->id,
        'dimension_image' => null,
    ]);

    $response = $this->get("/products/{$product->slug}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Products/Show')
        ->where('product.id', $product->id)
        ->where('product.dimension_image', null)
    );
});

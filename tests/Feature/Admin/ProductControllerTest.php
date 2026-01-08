<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

// Authentication Tests
it('requires authentication to view products index', function () {
    /** @var Tests\TestCase $this */
    /** @var Tests\TestCase $this */
    $response = $this->get(route('admin.products.index'));

    $response->assertRedirect(route('login'));
});

it('requires authentication to view create form', function () {
    /** @var Tests\TestCase $this */
    /** @var Tests\TestCase $this */
    $response = $this->get(route('admin.products.create'));

    $response->assertRedirect(route('login'));
});

it('requires authentication to store a product', function () {
    /** @var Tests\TestCase $this */
    /** @var Tests\TestCase $this */
    $response = $this->post(route('admin.products.store'), []);

    $response->assertRedirect(route('login'));
});

it('requires authentication to view edit form', function () {
    /** @var Tests\TestCase $this */
    /** @var Tests\TestCase $this */
    $category = Category::factory()->create(['type' => 'product']);
    $product = Product::factory()->create(['category_id' => $category->id]);

    $response = $this->get(route('admin.products.edit', $product));

    $response->assertRedirect(route('login'));
});

it('requires authentication to update a product', function () {
    /** @var Tests\TestCase $this */
    /** @var Tests\TestCase $this */
    $category = Category::factory()->create(['type' => 'product']);
    $product = Product::factory()->create(['category_id' => $category->id]);

    $response = $this->put(route('admin.products.update', $product), []);

    $response->assertRedirect(route('login'));
});

it('requires authentication to delete a product', function () {
    /** @var Tests\TestCase $this */
    /** @var Tests\TestCase $this */
    $category = Category::factory()->create(['type' => 'product']);
    $product = Product::factory()->create(['category_id' => $category->id]);

    $response = $this->delete(route('admin.products.destroy', $product));

    $response->assertRedirect(route('login'));
});

it('requires authentication to upload product image', function () {
    /** @var Tests\TestCase $this */
    $response = $this->post(route('admin.products.upload-image'), []);

    $response->assertRedirect(route('login'));
});

// Index Page Tests
it('displays the products listing page', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);
    Product::factory()->count(5)->create(['category_id' => $category->id]);

    $response = $this->actingAs($user)->get(route('admin.products.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/products/Index')
        ->has('products.data', 5)
        ->has('categories')
        ->has('filters')
    );
});

it('filters products by search term', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);
    Product::factory()->create(['name' => 'Special Product', 'category_id' => $category->id]);
    Product::factory()->create(['name' => 'Another Product', 'category_id' => $category->id]);

    $response = $this->actingAs($user)->get(route('admin.products.index', ['search' => 'Special']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/products/Index')
        ->has('products.data', 1)
        ->where('products.data.0.name', 'Special Product')
    );
});

it('filters products by category', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category1 = Category::factory()->create(['type' => 'product', 'name' => 'Category 1']);
    $category2 = Category::factory()->create(['type' => 'product', 'name' => 'Category 2']);

    Product::factory()->count(3)->create(['category_id' => $category1->id]);
    Product::factory()->count(2)->create(['category_id' => $category2->id]);

    $response = $this->actingAs($user)->get(route('admin.products.index', ['category' => $category1->id]));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/products/Index')
        ->has('products.data', 3)
    );
});

it('filters products by featured status', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);

    Product::factory()->create(['is_featured' => true, 'category_id' => $category->id]);
    Product::factory()->create(['is_featured' => false, 'category_id' => $category->id]);
    Product::factory()->create(['is_featured' => true, 'category_id' => $category->id]);

    $response = $this->actingAs($user)->get(route('admin.products.index', ['featured' => '1']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/products/Index')
        ->has('products.data', 2)
    );
});

it('filters products by non-featured status', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);

    Product::factory()->create(['is_featured' => true, 'category_id' => $category->id]);
    Product::factory()->create(['is_featured' => false, 'category_id' => $category->id]);

    $response = $this->actingAs($user)->get(route('admin.products.index', ['featured' => '0']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/products/Index')
        ->has('products.data', 1)
        ->where('products.data.0.is_featured', false)
    );
});

// Create Page Tests
it('displays the create form', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);

    $response = $this->actingAs($user)->get(route('admin.products.create'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/products/Create')
        ->has('categories')
        ->has('availableProducts')
    );
});

// Store Tests
it('can create a product with valid data', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);

    $data = [
        'name' => 'Test Product',
        'slug' => 'test-product',
        'description' => 'Test description',
        'short_description' => 'Short description',
        'category_id' => $category->id,
        'is_featured' => false,
        'order' => 0,
    ];

    $response = $this->actingAs($user)->post(route('admin.products.store'), $data);

    $response->assertRedirect(route('admin.products.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('products', [
        'name' => 'Test Product',
        'slug' => 'test-product',
        'category_id' => $category->id,
    ]);
});

it('validates required fields when creating product', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.products.store'), []);

    $response->assertSessionHasErrors(['name', 'category_id']);
});

it('validates slug uniqueness when creating product', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);
    Product::factory()->create(['slug' => 'existing-product', 'category_id' => $category->id]);

    $response = $this->actingAs($user)->post(route('admin.products.store'), [
        'name' => 'New Product',
        'slug' => 'existing-product',
        'category_id' => $category->id,
    ]);

    $response->assertSessionHasErrors(['slug']);
});

it('validates category exists when creating product', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.products.store'), [
        'name' => 'Test Product',
        'category_id' => 99999,
    ]);

    $response->assertSessionHasErrors(['category_id']);
});

it('validates primary category must be in secondary categories list', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category1 = Category::factory()->create(['type' => 'product']);
    $category2 = Category::factory()->create(['type' => 'product']);

    $response = $this->actingAs($user)->post(route('admin.products.store'), [
        'name' => 'Test Product',
        'category_id' => $category1->id,
        'categories' => [$category2->id],
    ]);

    $response->assertSessionHasErrors(['categories']);
});

it('removes duplicate categories automatically', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);

    $response = $this->actingAs($user)->post(route('admin.products.store'), [
        'name' => 'Test Product',
        'category_id' => $category->id,
        'categories' => [$category->id, $category->id],
    ]);

    // Duplicates are removed in prepareForValidation, so validation passes
    $response->assertRedirect(route('admin.products.index'));
    $response->assertSessionHas('success');

    // Verify product was created
    $this->assertDatabaseHas('products', [
        'name' => 'Test Product',
        'category_id' => $category->id,
    ]);
});

it('auto-generates slug from name when slug is empty', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);

    $data = [
        'name' => 'Test Product Name',
        'category_id' => $category->id,
    ];

    $response = $this->actingAs($user)->post(route('admin.products.store'), $data);

    $response->assertRedirect(route('admin.products.index'));
    $this->assertDatabaseHas('products', [
        'name' => 'Test Product Name',
        'slug' => 'test-product-name',
    ]);
});

// Edit Page Tests
it('displays the edit form', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);
    $product = Product::factory()->create(['category_id' => $category->id]);

    $response = $this->actingAs($user)->get(route('admin.products.edit', $product));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/products/Edit')
        ->has('product')
        ->has('categories')
        ->has('availableProducts')
        ->where('product.id', $product->id)
    );
});

// Update Tests
it('can update a product with valid data', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);
    $product = Product::factory()->create([
        'name' => 'Original Name',
        'category_id' => $category->id,
    ]);

    $data = [
        'name' => 'Updated Name',
        'slug' => 'updated-slug',
        'description' => 'Updated description',
        'category_id' => $category->id,
        'is_featured' => true,
        'order' => 5,
    ];

    $response = $this->actingAs($user)->put(route('admin.products.update', $product), $data);

    $response->assertRedirect(route('admin.products.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'name' => 'Updated Name',
        'slug' => 'updated-slug',
        'is_featured' => true,
        'order' => 5,
    ]);
});

it('validates slug uniqueness when updating product', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);
    $product1 = Product::factory()->create(['slug' => 'existing-product', 'category_id' => $category->id]);
    $product2 = Product::factory()->create(['slug' => 'another-product', 'category_id' => $category->id]);

    $response = $this->actingAs($user)->put(route('admin.products.update', $product2), [
        'name' => 'Updated Product',
        'slug' => 'existing-product',
        'category_id' => $category->id,
    ]);

    $response->assertSessionHasErrors(['slug']);
});

it('allows same slug when updating the same product', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);
    $product = Product::factory()->create([
        'name' => 'Test Product',
        'slug' => 'test-product',
        'category_id' => $category->id,
    ]);

    $data = [
        'name' => 'Updated Name',
        'slug' => 'test-product',
        'category_id' => $category->id,
    ];

    $response = $this->actingAs($user)->put(route('admin.products.update', $product), $data);

    $response->assertRedirect(route('admin.products.index'));
    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'slug' => 'test-product',
    ]);
});

it('validates required fields when updating product', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);
    $product = Product::factory()->create(['category_id' => $category->id]);

    $response = $this->actingAs($user)->put(route('admin.products.update', $product), []);

    $response->assertSessionHasErrors(['name', 'category_id']);
});

// Destroy Tests
it('can delete a product', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);
    $product = Product::factory()->create(['category_id' => $category->id]);

    $response = $this->actingAs($user)->delete(route('admin.products.destroy', $product));

    $response->assertRedirect(route('admin.products.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseMissing('products', [
        'id' => $product->id,
    ]);
});

// Upload Image Tests
it('can upload a thumbnail image', function () {
    /** @var Tests\TestCase $this */
    Storage::fake('public');
    $user = User::factory()->create();

    $file = UploadedFile::fake()->image('thumbnail.jpg', 800, 600);

    $response = $this->actingAs($user)->post(route('admin.products.upload-image'), [
        'image' => $file,
        'type' => 'thumbnail',
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
    ]);
    $response->assertJsonStructure([
        'success',
        'path',
        'url',
    ]);

    $path = $response->json('path');
    expect($path)->toStartWith('products/thumbnails/');
    /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
    $disk = Storage::disk('public');
    $disk->assertExists($path);
});

it('can upload a gallery image', function () {
    /** @var Tests\TestCase $this */
    Storage::fake('public');
    $user = User::factory()->create();

    $file = UploadedFile::fake()->image('gallery.jpg', 1200, 800);

    $response = $this->actingAs($user)->post(route('admin.products.upload-image'), [
        'image' => $file,
        'type' => 'gallery',
    ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
    ]);

    $path = $response->json('path');
    expect($path)->toStartWith('products/gallery/');
    /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
    $disk = Storage::disk('public');
    $disk->assertExists($path);
});

it('defaults to gallery type when type is not provided', function () {
    /** @var Tests\TestCase $this */
    Storage::fake('public');
    $user = User::factory()->create();

    $file = UploadedFile::fake()->image('image.jpg');

    $response = $this->actingAs($user)->post(route('admin.products.upload-image'), [
        'image' => $file,
    ]);

    $response->assertSuccessful();
    $path = $response->json('path');
    expect($path)->toStartWith('products/gallery/');
});

it('validates image file is required', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.products.upload-image'), []);

    $response->assertSessionHasErrors(['image']);
});

it('validates image file type', function () {
    /** @var Tests\TestCase $this */
    Storage::fake('public');
    $user = User::factory()->create();

    $file = UploadedFile::fake()->create('document.pdf', 1000);

    $response = $this->actingAs($user)->post(route('admin.products.upload-image'), [
        'image' => $file,
    ]);

    $response->assertSessionHasErrors(['image']);
});

it('validates image file size', function () {
    /** @var Tests\TestCase $this */
    Storage::fake('public');
    $user = User::factory()->create();

    $file = UploadedFile::fake()->image('large.jpg')->size(6000); // 6MB

    $response = $this->actingAs($user)->post(route('admin.products.upload-image'), [
        'image' => $file,
    ]);

    $response->assertSessionHasErrors(['image']);
});

it('accepts valid image mime types', function () {
    /** @var Tests\TestCase $this */
    Storage::fake('public');
    $user = User::factory()->create();

    $validTypes = ['jpeg', 'jpg', 'png', 'gif', 'webp'];

    foreach ($validTypes as $type) {
        $file = UploadedFile::fake()->image("image.{$type}");

        $response = $this->actingAs($user)->post(route('admin.products.upload-image'), [
            'image' => $file,
        ]);

        $response->assertSuccessful();
    }
});

it('validates type must be thumbnail or gallery', function () {
    /** @var Tests\TestCase $this */
    Storage::fake('public');
    $user = User::factory()->create();

    $file = UploadedFile::fake()->image('image.jpg');

    $response = $this->actingAs($user)->post(route('admin.products.upload-image'), [
        'image' => $file,
        'type' => 'invalid',
    ]);

    $response->assertSessionHasErrors(['type']);
});

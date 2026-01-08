<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductDownload;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

it('can create a product with structured specifications', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);

    $specifications = [
        'spec_section_label__electroacoustic_specs' => 'Electroacoustic specs',
        'spec_label__electroacoustic_specs__usable_bandwidth' => 'Usable bandwidth (-10 dB)',
        'spec__electroacoustic_specs__usable_bandwidth' => '45 Hz – 20 kHz [L2 70]',
        'spec_label__electroacoustic_specs__max_spl' => 'Maximum SPL',
        'spec__electroacoustic_specs__max_spl' => '155 dB [L2 70]',
    ];

    $response = $this->actingAs($user)->post('/dashboard/admin/products', [
        'name' => 'Test Product',
        'slug' => 'test-product',
        'category_id' => $category->id,
        'specifications' => $specifications,
        'is_featured' => false,
        'order' => 0,
    ]);

    $response->assertRedirect('/dashboard/admin/products');
    $response->assertSessionHas('success');

    $product = Product::where('slug', 'test-product')->first();
    expect($product)->not->toBeNull();
    expect($product->specifications)->toBeArray();
    expect($product->specifications['spec__electroacoustic_specs__usable_bandwidth'])->toBe('45 Hz – 20 kHz [L2 70]');
});

it('can create a product with bidirectional system elements', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);

    $product1 = Product::factory()->create(['category_id' => $category->id]);
    $product2 = Product::factory()->create(['category_id' => $category->id]);

    $response = $this->actingAs($user)->post('/dashboard/admin/products', [
        'name' => 'Main Product',
        'slug' => 'main-product',
        'category_id' => $category->id,
        'system_elements' => [
            ['product_id' => $product1->id, 'order' => 0],
            ['product_id' => $product2->id, 'order' => 1],
        ],
        'is_featured' => false,
        'order' => 0,
    ]);

    $response->assertRedirect('/dashboard/admin/products');

    $mainProduct = Product::where('slug', 'main-product')->first();
    expect($mainProduct->systemElements)->toHaveCount(2);

    // Check bidirectional relationship
    $product1->refresh();
    expect($product1->usedInProducts)->toHaveCount(1);
    expect($product1->usedInProducts->first()->id)->toBe($mainProduct->id);
});

it('can upload and attach downloads to a product', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);

    $file = UploadedFile::fake()->create('test-document.pdf', 100);

    $response = $this->actingAs($user)->post('/dashboard/admin/products', [
        'name' => 'Product with Downloads',
        'slug' => 'product-downloads',
        'category_id' => $category->id,
        'downloads' => [
            [
                'title' => 'Test Document',
                'category' => 'Datasheet',
                'order' => 0,
                'file' => $file,
            ],
        ],
        'is_featured' => false,
        'order' => 0,
    ], [
        'Content-Type' => 'multipart/form-data',
    ]);

    $response->assertRedirect('/dashboard/admin/products');

    $product = Product::where('slug', 'product-downloads')->first();
    expect($product->downloads)->toHaveCount(1);
    expect($product->downloads->first()->title)->toBe('Test Document');
    expect($product->downloads->first()->category)->toBe('Datasheet');
    expect($product->downloads->first()->path)->not->toBeNull();

    Storage::disk('public')->assertExists($product->downloads->first()->path);
});

it('can update product with all new features', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);

    $product = Product::factory()->create(['category_id' => $category->id]);
    $systemElement = Product::factory()->create(['category_id' => $category->id]);

    $specifications = [
        'spec_section_label__physical_specs' => 'Physical specs',
        'spec_label__physical_specs__weight' => 'Weight (net)',
        'spec__physical_specs__weight' => '158 kg / 348 lb',
    ];

    $file = UploadedFile::fake()->create('manual.pdf', 200);

    $response = $this->actingAs($user)->put("/dashboard/admin/products/{$product->id}", [
        'name' => $product->name,
        'slug' => $product->slug,
        'specifications' => $specifications,
        'system_elements' => [
            ['product_id' => $systemElement->id, 'order' => 0],
        ],
        'downloads' => [
            [
                'title' => 'Product Manual',
                'category' => 'Manual',
                'order' => 0,
                'file' => $file,
            ],
        ],
        'is_featured' => false,
        'order' => 0,
    ], [
        'Content-Type' => 'multipart/form-data',
    ]);

    $response->assertRedirect('/dashboard/admin/products');

    $product->refresh();
    expect($product->specifications['spec__physical_specs__weight'])->toBe('158 kg / 348 lb');
    expect($product->systemElements)->toHaveCount(1);
    expect($product->downloads)->toHaveCount(1);
});

it('displays product with system elements and downloads on public page', function () {
    $category = Category::factory()->create(['type' => 'product']);
    $product = Product::factory()->create(['category_id' => $category->id]);
    $systemElement = Product::factory()->create(['category_id' => $category->id]);
    $product->systemElements()->attach($systemElement->id, ['order' => 0]);

    $download = ProductDownload::factory()->create([
        'product_id' => $product->id,
        'title' => 'Test Download',
        'category' => 'Datasheet',
    ]);

    $response = $this->get("/products/{$product->slug}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Products/Show')
        ->where('product.id', $product->id)
        ->has('product.system_elements', 1)
        ->has('product.downloads', 1)
    );
});

it('validates that specification values are strings', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);

    $response = $this->actingAs($user)->post('/dashboard/admin/products', [
        'name' => 'Test Product',
        'slug' => 'test-product',
        'category_id' => $category->id,
        'specifications' => [
            'invalid_key' => ['not', 'a', 'string'],
        ],
        'is_featured' => false,
        'order' => 0,
    ]);

    $response->assertSessionHasErrors('specifications.*');
});

it('validates system elements product exists', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);

    $response = $this->actingAs($user)->post('/dashboard/admin/products', [
        'name' => 'Test Product',
        'slug' => 'test-product',
        'category_id' => $category->id,
        'system_elements' => [
            ['product_id' => 99999, 'order' => 0],
        ],
        'is_featured' => false,
        'order' => 0,
    ]);

    $response->assertSessionHasErrors('system_elements.0.product_id');
});

it('can create a product with overview specs', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);

    $specifications = [
        'spec_section_label__electroacoustic_specs' => 'Electroacoustic specs',
        'spec_label__electroacoustic_specs__max_spl' => 'Maximum SPL',
        'spec__electroacoustic_specs__max_spl' => '155 dB',
        'spec_label__electroacoustic_specs__usable_bandwidth' => 'Usable bandwidth (-10 dB)',
        'spec__electroacoustic_specs__usable_bandwidth' => '45 Hz – 20 kHz',
        'spec_section_label__physical_specs' => 'Physical specs',
        'spec_label__physical_specs__weight_net' => 'Weight (net)',
        'spec__physical_specs__weight_net' => '158 kg / 348 lb',
    ];

    $overviewSpecs = [
        ['section' => 'Electroacoustic specs', 'label' => 'Maximum SPL'],
        ['section' => 'Electroacoustic specs', 'label' => 'Usable bandwidth (-10 dB)'],
        ['section' => 'Physical specs', 'label' => 'Weight (net)'],
    ];

    $response = $this->actingAs($user)->post('/dashboard/admin/products', [
        'name' => 'Test Product',
        'slug' => 'test-product',
        'category_id' => $category->id,
        'specifications' => $specifications,
        'overview_specs' => $overviewSpecs,
        'is_featured' => false,
        'order' => 0,
    ]);

    $response->assertRedirect('/dashboard/admin/products');
    $response->assertSessionHas('success');

    $product = Product::where('slug', 'test-product')->first();
    expect($product)->not->toBeNull();
    expect($product->overview_specs)->toBeArray();
    expect($product->overview_specs)->toHaveCount(3);
    expect($product->overview_specs[0])->toMatchArray([
        'section' => 'Electroacoustic specs',
        'label' => 'Maximum SPL',
    ]);
});

it('can update product overview specs', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);

    $specifications = [
        'spec_section_label__electroacoustic_specs' => 'Electroacoustic specs',
        'spec_label__electroacoustic_specs__max_spl' => 'Maximum SPL',
        'spec__electroacoustic_specs__max_spl' => '155 dB',
    ];

    $product = Product::factory()->create([
        'category_id' => $category->id,
        'specifications' => $specifications,
    ]);

    $overviewSpecs = [
        ['section' => 'Electroacoustic specs', 'label' => 'Maximum SPL'],
    ];

    $response = $this->actingAs($user)->put("/dashboard/admin/products/{$product->id}", [
        'name' => $product->name,
        'slug' => $product->slug,
        'specifications' => $specifications,
        'overview_specs' => $overviewSpecs,
        'is_featured' => false,
        'order' => 0,
    ]);

    $response->assertRedirect('/dashboard/admin/products');

    $product->refresh();
    expect($product->overview_specs)->toBeArray();
    expect($product->overview_specs)->toHaveCount(1);
    expect($product->overview_specs[0])->toMatchArray([
        'section' => 'Electroacoustic specs',
        'label' => 'Maximum SPL',
    ]);
});

it('displays product with key specs on public page', function () {
    $category = Category::factory()->create(['type' => 'product']);

    $specifications = [
        'spec_section_label__electroacoustic_specs' => 'Electroacoustic specs',
        'spec_label__electroacoustic_specs__max_spl' => 'Maximum SPL',
        'spec__electroacoustic_specs__max_spl' => '155 dB',
        'spec_label__electroacoustic_specs__usable_bandwidth' => 'Usable bandwidth (-10 dB)',
        'spec__electroacoustic_specs__usable_bandwidth' => '45 Hz – 20 kHz',
    ];

    $overviewSpecs = [
        ['section' => 'Electroacoustic specs', 'label' => 'Maximum SPL'],
        ['section' => 'Electroacoustic specs', 'label' => 'Usable bandwidth (-10 dB)'],
    ];

    $product = Product::factory()->create([
        'category_id' => $category->id,
        'slug' => 'test-product',
        'specifications' => $specifications,
        'overview_specs' => $overviewSpecs,
    ]);

    $response = $this->get("/products/{$product->slug}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Products/Show')
        ->where('product.id', $product->id)
        ->has('product.key_specs', 2)
        ->where('product.key_specs.0.label', 'Maximum SPL')
        ->where('product.key_specs.0.value', '155 dB')
        ->where('product.key_specs.1.label', 'Usable bandwidth (-10 dB)')
        ->where('product.key_specs.1.value', '45 Hz – 20 kHz')
    );
});

it('shows overview tab when key specs exist even without short_description', function () {
    $category = Category::factory()->create(['type' => 'product']);

    $specifications = [
        'spec_section_label__electroacoustic_specs' => 'Electroacoustic specs',
        'spec_label__electroacoustic_specs__max_spl' => 'Maximum SPL',
        'spec__electroacoustic_specs__max_spl' => '155 dB',
    ];

    $overviewSpecs = [
        ['section' => 'Electroacoustic specs', 'label' => 'Maximum SPL'],
    ];

    $product = Product::factory()->create([
        'category_id' => $category->id,
        'slug' => 'test-product',
        'short_description' => null,
        'specifications' => $specifications,
        'overview_specs' => $overviewSpecs,
    ]);

    $response = $this->get("/products/{$product->slug}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Products/Show')
        ->where('product.id', $product->id)
        ->has('product.key_specs', 1)
    );
});

it('can save and retrieve specification values with newlines', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);

    $specifications = [
        'spec_section_label__electroacoustic_specs' => 'Electroacoustic specs',
        'spec_label__electroacoustic_specs__frequency_response' => 'Frequency Response',
        'spec__electroacoustic_specs__frequency_response' => "45 Hz – 20 kHz\n±3 dB",
    ];

    $response = $this->actingAs($user)->post('/dashboard/admin/products', [
        'name' => 'Test Product',
        'slug' => 'test-product-newlines',
        'category_id' => $category->id,
        'specifications' => $specifications,
        'is_featured' => false,
        'order' => 0,
    ]);

    $response->assertRedirect('/dashboard/admin/products');
    $response->assertSessionHas('success');

    $product = Product::where('slug', 'test-product-newlines')->first();
    expect($product)->not->toBeNull();
    expect($product->specifications)->toBeArray();
    $savedValue = $product->specifications['spec__electroacoustic_specs__frequency_response'];
    expect($savedValue)->toContain("\n");
    expect($savedValue)->toBe("45 Hz – 20 kHz\n±3 dB");
});

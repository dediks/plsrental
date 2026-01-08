<?php

use App\Models\Supplier;

it('displays the supplier detail page', function () {
    $supplier = Supplier::factory()->create([
        'slug' => 'test-supplier',
        'is_published' => true,
    ]);

    $response = $this->get('/suppliers/'.$supplier->slug);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Suppliers/Show')
        ->where('supplier.id', $supplier->id)
        ->has('relatedSuppliers', 0)
        ->has('filters')
    );
});

it('returns empty related suppliers when no filters are applied', function () {
    $supplier = Supplier::factory()->create([
        'slug' => 'test-supplier',
        'is_published' => true,
    ]);

    Supplier::factory()->count(3)->create(['is_published' => true]);

    $response = $this->get('/suppliers/'.$supplier->slug);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Suppliers/Show')
        ->where('supplier.id', $supplier->id)
        ->has('relatedSuppliers', 0)
    );
});

it('filters suppliers by search query', function () {
    $supplier = Supplier::factory()->create([
        'slug' => 'test-supplier',
        'name' => 'Main Supplier',
        'is_published' => true,
    ]);

    $matchingSupplier = Supplier::factory()->create([
        'name' => 'Special Supplier Name',
        'is_published' => true,
    ]);

    Supplier::factory()->create([
        'name' => 'Another Supplier',
        'is_published' => true,
    ]);

    $response = $this->get('/suppliers/'.$supplier->slug.'?search=Special');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Suppliers/Show')
        ->where('supplier.id', $supplier->id)
        ->has('relatedSuppliers', 1)
        ->where('relatedSuppliers.0.id', $matchingSupplier->id)
        ->where('filters.search', 'Special')
    );
});

it('filters suppliers by type', function () {
    $supplier = Supplier::factory()->create([
        'slug' => 'test-supplier',
        'type' => Supplier::TYPE_DISTRIBUTOR,
        'is_published' => true,
    ]);

    $distributor = Supplier::factory()->create([
        'type' => Supplier::TYPE_DISTRIBUTOR,
        'is_published' => true,
    ]);

    Supplier::factory()->create([
        'type' => Supplier::TYPE_DEALER,
        'is_published' => true,
    ]);

    $response = $this->get('/suppliers/'.$supplier->slug.'?type='.Supplier::TYPE_DISTRIBUTOR);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Suppliers/Show')
        ->where('supplier.id', $supplier->id)
        ->has('relatedSuppliers', 1)
        ->where('relatedSuppliers.0.id', $distributor->id)
        ->where('filters.type', Supplier::TYPE_DISTRIBUTOR)
    );
});

it('filters suppliers by city', function () {
    $supplier = Supplier::factory()->create([
        'slug' => 'test-supplier',
        'city' => 'New York',
        'is_published' => true,
    ]);

    $matchingSupplier = Supplier::factory()->create([
        'city' => 'New York',
        'is_published' => true,
    ]);

    Supplier::factory()->create([
        'city' => 'Los Angeles',
        'is_published' => true,
    ]);

    $response = $this->get('/suppliers/'.$supplier->slug.'?city=New York');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Suppliers/Show')
        ->where('supplier.id', $supplier->id)
        ->has('relatedSuppliers', 1)
        ->where('relatedSuppliers.0.id', $matchingSupplier->id)
        ->where('filters.city', 'New York')
    );
});

it('filters suppliers by country', function () {
    $supplier = Supplier::factory()->create([
        'slug' => 'test-supplier',
        'country' => 'United States',
        'is_published' => true,
    ]);

    $matchingSupplier = Supplier::factory()->create([
        'country' => 'United States',
        'is_published' => true,
    ]);

    Supplier::factory()->create([
        'country' => 'Canada',
        'is_published' => true,
    ]);

    $response = $this->get('/suppliers/'.$supplier->slug.'?country=United States');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Suppliers/Show')
        ->where('supplier.id', $supplier->id)
        ->has('relatedSuppliers', 1)
        ->where('relatedSuppliers.0.id', $matchingSupplier->id)
        ->where('filters.country', 'United States')
    );
});

it('filters suppliers by multiple criteria', function () {
    $supplier = Supplier::factory()->create([
        'slug' => 'test-supplier',
        'type' => Supplier::TYPE_DISTRIBUTOR,
        'city' => 'New York',
        'is_published' => true,
    ]);

    $matchingSupplier = Supplier::factory()->create([
        'type' => Supplier::TYPE_DISTRIBUTOR,
        'city' => 'New York',
        'name' => 'Special Name',
        'is_published' => true,
    ]);

    Supplier::factory()->create([
        'type' => Supplier::TYPE_DISTRIBUTOR,
        'city' => 'Los Angeles',
        'is_published' => true,
    ]);

    $response = $this->get('/suppliers/'.$supplier->slug.'?type='.Supplier::TYPE_DISTRIBUTOR.'&city=New York&search=Special');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Suppliers/Show')
        ->where('supplier.id', $supplier->id)
        ->has('relatedSuppliers', 1)
        ->where('relatedSuppliers.0.id', $matchingSupplier->id)
    );
});

it('excludes current supplier from filtered results', function () {
    $supplier = Supplier::factory()->create([
        'slug' => 'test-supplier',
        'type' => Supplier::TYPE_DISTRIBUTOR,
        'city' => 'New York',
        'is_published' => true,
    ]);

    $response = $this->get('/suppliers/'.$supplier->slug.'?type='.Supplier::TYPE_DISTRIBUTOR.'&city=New York');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Suppliers/Show')
        ->where('supplier.id', $supplier->id)
    );

    $relatedSuppliers = $response->original->getData()['page']['props']['relatedSuppliers'];
    $supplierIds = collect($relatedSuppliers)->pluck('id')->toArray();
    expect($supplierIds)->not->toContain($supplier->id);
});

it('searches suppliers by description', function () {
    $supplier = Supplier::factory()->create([
        'slug' => 'test-supplier',
        'name' => 'Main Supplier',
        'is_published' => true,
    ]);

    $matchingSupplier = Supplier::factory()->create([
        'description' => 'This is a special description with unique words',
        'is_published' => true,
    ]);

    Supplier::factory()->create([
        'description' => 'Another description',
        'is_published' => true,
    ]);

    $response = $this->get('/suppliers/'.$supplier->slug.'?search=unique words');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Suppliers/Show')
        ->where('supplier.id', $supplier->id)
        ->has('relatedSuppliers', 1)
        ->where('relatedSuppliers.0.id', $matchingSupplier->id)
    );
});

it('returns 404 for non-existent supplier', function () {
    $response = $this->get('/suppliers/non-existent-supplier');

    $response->assertNotFound();
});

it('hides unpublished suppliers from public index', function () {
    Supplier::factory()->create([
        'name' => 'Published Supplier',
        'is_published' => true,
    ]);

    Supplier::factory()->create([
        'name' => 'Unpublished Supplier',
        'is_published' => false,
    ]);

    $response = $this->get('/suppliers?search=Supplier');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Suppliers/Index')
        ->has('suppliers.data', 1)
        ->where('suppliers.data.0.name', 'Published Supplier')
    );
});

it('returns 404 for unpublished supplier on public show page', function () {
    $supplier = Supplier::factory()->create([
        'slug' => 'unpublished-supplier',
        'is_published' => false,
    ]);

    $response = $this->get('/suppliers/'.$supplier->slug);

    $response->assertNotFound();
});

it('shows published suppliers on public show page', function () {
    $supplier = Supplier::factory()->create([
        'slug' => 'published-supplier',
        'is_published' => true,
    ]);

    $response = $this->get('/suppliers/'.$supplier->slug);

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('Suppliers/Show')
        ->where('supplier.id', $supplier->id)
    );
});

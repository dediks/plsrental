<?php

use App\Models\Supplier;
use App\Models\User;

it('can create a supplier with valid coordinates', function () {
    $user = User::factory()->create();

    $data = [
        'name' => 'Test Supplier',
        'type' => Supplier::TYPE_DISTRIBUTOR,
        'latitude' => 51.5074,
        'longitude' => -0.1278,
    ];

    $response = $this->actingAs($user)->post(route('admin.suppliers.store'), $data);

    $response->assertRedirect(route('admin.suppliers.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('suppliers', [
        'name' => 'Test Supplier',
        'type' => Supplier::TYPE_DISTRIBUTOR,
    ]);
});

it('rejects latitude values greater than 90', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.suppliers.store'), [
        'name' => 'Test Supplier',
        'type' => Supplier::TYPE_DISTRIBUTOR,
        'latitude' => 91,
        'longitude' => 0,
    ]);

    $response->assertSessionHasErrors(['latitude']);
});

it('rejects latitude values less than -90', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.suppliers.store'), [
        'name' => 'Test Supplier',
        'type' => Supplier::TYPE_DISTRIBUTOR,
        'latitude' => -91,
        'longitude' => 0,
    ]);

    $response->assertSessionHasErrors(['latitude']);
});

it('rejects longitude values greater than 180', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.suppliers.store'), [
        'name' => 'Test Supplier',
        'type' => Supplier::TYPE_DISTRIBUTOR,
        'latitude' => 0,
        'longitude' => 181,
    ]);

    $response->assertSessionHasErrors(['longitude']);
});

it('rejects longitude values less than -180', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.suppliers.store'), [
        'name' => 'Test Supplier',
        'type' => Supplier::TYPE_DISTRIBUTOR,
        'latitude' => 0,
        'longitude' => -181,
    ]);

    $response->assertSessionHasErrors(['longitude']);
});

it('accepts boundary latitude values', function () {
    $user = User::factory()->create();

    $data = [
        'name' => 'Test Supplier',
        'type' => Supplier::TYPE_DISTRIBUTOR,
        'latitude' => 90,
        'longitude' => 0,
    ];

    $response = $this->actingAs($user)->post(route('admin.suppliers.store'), $data);

    $response->assertRedirect(route('admin.suppliers.index'));
    $this->assertDatabaseHas('suppliers', ['name' => 'Test Supplier']);
});

it('accepts boundary longitude values', function () {
    $user = User::factory()->create();

    $data = [
        'name' => 'Test Supplier',
        'type' => Supplier::TYPE_DISTRIBUTOR,
        'latitude' => 0,
        'longitude' => 180,
    ];

    $response = $this->actingAs($user)->post(route('admin.suppliers.store'), $data);

    $response->assertRedirect(route('admin.suppliers.index'));
    $this->assertDatabaseHas('suppliers', ['name' => 'Test Supplier']);
});

it('validates coordinates when updating a supplier', function () {
    $user = User::factory()->create();
    $supplier = Supplier::factory()->create();

    $response = $this->actingAs($user)->put(route('admin.suppliers.update', $supplier), [
        'name' => $supplier->name,
        'type' => $supplier->type,
        'latitude' => 212,
        'longitude' => 23121,
    ]);

    $response->assertSessionHasErrors(['latitude', 'longitude']);
});

it('can see all suppliers in admin index regardless of published status', function () {
    $user = User::factory()->create();

    Supplier::factory()->create([
        'name' => 'Published Supplier',
        'is_published' => true,
    ]);

    Supplier::factory()->create([
        'name' => 'Unpublished Supplier',
        'is_published' => false,
    ]);

    $response = $this->actingAs($user)->get(route('admin.suppliers.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/suppliers/Index')
        ->has('suppliers.data', 2)
    );
});

it('can filter suppliers by published status in admin', function () {
    $user = User::factory()->create();

    Supplier::factory()->create([
        'name' => 'Published Supplier',
        'is_published' => true,
    ]);

    Supplier::factory()->create([
        'name' => 'Unpublished Supplier',
        'is_published' => false,
    ]);

    $response = $this->actingAs($user)->get(route('admin.suppliers.index', ['published' => '1']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/suppliers/Index')
        ->has('suppliers.data', 1)
        ->where('suppliers.data.0.name', 'Published Supplier')
    );
});

it('can filter suppliers by unpublished status in admin', function () {
    $user = User::factory()->create();

    Supplier::factory()->create([
        'name' => 'Published Supplier',
        'is_published' => true,
    ]);

    Supplier::factory()->create([
        'name' => 'Unpublished Supplier',
        'is_published' => false,
    ]);

    $response = $this->actingAs($user)->get(route('admin.suppliers.index', ['published' => '0']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/suppliers/Index')
        ->has('suppliers.data', 1)
        ->where('suppliers.data.0.name', 'Unpublished Supplier')
    );
});

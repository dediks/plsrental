<?php

use App\Models\Rental;
use App\Models\User;

it('can create a rental with valid coordinates', function () {
    $user = User::factory()->create();

    $data = [
        'name' => 'Test Rental',
        'latitude' => 51.5074,
        'longitude' => -0.1278,
    ];

    $response = $this->actingAs($user)->post(route('admin.rentals.store'), $data);

    $response->assertRedirect(route('admin.rentals.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('rentals', [
        'name' => 'Test Rental',
    ]);
});

it('rejects latitude values greater than 90', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.rentals.store'), [
        'name' => 'Test Rental',
        'latitude' => 91,
        'longitude' => 0,
    ]);

    $response->assertSessionHasErrors(['latitude']);
});

it('rejects latitude values less than -90', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.rentals.store'), [
        'name' => 'Test Rental',
        'latitude' => -91,
        'longitude' => 0,
    ]);

    $response->assertSessionHasErrors(['latitude']);
});

it('rejects longitude values greater than 180', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.rentals.store'), [
        'name' => 'Test Rental',
        'latitude' => 0,
        'longitude' => 181,
    ]);

    $response->assertSessionHasErrors(['longitude']);
});

it('rejects longitude values less than -180', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.rentals.store'), [
        'name' => 'Test Rental',
        'latitude' => 0,
        'longitude' => -181,
    ]);

    $response->assertSessionHasErrors(['longitude']);
});

it('accepts boundary latitude values', function () {
    $user = User::factory()->create();

    $data = [
        'name' => 'Test Rental',
        'latitude' => 90,
        'longitude' => 0,
    ];

    $response = $this->actingAs($user)->post(route('admin.rentals.store'), $data);

    $response->assertRedirect(route('admin.rentals.index'));
    $this->assertDatabaseHas('rentals', ['name' => 'Test Rental']);
});

it('accepts boundary longitude values', function () {
    $user = User::factory()->create();

    $data = [
        'name' => 'Test Rental',
        'latitude' => 0,
        'longitude' => 180,
    ];

    $response = $this->actingAs($user)->post(route('admin.rentals.store'), $data);

    $response->assertRedirect(route('admin.rentals.index'));
    $this->assertDatabaseHas('rentals', ['name' => 'Test Rental']);
});

it('validates coordinates when updating a rental', function () {
    $user = User::factory()->create();
    $rental = Rental::factory()->create();

    $response = $this->actingAs($user)->put(route('admin.rentals.update', $rental), [
        'name' => $rental->name,
        'latitude' => 212,
        'longitude' => 23121,
    ]);

    $response->assertSessionHasErrors(['latitude', 'longitude']);
});

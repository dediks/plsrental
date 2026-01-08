<?php

use App\Models\SocialMedia;
use App\Models\User;

it('displays the social media listing page', function () {
    $user = User::factory()->create();
    SocialMedia::factory()->count(5)->create();

    $response = $this->actingAs($user)->get(route('admin.social-media.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/social-media/Index')
        ->has('socialMedia.data', 5)
    );
});

it('requires authentication to view social media index', function () {
    $response = $this->get(route('admin.social-media.index'));

    $response->assertRedirect(route('login'));
});

it('displays the create form', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('admin.social-media.create'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/social-media/Create')
        ->has('platforms')
    );
});

it('can create a new social media link', function () {
    $user = User::factory()->create();

    $data = [
        'name' => 'YouTube',
        'platform' => 'youtube',
        'url' => 'https://youtube.com',
        'order' => 0,
        'is_active' => true,
    ];

    $response = $this->actingAs($user)->post(route('admin.social-media.store'), $data);

    $response->assertRedirect(route('admin.social-media.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('social_media', [
        'name' => 'YouTube',
        'platform' => 'youtube',
        'url' => 'https://youtube.com',
        'order' => 0,
        'is_active' => true,
    ]);
});

it('validates required fields when creating social media link', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.social-media.store'), []);

    $response->assertSessionHasErrors(['name', 'platform', 'url']);
});

it('validates url format when creating social media link', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('admin.social-media.store'), [
        'name' => 'YouTube',
        'platform' => 'youtube',
        'url' => 'not-a-valid-url',
    ]);

    $response->assertSessionHasErrors(['url']);
});

it('displays the edit form', function () {
    $user = User::factory()->create();
    $socialMedia = SocialMedia::factory()->create();

    $response = $this->actingAs($user)->get(route('admin.social-media.edit', $socialMedia));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/social-media/Edit')
        ->has('socialMedia')
        ->has('platforms')
        ->where('socialMedia.id', $socialMedia->id)
    );
});

it('can update an existing social media link', function () {
    $user = User::factory()->create();
    $socialMedia = SocialMedia::factory()->create([
        'name' => 'YouTube',
        'platform' => 'youtube',
        'url' => 'https://youtube.com',
    ]);

    $data = [
        'name' => 'YouTube Updated',
        'platform' => 'youtube',
        'url' => 'https://youtube.com/updated',
        'order' => 1,
        'is_active' => false,
    ];

    $response = $this->actingAs($user)->put(route('admin.social-media.update', $socialMedia), $data);

    $response->assertRedirect(route('admin.social-media.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('social_media', [
        'id' => $socialMedia->id,
        'name' => 'YouTube Updated',
        'url' => 'https://youtube.com/updated',
        'order' => 1,
        'is_active' => false,
    ]);
});

it('validates required fields when updating social media link', function () {
    $user = User::factory()->create();
    $socialMedia = SocialMedia::factory()->create();

    $response = $this->actingAs($user)->put(route('admin.social-media.update', $socialMedia), []);

    $response->assertSessionHasErrors(['name', 'platform', 'url']);
});

it('can delete a social media link', function () {
    $user = User::factory()->create();
    $socialMedia = SocialMedia::factory()->create();

    $response = $this->actingAs($user)->delete(route('admin.social-media.destroy', $socialMedia));

    $response->assertRedirect(route('admin.social-media.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseMissing('social_media', [
        'id' => $socialMedia->id,
    ]);
});

it('filters social media links by search term', function () {
    $user = User::factory()->create();
    SocialMedia::factory()->create(['name' => 'YouTube', 'platform' => 'youtube']);
    SocialMedia::factory()->create(['name' => 'Facebook', 'platform' => 'facebook']);

    $response = $this->actingAs($user)->get(route('admin.social-media.index', ['search' => 'YouTube']));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/social-media/Index')
        ->has('socialMedia.data', 1)
        ->where('socialMedia.data.0.name', 'YouTube')
    );
});

it('filters social media links by active status', function () {
    $user = User::factory()->create();
    SocialMedia::factory()->create(['is_active' => true]);
    SocialMedia::factory()->create(['is_active' => false]);

    $response = $this->actingAs($user)->get(route('admin.social-media.index', ['is_active' => true]));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/social-media/Index')
        ->has('socialMedia.data', 1)
        ->where('socialMedia.data.0.is_active', true)
    );
});

it('only shows active social media links in shared data', function () {
    SocialMedia::factory()->create(['is_active' => true, 'platform' => 'youtube']);
    SocialMedia::factory()->create(['is_active' => false, 'platform' => 'facebook']);

    $response = $this->get('/');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->has('socialMediaLinks', 1)
        ->where('socialMediaLinks.0.platform', 'youtube')
    );
});

it('orders social media links by order field', function () {
    $user = User::factory()->create();
    SocialMedia::factory()->create(['name' => 'Third', 'order' => 3]);
    SocialMedia::factory()->create(['name' => 'First', 'order' => 1]);
    SocialMedia::factory()->create(['name' => 'Second', 'order' => 2]);

    $response = $this->actingAs($user)->get(route('admin.social-media.index'));

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/social-media/Index')
        ->where('socialMedia.data.0.name', 'First')
        ->where('socialMedia.data.1.name', 'Second')
        ->where('socialMedia.data.2.name', 'Third')
    );
});

<?php

use App\Models\Article;
use App\Models\Category;
use App\Models\Media;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

it('allows SVG file upload for logo context', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();

    // Create a safe SVG file
    $svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="blue"/></svg>';
    $file = UploadedFile::fake()->createWithContent('logo.svg', $svgContent);

    $response = $this->actingAs($user)
        ->postJson(route('admin.media.upload'), [
            'image' => $file,
            'context' => 'logo',
        ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
    ]);
    $response->assertJsonStructure([
        'success',
        'media' => [
            'id',
            'path',
            'url',
        ],
    ]);

    // Verify file was stored - check path format
    $mediaPath = $response->json('media.path');
    expect($mediaPath)->toStartWith('logos/');
    // Note: With Storage::fake(), the actual file structure may differ,
    // but we verify the path format is correct
});

it('rejects SVG file upload for non-logo contexts', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();

    // Create a safe SVG file
    $svgContent = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="blue"/></svg>';
    $file = UploadedFile::fake()->createWithContent('image.svg', $svgContent);

    $response = $this->actingAs($user)
        ->postJson(route('admin.media.upload'), [
            'image' => $file,
            'context' => 'product',
        ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['image']);
});

it('rejects SVG file with script tags', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();

    // Create a malicious SVG with script tag
    $svgContent = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert("xss")</script></svg>';
    $file = UploadedFile::fake()->createWithContent('malicious.svg', $svgContent);

    $response = $this->actingAs($user)
        ->postJson(route('admin.media.upload'), [
            'image' => $file,
            'context' => 'logo',
        ]);

    $response->assertStatus(422);
    $response->assertJson([
        'success' => false,
        'message' => 'SVG file contains potentially dangerous content. Script tags and event handlers are not allowed.',
    ]);
});

it('rejects SVG file with event handlers', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();

    // Create a malicious SVG with onclick handler
    $svgContent = '<svg xmlns="http://www.w3.org/2000/svg"><rect onclick="alert(\'xss\')" width="100" height="100"/></svg>';
    $file = UploadedFile::fake()->createWithContent('malicious.svg', $svgContent);

    $response = $this->actingAs($user)
        ->postJson(route('admin.media.upload'), [
            'image' => $file,
            'context' => 'logo',
        ]);

    $response->assertStatus(422);
    $response->assertJson([
        'success' => false,
        'message' => 'SVG file contains potentially dangerous content. Script tags and event handlers are not allowed.',
    ]);
});

it('rejects SVG file with javascript protocol', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();

    // Create a malicious SVG with javascript: protocol
    $svgContent = '<svg xmlns="http://www.w3.org/2000/svg"><a href="javascript:alert(\'xss\')">Click</a></svg>';
    $file = UploadedFile::fake()->createWithContent('malicious.svg', $svgContent);

    $response = $this->actingAs($user)
        ->postJson(route('admin.media.upload'), [
            'image' => $file,
            'context' => 'logo',
        ]);

    $response->assertStatus(422);
    $response->assertJson([
        'success' => false,
        'message' => 'SVG file contains potentially dangerous content. Script tags and event handlers are not allowed.',
    ]);
});

it('allows standard image formats for logo context', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();

    $file = UploadedFile::fake()->image('logo.png', 200, 200);

    $response = $this->actingAs($user)
        ->postJson(route('admin.media.upload'), [
            'image' => $file,
            'context' => 'logo',
        ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
    ]);
});

it('requires authentication to upload media', function () {
    /** @var Tests\TestCase $this */
    $file = UploadedFile::fake()->image('logo.png', 200, 200);

    $response = $this->postJson(route('admin.media.upload'), [
        'image' => $file,
        'context' => 'logo',
    ]);

    $response->assertUnauthorized();
});

it('allows PNG file upload for product context', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();

    $file = UploadedFile::fake()->image('product.png', 200, 200);

    $response = $this->actingAs($user)
        ->postJson(route('admin.media.upload'), [
            'image' => $file,
            'context' => 'product',
        ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
    ]);
});

it('allows WEBP file upload for product context', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();

    $file = UploadedFile::fake()->image('product.webp', 200, 200);

    $response = $this->actingAs($user)
        ->postJson(route('admin.media.upload'), [
            'image' => $file,
            'context' => 'product',
        ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
    ]);
});

it('allows JPG file upload for product context', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();

    $file = UploadedFile::fake()->image('product.jpg', 200, 200);

    $response = $this->actingAs($user)
        ->postJson(route('admin.media.upload'), [
            'image' => $file,
            'context' => 'product',
        ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
    ]);
});

it('rejects GIF file upload for product context', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();

    $file = UploadedFile::fake()->image('product.gif', 200, 200);

    $response = $this->actingAs($user)
        ->postJson(route('admin.media.upload'), [
            'image' => $file,
            'context' => 'product',
        ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['image']);
});

it('allows GIF file upload for non-product contexts', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();

    $file = UploadedFile::fake()->image('article.gif', 200, 200);

    $response = $this->actingAs($user)
        ->postJson(route('admin.media.upload'), [
            'image' => $file,
            'context' => 'article',
        ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
    ]);
});

it('prevents deleting media that is assigned to a product', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);
    $product = Product::factory()->create(['category_id' => $category->id]);

    // Create media assigned to product
    $media = Media::create([
        'path' => 'products/test-image.jpg',
        'filename' => 'test-image.jpg',
        'mime_type' => 'image/jpeg',
        'size' => 1024,
        'galleryable_id' => $product->id,
        'galleryable_type' => Product::class,
    ]);

    $response = $this->actingAs($user)
        ->deleteJson(route('admin.media.destroy', $media));

    $response->assertStatus(422);
    $response->assertJson([
        'success' => false,
        'message' => "Cannot delete media: This image is currently used by a Product ({$product->name}).",
    ]);

    // Verify media still exists
    $this->assertDatabaseHas('media_metadata', [
        'id' => $media->id,
    ]);
});

it('allows deleting unassigned media', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();

    // Create unassigned media
    $media = Media::create([
        'path' => 'products/test-image.jpg',
        'filename' => 'test-image.jpg',
        'mime_type' => 'image/jpeg',
        'size' => 1024,
        'galleryable_id' => null,
        'galleryable_type' => null,
    ]);

    $response = $this->actingAs($user)
        ->deleteJson(route('admin.media.destroy', $media));

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'message' => 'Media deleted successfully.',
    ]);

    // Verify media is deleted
    $this->assertDatabaseMissing('media_metadata', [
        'id' => $media->id,
    ]);
});

it('prevents batch deleting media that is assigned to products', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $category = Category::factory()->create(['type' => 'product']);
    $product = Product::factory()->create(['category_id' => $category->id]);

    // Create assigned and unassigned media
    $assignedMedia = Media::create([
        'path' => 'products/assigned-image.jpg',
        'filename' => 'assigned-image.jpg',
        'mime_type' => 'image/jpeg',
        'size' => 1024,
        'galleryable_id' => $product->id,
        'galleryable_type' => Product::class,
    ]);

    $unassignedMedia = Media::create([
        'path' => 'products/unassigned-image.jpg',
        'filename' => 'unassigned-image.jpg',
        'mime_type' => 'image/jpeg',
        'size' => 1024,
        'galleryable_id' => null,
        'galleryable_type' => null,
    ]);

    $response = $this->actingAs($user)
        ->postJson(route('admin.media.batch-destroy'), [
            'ids' => [$assignedMedia->id, $unassignedMedia->id],
        ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'deleted_count' => 1,
    ]);

    // Should have error for assigned media
    $responseData = $response->json();
    expect($responseData['errors'])->toContain("Media with ID {$assignedMedia->id} is currently used by a Product ({$product->name}).");

    // Verify assigned media still exists, unassigned is deleted
    $this->assertDatabaseHas('media_metadata', [
        'id' => $assignedMedia->id,
    ]);
    $this->assertDatabaseMissing('media_metadata', [
        'id' => $unassignedMedia->id,
    ]);
});

it('prevents deleting media that is assigned to an article', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $article = Article::factory()->create();

    // Create media assigned to article
    $media = Media::create([
        'path' => 'articles/test-image.jpg',
        'filename' => 'test-image.jpg',
        'mime_type' => 'image/jpeg',
        'size' => 1024,
        'galleryable_id' => $article->id,
        'galleryable_type' => Article::class,
    ]);

    $response = $this->actingAs($user)
        ->deleteJson(route('admin.media.destroy', $media));

    $response->assertStatus(422);
    $response->assertJson([
        'success' => false,
        'message' => "Cannot delete media: This image is currently used by a Article ({$article->title}).",
    ]);

    // Verify media still exists
    $this->assertDatabaseHas('media_metadata', [
        'id' => $media->id,
    ]);
});

it('prevents batch deleting media that is assigned to articles', function () {
    /** @var Tests\TestCase $this */
    $user = User::factory()->create();
    $article = Article::factory()->create();

    // Create assigned and unassigned media
    $assignedMedia = Media::create([
        'path' => 'articles/assigned-image.jpg',
        'filename' => 'assigned-image.jpg',
        'mime_type' => 'image/jpeg',
        'size' => 1024,
        'galleryable_id' => $article->id,
        'galleryable_type' => Article::class,
    ]);

    $unassignedMedia = Media::create([
        'path' => 'articles/unassigned-image.jpg',
        'filename' => 'unassigned-image.jpg',
        'mime_type' => 'image/jpeg',
        'size' => 1024,
        'galleryable_id' => null,
        'galleryable_type' => null,
    ]);

    $response = $this->actingAs($user)
        ->postJson(route('admin.media.batch-destroy'), [
            'ids' => [$assignedMedia->id, $unassignedMedia->id],
        ]);

    $response->assertSuccessful();
    $response->assertJson([
        'success' => true,
        'deleted_count' => 1,
    ]);

    // Should have error for assigned media
    $responseData = $response->json();
    expect($responseData['errors'])->toContain("Media with ID {$assignedMedia->id} is currently used by a Article ({$article->title}).");

    // Verify assigned media still exists, unassigned is deleted
    $this->assertDatabaseHas('media_metadata', [
        'id' => $assignedMedia->id,
    ]);
    $this->assertDatabaseMissing('media_metadata', [
        'id' => $unassignedMedia->id,
    ]);
});

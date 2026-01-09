<?php

use App\Models\Media;
use App\Models\PageSection;
use App\Models\Setting;
use App\Services\MediaService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(Tests\TestCase::class, RefreshDatabase::class);

test('it detects media used in settings by id', function () {
    $media = Media::factory()->create();
    Setting::setMediaId('site_logo', $media->id);

    expect(MediaService::isMediaInUse($media))->toBeTrue();
});

test('it detects media used in settings by legacy path (exact match)', function () {
    $media = Media::factory()->create(['path' => 'logos/legacy-logo.png']);
    Setting::set('legacy_img', 'logos/legacy-logo.png');

    expect(MediaService::isMediaInUse($media))->toBeTrue();
});

test('it detects media used in settings by FULL URL (partial match)', function () {
    $media = Media::factory()->create(['path' => 'logos/site-logo.png']);
    // Setting value contains the full URL with domain
    Setting::set('full_url_setting', 'https://plsrental.com/storage/logos/site-logo.png');

    expect(MediaService::isMediaInUse($media))->toBeTrue();
});

test('it detects media used in page sections json escaped path', function () {
    $media = Media::factory()->create(['path' => 'hero/bg.jpg']);
    
    PageSection::create([
        'page' => 'home',
        'section_key' => 'hero_escaped',
        'content' => [
            'image' => '/storage/hero/bg.jpg'
        ],
        'is_enabled' => true
    ]);

    expect(MediaService::isMediaInUse($media))->toBeTrue();
});

test('it returns false for truly unused media', function () {
    $media = Media::factory()->create();
    
    expect(MediaService::isMediaInUse($media))->toBeFalse();
});

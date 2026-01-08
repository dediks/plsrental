<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageSection extends Model
{
    protected $fillable = [
        'page',
        'section_key',
        'content',
        'is_enabled',
        'order',
    ];

    protected $casts = [
        'content' => 'array',
        'is_enabled' => 'boolean',
    ];

    public static function getContent(string $page, string $sectionKey, array $default = []): array
    {
        $section = static::where('page', $page)
            ->where('section_key', $sectionKey)
            ->where('is_enabled', true)
            ->first();

        return $section ? $section->content : $default;
    }
}


<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rental extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'address',
        'city',
        'province',
        'country',
        'postal_code',
        'phone',
        'email',
        'website',
        'latitude',
        'longitude',
        'meta_title',
        'meta_description',
        'og_image',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
        ];
    }

    /**
     * Get SEO title with fallback.
     */
    public function getSeoTitle(): string
    {
        return $this->meta_title ?: $this->name;
    }

    /**
     * Get SEO description with fallback.
     */
    public function getSeoDescription(): ?string
    {
        return $this->meta_description ?: $this->description;
    }
}

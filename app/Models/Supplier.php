<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    const TYPE_DISTRIBUTOR = 'distributor';

    const TYPE_DEALER = 'dealer';

    protected $fillable = [
        'name',
        'slug',
        'type',
        'is_published',
        'description',
        'address',
        'city',
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
            'is_published' => 'boolean',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
        ];
    }

    public static function getTypes(): array
    {
        return [
            self::TYPE_DISTRIBUTOR => 'Distributors',
            self::TYPE_DEALER => 'Dealers',
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

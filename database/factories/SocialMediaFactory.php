<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SocialMedia>
 */
class SocialMediaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'platform' => fake()->randomElement(['youtube', 'facebook', 'instagram', 'tiktok', 'whatsapp']),
            'url' => fake()->url(),
            'order' => fake()->numberBetween(0, 100),
            'is_active' => true,
        ];
    }
}

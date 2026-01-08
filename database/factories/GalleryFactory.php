<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Gallery>
 */
class GalleryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'image' => 'gallery/'.fake()->uuid().'.jpg',
            'category' => fake()->randomElement(['Events', 'Installations', 'Products', 'Team']),
            'order' => fake()->numberBetween(0, 100),
        ];
    }
}

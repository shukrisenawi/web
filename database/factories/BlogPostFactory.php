<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory\ \App\Models\BlogPost
 */
class BlogPostFactory extends Factory
{
    protected $model = \App\Models\BlogPost::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'slug' => fake()->unique()->slug(),
            'category' => fake()->word(),
            'author' => fake()->name(),
            'image' => null,
            'excerpt' => fake()->paragraph(),
            'content' => fake()->paragraphs(5, true),
            'published_at' => fake()->date(),
            'is_published' => true,
        ];
    }
}

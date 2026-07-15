<?php

namespace Database\Factories;

use App\Models\Milestone;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Milestone>
 */
class MilestoneFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'title' => $this->faker->sentence(3),
            'note' => $this->faker->sentence(5),
            'due_date' => $this->faker->dateTimeBetween('now', '+60 days')->format('Y-m-d'),
            'is_active' => $this->faker->boolean(30),
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\ActivityLog;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ActivityLog>
 */
class ActivityLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['milestone', 'invoice', 'file', 'ticket', 'project'];

        return [
            'user_id' => User::factory(),
            'project_id' => $this->faker->optional(0.8)->passthrough(Project::factory()),
            'type' => $this->faker->randomElement($types),
            'description' => $this->faker->sentence(8),
        ];
    }
}

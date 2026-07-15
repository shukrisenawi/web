<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $counter = 10;

        return [
            'user_id' => User::factory(),
            'project_id' => $this->faker->optional(0.8)->passthrough(Project::factory()),
            'ticket_no' => 'TKT-'.now()->format('Y').'-'.str_pad((string) $counter++, 3, '0', STR_PAD_LEFT),
            'subject' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['open', 'in_progress', 'resolved']),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
        ];
    }
}

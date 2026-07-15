<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
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
            'project_id' => Project::factory(),
            'invoice_no' => 'INV-'.now()->format('Y').'-'.str_pad((string) $counter++, 3, '0', STR_PAD_LEFT),
            'issue_date' => $this->faker->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'amount' => $this->faker->randomFloat(2, 500, 8000),
            'status' => $this->faker->randomElement(['paid', 'pending', 'overdue']),
        ];
    }
}

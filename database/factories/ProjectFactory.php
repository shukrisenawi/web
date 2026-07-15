<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            'Mobile App Development',
            'Web System',
            'Website Development',
            'Digital Marketing',
            'IT Solutions',
            'Game Development',
        ];

        $statuses = ['in_progress', 'completed', 'on_hold'];

        $titles = [
            'Fintech Mobile App',
            'School Management System',
            'Food Delivery Website',
            'Digital Marketing Campaign',
            'IT Equipment Supply & Setup',
            'E-commerce Platform',
            'Inventory Management System',
            'Corporate Website Redesign',
        ];

        $category = $this->faker->randomElement($categories);
        $title = $this->faker->randomElement($titles);
        $progress = $this->faker->numberBetween(0, 100);

        return [
            'user_id' => User::factory(),
            'title' => $title,
            'category' => $category,
            'description' => $this->faker->paragraph(),
            'progress' => $progress,
            'status' => $this->faker->randomElement($statuses),
            'icon_color' => $this->faker->hexColor(),
        ];
    }
}

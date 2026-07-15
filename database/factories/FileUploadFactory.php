<?php

namespace Database\Factories;

use App\Models\FileUpload;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FileUpload>
 */
class FileUploadFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $files = [
            ['Project Proposal.pdf', '2.4 MB', 'application/pdf'],
            ['Wireframes.zip', '5.7 MB', 'application/zip'],
            ['Brand Guidelines.pdf', '3.1 MB', 'application/pdf'],
            ['API Documentation.pdf', '1.8 MB', 'application/pdf'],
            ['User Manual.docx', '1.2 MB', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        ];

        $file = $this->faker->randomElement($files);

        return [
            'project_id' => Project::factory(),
            'uploaded_by' => User::factory(),
            'filename' => $file[0],
            'path' => 'uploads/'.$this->faker->uuid().'/'.$file[0],
            'size' => $file[1],
            'mime_type' => $file[2],
        ];
    }
}

<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectRequestFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_request_form_submission_creates_user_and_project_request(): void
    {
        $response = $this->post('/request', [
            'company_name' => 'Test Company',
            'contact_name' => 'John Doe',
            'contact_mobile' => '+60 12-345 6789',
            'contact_email' => 'test_feature_20260722@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'appointment_type' => 'Physical',
            'appointment_date' => '2026-07-25',
            'appointment_time' => '10:00AM',
            'message' => 'We need a web system.',
        ]);

        $response->assertRedirect('/projects');
        $this->assertDatabaseHas('users', [
            'email' => 'test_feature_20260722@example.com',
            'name' => 'John Doe',
        ]);
        $this->assertDatabaseHas('project_requests', [
            'company_name' => 'Test Company',
            'contact_email' => 'test_feature_20260722@example.com',
            'appointment_type' => 'Physical',
            'appointment_date' => '2026-07-25',
            'appointment_time' => '10:00AM',
            'message' => 'We need a web system.',
        ]);
    }

    public function test_request_form_validates_required_fields(): void
    {
        $response = $this->post('/request', []);
        $response->assertSessionHasErrors([
            'company_name',
            'contact_name',
            'contact_email',
            'password',
            'appointment_type',
            'appointment_date',
            'appointment_time',
            'message',
        ]);
    }
}

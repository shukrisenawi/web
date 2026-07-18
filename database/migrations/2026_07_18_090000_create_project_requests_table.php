<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();

            // Business Information
            $table->string('company_name');
            $table->text('company_address')->nullable();
            $table->string('industry')->nullable();
            $table->string('contact_name');
            $table->string('contact_mobile')->nullable();
            $table->string('contact_email');

            // Project Requirements
            $table->string('system_type')->nullable();
            $table->text('features')->nullable();
            $table->text('user_roles')->nullable();
            $table->text('integrations')->nullable();

            // Budget & Timeline
            $table->string('budget')->nullable();
            $table->date('deadline')->nullable();
            $table->text('hosting_domain')->nullable();

            // Review & Submit
            $table->text('additional_notes')->nullable();

            $table->string('status')->default('pending');
            $table->timestamps();
        });

        Schema::create('project_request_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_request_id')->constrained('project_requests')->onDelete('cascade');
            $table->string('filename');
            $table->string('path');
            $table->string('size')->nullable();
            $table->string('mime_type')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_request_files');
        Schema::dropIfExists('project_requests');
    }
};

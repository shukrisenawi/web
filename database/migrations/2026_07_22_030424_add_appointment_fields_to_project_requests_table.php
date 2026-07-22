<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_requests', function (Blueprint $table) {
            $table->string('appointment_type')->nullable()->after('contact_email');
            $table->date('appointment_date')->nullable()->after('appointment_type');
            $table->string('appointment_time')->nullable()->after('appointment_date');
        });
    }

    public function down(): void
    {
        Schema::table('project_requests', function (Blueprint $table) {
            $table->dropColumn(['appointment_type', 'appointment_date', 'appointment_time']);
        });
    }
};

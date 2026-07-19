<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('system_type')->nullable()->after('service_type');
            $table->string('system_type_other')->nullable()->after('system_type');
            $table->text('features')->nullable()->after('system_type_other');
            $table->text('user_roles')->nullable()->after('features');
            $table->text('integrations')->nullable()->after('user_roles');
            $table->string('budget')->nullable()->after('integrations');
            $table->date('deadline')->nullable()->after('budget');
            $table->text('hosting_domain')->nullable()->after('deadline');
            $table->text('additional_notes')->nullable()->after('hosting_domain');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'system_type', 'system_type_other', 'features', 'user_roles',
                'integrations', 'budget', 'deadline', 'hosting_domain', 'additional_notes',
            ]);
        });
    }
};

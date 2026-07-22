<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('frontpage_contents', function (Blueprint $table) {
            $columns = [];
            if (Schema::hasColumn('frontpage_contents', 'current_projects')) {
                $columns[] = 'current_projects';
            }
            if (Schema::hasColumn('frontpage_contents', 'current_projects_title')) {
                $columns[] = 'current_projects_title';
            }
            if (Schema::hasColumn('frontpage_contents', 'current_projects_subtitle')) {
                $columns[] = 'current_projects_subtitle';
            }
            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }

    public function down(): void
    {
        Schema::table('frontpage_contents', function (Blueprint $table) {
            $table->json('current_projects')->nullable()->after('projects');
            $table->string('current_projects_title')->nullable()->after('current_projects');
            $table->string('current_projects_subtitle')->nullable()->after('current_projects_title');
        });
    }
};

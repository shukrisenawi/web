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
            $table->text('privacy_policy_content')->nullable()->after('footer_tagline');
            $table->string('privacy_policy_title')->nullable()->after('footer_tagline');
            $table->text('terms_conditions_content')->nullable()->after('privacy_policy_content');
            $table->string('terms_conditions_title')->nullable()->after('privacy_policy_title');
            $table->date('privacy_policy_last_updated')->nullable()->after('privacy_policy_content');
            $table->date('terms_conditions_last_updated')->nullable()->after('terms_conditions_content');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('frontpage_contents', function (Blueprint $table) {
            $table->dropColumn([
                'privacy_policy_content',
                'privacy_policy_title',
                'terms_conditions_content',
                'terms_conditions_title',
                'privacy_policy_last_updated',
                'terms_conditions_last_updated',
            ]);
        });
    }
};

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
        Schema::create('frontpage_contents', function (Blueprint $table) {
            $table->id();
            $table->string('hero_badge')->nullable();
            $table->text('hero_title')->nullable();
            $table->text('hero_subtitle')->nullable();
            $table->string('hero_primary_cta')->nullable();
            $table->string('hero_primary_link')->nullable();
            $table->string('hero_secondary_cta')->nullable();
            $table->string('hero_secondary_link')->nullable();
            $table->string('hero_trusted_text')->nullable();
            $table->string('hero_trusted_subtext')->nullable();
            $table->string('hero_image')->nullable();
            $table->string('services_title')->nullable();
            $table->text('services_subtitle')->nullable();
            $table->json('services')->nullable();
            $table->string('projects_title')->nullable();
            $table->text('projects_subtitle')->nullable();
            $table->json('projects')->nullable();
            $table->string('clients_title')->nullable();
            $table->json('clients')->nullable();
            $table->json('stats')->nullable();
            $table->string('cta_title')->nullable();
            $table->text('cta_subtitle')->nullable();
            $table->string('cta_button')->nullable();
            $table->string('cta_link')->nullable();
            $table->text('footer_tagline')->nullable();
            $table->json('social_links')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('frontpage_contents');
    }
};

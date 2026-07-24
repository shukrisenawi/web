<?php

use App\Models\FrontpageContent;
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
        $content = FrontpageContent::first();

        if (! $content) {
            $content = FrontpageContent::create(FrontpageContent::defaultRecord());
        }

        $defaults = FrontpageContent::defaultRecord();
        $updates = [];

        foreach ($defaults as $key => $value) {
            if (str_ends_with($key, '_hero') || $key === 'hero_avatars') {
                if ($content->{$key} === null) {
                    $updates[$key] = $value;
                }
            }
        }

        if (! empty($updates)) {
            $content->update($updates);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No reversal needed for default data population.
    }
};

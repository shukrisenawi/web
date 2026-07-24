<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $content = DB::table('frontpage_contents')->first();

        if ($content) {
            DB::table('frontpage_contents')->where('id', $content->id)->update([
                'contact_title' => $content->contact_title ?? "Let's start a conversation",
                'contact_email' => $content->contact_email ?? 'hello@kenjutech.com',
                'contact_phone' => $content->contact_phone ?? '+60 12-345 6789',
                'contact_office' => $content->contact_office ?? 'Kuala Lumpur, Malaysia',
            ]);
        }
    }

    public function down(): void
    {
        // No rollback needed for default data population.
    }
};

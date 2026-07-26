<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('frontpage_contents', function (Blueprint $table) {
            $table->string('email_contact_us')->nullable()->after('contact_email');
        });

        $content = DB::table('frontpage_contents')->first();

        if ($content) {
            DB::table('frontpage_contents')->where('id', $content->id)->update([
                'email_contact_us' => $content->email_contact_us ?? $content->contact_email ?? 'hello@kenjutech.com',
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('frontpage_contents', function (Blueprint $table) {
            $table->dropColumn('email_contact_us');
        });
    }
};

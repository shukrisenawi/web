<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('frontpage_contents', function (Blueprint $table) {
            $table->string('invoice_company_name')->nullable()->after('bank_account_number');
            $table->string('invoice_email')->nullable()->after('invoice_company_name');
            $table->string('invoice_contact_no')->nullable()->after('invoice_email');
        });
    }

    public function down(): void
    {
        Schema::table('frontpage_contents', function (Blueprint $table) {
            $table->dropColumn(['invoice_company_name', 'invoice_email', 'invoice_contact_no']);
        });
    }
};

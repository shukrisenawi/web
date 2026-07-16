<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('client')->after('id');
            $table->string('business_address')->nullable()->after('company');
            $table->string('business_no')->nullable()->after('business_address');
            $table->string('whatsapp')->nullable()->after('business_no');
            $table->string('business_reg_no')->nullable()->after('whatsapp');
            $table->json('persons_in_charge')->nullable()->after('business_reg_no');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->string('payment_status')->default('unpaid')->after('status');
            $table->string('service_type')->nullable()->after('category');
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->string('company_name')->nullable()->after('invoice_no');
            $table->text('company_address')->nullable()->after('company_name');
            $table->string('company_no')->nullable()->after('company_address');
            $table->string('payment_url')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'business_address', 'business_no', 'whatsapp', 'business_reg_no', 'persons_in_charge']);
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['payment_status', 'service_type']);
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['company_name', 'company_address', 'company_no', 'payment_url']);
        });
    }
};

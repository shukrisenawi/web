<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // #8 - Update Project: key person + status remark
        Schema::table('projects', function (Blueprint $table) {
            $table->string('key_person')->nullable()->after('description');
            $table->text('status_remark')->nullable()->after('key_person');
        });

        // #5 - Invoice line items
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained('invoices')->onDelete('cascade');
            $table->string('description');
            $table->decimal('amount', 12, 2)->default(0);
            $table->timestamps();
        });

        // #6 - Ticket reply lock logic
        Schema::table('tickets', function (Blueprint $table) {
            $table->string('last_reply_by')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['key_person', 'status_remark']);
        });

        Schema::dropIfExists('invoice_items');

        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn('last_reply_by');
        });
    }
};

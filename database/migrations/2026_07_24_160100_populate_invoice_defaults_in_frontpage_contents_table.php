<?php

use App\Models\FrontpageContent;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $content = FrontpageContent::first();

        if ($content) {
            $content->update([
                'invoice_company_name' => $content->invoice_company_name ?? 'Kenju Tech Sdn Bhd',
                'invoice_email' => $content->invoice_email ?? 'hello@kenju.tech',
                'invoice_contact_no' => $content->invoice_contact_no ?? '',
            ]);
        }
    }

    public function down(): void
    {
        // No reversal needed for default population.
    }
};

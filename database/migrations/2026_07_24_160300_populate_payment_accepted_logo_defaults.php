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
                'payment_logo' => $content->payment_logo ?? '/images/qr.png',
                'payment_accepted_logo' => $content->payment_accepted_logo ?? '/images/logo-payment-accepted.png',
            ]);
        }
    }

    public function down(): void
    {
        // No reversal needed for default population.
    }
};

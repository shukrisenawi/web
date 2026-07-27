<?php

use App\Models\FrontpageContent;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $content = DB::table('frontpage_contents')->first();

        if ($content) {
            $now = now()->toDateString();

            DB::table('frontpage_contents')->where('id', $content->id)->update([
                'privacy_policy_title' => $content->privacy_policy_title ?? 'Privacy Policy',
                'privacy_policy_content' => $content->privacy_policy_content ?? FrontpageContent::defaultPrivacyPolicyContent(),
                'privacy_policy_last_updated' => $content->privacy_policy_last_updated ?? $now,
                'terms_conditions_title' => $content->terms_conditions_title ?? 'Terms & Conditions',
                'terms_conditions_content' => $content->terms_conditions_content ?? FrontpageContent::defaultTermsConditionsContent(),
                'terms_conditions_last_updated' => $content->terms_conditions_last_updated ?? $now,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No rollback needed for default data population.
    }
};
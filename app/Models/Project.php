<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'title', 'category', 'service_type', 'system_type', 'system_type_other', 'features', 'user_roles', 'integrations', 'budget', 'deadline', 'hosting_domain', 'additional_notes', 'description', 'key_person', 'status_remark', 'progress', 'status', 'payment_status', 'icon_color'])]
class Project extends Model
{
    /** @use HasFactory\Database\Factories\ProjectFactory */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'deadline' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(Milestone::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    public function fileUploads(): HasMany
    {
        return $this->hasMany(FileUpload::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    public static function getServices(): array
    {
        return [
            ['value' => 'web_system', 'label' => 'Web System'],
            ['value' => 'website', 'label' => 'Website Development'],
            ['value' => 'mobile_app', 'label' => 'Mobile App Development'],
            ['value' => 'digital_marketing', 'label' => 'Digital Marketing'],
            ['value' => 'it_solutions', 'label' => 'IT Solutions'],
            ['value' => 'game_development', 'label' => 'Game Development'],
        ];
    }

    public static function getSystemTypes(): array
    {
        return [
            ['value' => 'Web System', 'label' => 'Web System'],
            ['value' => 'Website', 'label' => 'Website'],
            ['value' => 'Mobile App', 'label' => 'Mobile App'],
            ['value' => 'E-Commerce', 'label' => 'E-Commerce'],
            ['value' => 'Digital Marketing', 'label' => 'Digital Marketing'],
            ['value' => 'IT Solutions', 'label' => 'IT Solutions'],
            ['value' => 'Game Development', 'label' => 'Game Development'],
            ['value' => 'Other', 'label' => 'Other'],
        ];
    }
}

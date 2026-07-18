<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'user_id',
    'company_name',
    'company_address',
    'industry',
    'contact_name',
    'contact_mobile',
    'contact_email',
    'system_type',
    'features',
    'user_roles',
    'integrations',
    'budget',
    'deadline',
    'hosting_domain',
    'additional_notes',
    'status',
])]
class ProjectRequest extends Model
{
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

    public function files(): HasMany
    {
        return $this->hasMany(ProjectRequestFile::class);
    }
}

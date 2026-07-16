<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'project_id', 'invoice_no', 'issue_date', 'amount', 'status', 'company_name', 'company_address', 'company_no', 'payment_url'])]
class Invoice extends Model
{
    /** @use HasFactory<Database\Factories\InvoiceFactory> */
    use HasFactory;

    public function getRouteKeyName(): string
    {
        return 'invoice_no';
    }

    protected function casts(): array
    {
        return [
            'issue_date' => 'date',
            'amount' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}

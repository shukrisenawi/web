<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

    #[Fillable(['name', 'email', 'password', 'role', 'company', 'industry', 'avatar', 'business_address', 'business_no', 'whatsapp', 'business_reg_no', 'persons_in_charge'])]
    #[Hidden(['password', 'remember_token'])]
    class User extends Authenticatable
    {
        /** @use HasFactory<UserFactory> */
        use HasFactory, Notifiable;

        public const ROLE_ADMIN = 'admin';
        public const ROLE_CLIENT = 'client';

        /**
         * Get the attributes that should be cast.
         *
         * @return array<string, string>
         */
        protected function casts(): array
        {
            return [
                'email_verified_at' => 'datetime',
                'password' => 'hashed',
                'persons_in_charge' => 'array',
            ];
        }

        public function isAdmin(): bool
        {
            return $this->role === self::ROLE_ADMIN;
        }

        public function isClient(): bool
        {
            return $this->role === self::ROLE_CLIENT;
        }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function projectRequests(): HasMany
    {
        return $this->hasMany(ProjectRequest::class);
    }
}

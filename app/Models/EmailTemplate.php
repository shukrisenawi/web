<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailTemplate extends Model
{
    protected $fillable = ['key', 'name', 'subject', 'body', 'is_active'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public static function get(string $key, array $variables = []): array
    {
        $template = static::where('key', $key)->where('is_active', true)->first();

        if (! $template) {
            return [
                'subject' => '',
                'body' => '',
                'found' => false,
            ];
        }

        $subject = $template->subject;
        $body = $template->body;

        foreach ($variables as $placeholder => $value) {
            $subject = str_replace('{{ ' . $placeholder . ' }}', $value, $subject);
            $body = str_replace('{{ ' . $placeholder . ' }}', $value, $body);
            $subject = str_replace('{{' . $placeholder . '}}', $value, $subject);
            $body = str_replace('{{' . $placeholder . '}}', $value, $body);
        }

        $appUrl = rtrim(config('app.url') ?? '', '/');
        $body = preg_replace_callback(
            '/(src|href)=["\'](?!https?:\/\/|\/\/|mailto:|tel:|#)([^"\']+)["\']/i',
            function ($matches) use ($appUrl) {
                $attribute = $matches[1];
                $path = $matches[2];
                $url = str_starts_with($path, '/') ? $appUrl . $path : $appUrl . '/' . $path;

                return $attribute . '="' . $url . '"';
            },
            $body
        );

        return [
            'subject' => $subject,
            'body' => $body,
            'found' => true,
        ];
    }
}

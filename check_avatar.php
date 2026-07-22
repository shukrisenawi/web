<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$users = User::whereNotNull('avatar')->get(['id', 'name', 'avatar']);
if ($users->isEmpty()) {
    echo "No users with avatars found.\n";
    exit;
}
foreach ($users as $u) {
    $url = asset('storage/' . $u->avatar);
    echo "ID: {$u->id} | Name: {$u->name} | Avatar: {$u->avatar} | URL: {$url}\n";
}

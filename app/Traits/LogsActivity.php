<?php

namespace App\Traits;

use App\Models\ActivityLog;

trait LogsActivity
{
    protected function logActivity(
        ?int $userId,
        string $type,
        string $description,
        ?int $projectId = null,
        ?\Illuminate\Database\Eloquent\Model $related = null,
    ): ActivityLog {
        $data = [
            'user_id' => $userId,
            'project_id' => $projectId,
            'type' => $type,
            'description' => $description,
        ];

        if ($related) {
            $data['related_type'] = get_class($related);
            $data['related_id'] = $related->getKey();
        }

        return ActivityLog::create($data);
    }
}

<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Comment extends BaseModel
{
    // articlesテーブルと1対多のリレーション構築(多側の設定)
    public function articles()
    {
        return $this->belongsTo('App\Model\Article');
    }
}

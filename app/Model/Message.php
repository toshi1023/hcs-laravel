<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Message extends BaseModel
{
    // usersテーブルと1対多のリレーション構築(多側の設定)
    public function users()
    {
        return $this->belongsTo('App\Model\User');
    }
}

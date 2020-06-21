<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    // userテーブルと1対多のリレーション構築(多側の設定)
    public function user()
    {
      return $this->belongsTo('App\User');
    }
}

<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Like extends BaseModel
{
  // articlesテーブルと1対多のリレーション構築(多側の設定)
  public function articles()
  {
    return $this->belongsTo('App\Model\Article', 'article_id', 'id');
  }

  // usersテーブルと1対多のリレーション構築(多側の設定)
  public function users()
  {
    return $this->belongsTo('App\Model\User', 'user_id', 'id');
  }
}

<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class ArticleImage extends Model
{
    // articlsテーブルと1対多のリレーション構築(多側の設定)
    public function article()
    {
      return $this->belongsTo('App\Model\Article');
    }
}

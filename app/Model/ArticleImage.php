<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class ArticleImage extends Model
{
  /**
   * 一括割り当て可能な属性
   * モデルに登録したい項目を追加
   *
   * @var array
   */
  protected $fillable = [
    'article_photo_name', 'article_photo_path', 'article_id', 'user_id',
  ];

  // articlsテーブルと1対多のリレーション構築(多側の設定)
  public function article()
  {
    return $this->belongsTo('App\Model\Article');
  }
}

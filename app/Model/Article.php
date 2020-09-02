<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{

  /**
   * 一括割り当て可能な属性
   * モデルに登録したい項目を追加
   *
   * @var array
   */
  protected $fillable = [
    'prefecture', 'title', 'content', 'women_only',
  ];

  // userテーブルと1対多のリレーション構築(多側の設定)
  public function admin()
  {
    return $this->belongsTo('App\Model\Admin');
  }

  // userテーブルと1対多のリレーション構築(多側の設定)
  public function user()
  {
    return $this->belongsTo('App\Model\User');
  }

  // article_imagesテーブルと1対多のリレーション構築(1側の設定)
  public function articleImage()
  {
    return $this->hasMany('App\Model\ArticleImage');
  }
}

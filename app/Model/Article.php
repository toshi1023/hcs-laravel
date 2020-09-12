<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Article extends BaseModel
{

  /**
   * モデルの配列形態に追加するアクセサ(JSON形式で使用できるようにするため)
   *
   * @var array
   */
  protected $appends = ['type_name']; 

  // 公開対象のアクセサ
  public function getTypeNameAttribute()
  {
    if($this->type === config('const.all'))  return config('const.all_name');
    if($this->type === config('const.member')) return config('const.member_name');
  }

  // userテーブルと1対多のリレーション構築(多側の設定)
  public function user()
  {
    return $this->belongsTo('App\Model\User');
  }

  // article_imagesテーブルと1対多のリレーション構築(1側の設定)
  public function article_image()
  {
    return $this->hasMany('App\Model\ArticleImage');
  }
}

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

  // usersテーブルと1対多のリレーション構築(多側の設定)
  public function users()
  {
    return $this->belongsTo('App\Model\User', 'user_id', 'id');
  }

  // article_imagesテーブルと1対多のリレーション構築(1側の設定)
  public function article_images()
  {
    return $this->hasMany('App\Model\ArticleImage');
  }

  // commentsテーブルと1対多のリレーション構築(1側の設定)
  public function comments()
  {
    return $this->hasMany('App\Model\Comment');
  }
  // commentsテーブルと1対1のリレーション構築(1側の設定)
  public function comments_counts()
  {
    return $this->hasOne('App\Model\Comment');
  }

  // likesテーブルと1対多のリレーション構築(1側の設定)
  public function likes()
  {
    return $this->hasMany('App\Model\Like');
  }
  // likesテーブルと1対1のリレーション構築(1側の設定)
  public function likes_counts()
  {
    return $this->hasOne('App\Model\Like');
  }
}

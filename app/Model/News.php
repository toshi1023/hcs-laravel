<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
  /**
   * 一括割り当て可能な属性
   * モデルに登録したい項目を追加
   *
   * @var array
   */
  protected $fillable = [
    'title', 'content', 'status', 'type', 'admin_id',
  ];
}

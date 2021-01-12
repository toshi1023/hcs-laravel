<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Friend extends BaseModel
{

    /**
     * モデルの配列形態に追加するアクセサ(JSON形式で使用できるようにするため)
     *
     * @var array
     */
    protected $appends = ['friend_status_name']; 

    /**
     * フレンドの申請ステータスを日本語名で返す
     * @return string
     */
    public function getFriendStatusNameAttribute() {
        if ($this->status == config('const.apply'))   return config('const.apply_name');
        if ($this->status == config('const.approval'))  return config('const.approval_name');
        if ($this->status == config('const.reject'))  return config('const.reject_name');
    }

    /**
     * usersテーブルと1対多のリレーション構築(多側の設定)
     */
    public function users()
    {
        return $this->belongsTo('App\Model\User');
    }
}

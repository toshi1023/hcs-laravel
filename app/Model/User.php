<?php

namespace App\Model;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Illuminate\Database\Eloquent\Model;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * 一括割り当て可能な属性
     * モデルに登録したい項目を追加
     *
     * @var array
     */
    protected $fillable = [
        'prof_photo', 'photo_path', 'name', 'nickname','prefecture', 'birthday', 'gender', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Articleテーブルと1対多のリレーション構築(1側の設定)
    public function articles()
    {
        return $this->hasMany('App\Model\Article');
    }
}

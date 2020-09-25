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
        'prof_photo_name', 'prof_photo_path', 'name','prefecture', 'birthday', 'gender', 'email', 'password',
    ];

    /**
     * モデルの配列形態に追加するアクセサ(JSON形式で使用できるようにするため)
     *
     * @var array
     */
    protected $appends = ['gender_name', 'status_name']; 

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

    /**
     * 性別を日本語名で返す
     * @return string
     */
    public function getGenderNameAttribute() {
        if ($this->gender == config('const.women'))   return config('const.women_name');
        if ($this->gender == config('const.man'))  return config('const.man_name');
    }

    /**
     * アカウントステータスを日本語名で返す
     * @return string
     */
    public function getStatusNameAttribute() {
        if ($this->status == config('const.available'))   return config('const.available_name');
        if ($this->status == config('const.unavailable'))  return config('const.unavailable_name');
    }

    /**
     * フレンドデータを取得
     */
    public function friends()
    {
        return $this->hasMany('App\Model\Friend');
    }
}

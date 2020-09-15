<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class News extends BaseModel
{
    /**
     * モデルの配列形態に追加するアクセサ(JSON形式で使用できるようにするため)
     *
     * @var array
     */
    protected $appends = ['type_name', 'status_name']; 

    /**
     * 種別を日本語名で返す
     * @return string
     */
    public function getTypeNameAttribute() {
        if ($this->type == config('const.official'))   return config('const.official_name');
        if ($this->type == config('const.alert'))  return config('const.alert_name');
    }

    /**
     * 公開ステータスを日本語名で返す
     * @return string
     */
    public function getStatusNameAttribute() {
        if ($this->status == config('const.private'))   return config('const.private_name');
        if ($this->status == config('const.public'))  return config('const.public_name');
    }
}

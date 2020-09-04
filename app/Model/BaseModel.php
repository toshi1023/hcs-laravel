<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class BaseModel extends Model
{
    // 主キーIDを保存対象から除去
    protected $guarded = ['id'];
}

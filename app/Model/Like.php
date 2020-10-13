<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Like extends BaseModel
{

  public function article()
  {
    return $this->belongsTo('App\Model\Article');
  }

  public function user()
  {
    return $this->belongsTo('App\Model\User');
  }
}

<?php

namespace App\DataProvider;

use Illuminate\Support\Facades\DB;

class BaseRepository 
{
    /* *
    * 指定したデータをすべて取得するメソッド
    * 引数: 検索用テーブル
    * */
    public function getAllQuery($request)
    {
        return DB::table($request);
    }

    /* *
    * データを条件つきで取得するメソッド
    * 引数: 検索用テーブル
    * */
    public function getWhereQuery($request, $conditions=[])
    {
        foreach ($conditions as $key => $value) {
            $conditions[$key] = $key;
            $conditions[$value] = $value;
        }
        
        return DB::table($request)->where($conditions[$key], '=', $conditions[$value])
                                  ->latest('updated_at');
    }
}
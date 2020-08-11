<?php

namespace App\DataProvider;

use App\Model\Article;
use App\Model\User;
use App\Model\Prefecture;

class BaseRepository
{

    protected $article;
    protected $user;
    protected $prefecture;

    protected function __construct(Article $article, User $user, Prefecture $prefecture)
    {
        $this->article = $article;
        $this->user = $user;
        $this->prefecture = $prefecture;
    }

    protected function getModel($table)
    {
        if ($table === 'articles') {
            return $this->article;
        }
        if ($table === 'users') {
            return $this->user;
        }
        if ($table === 'prefectures') {
            return $this->prefecture;
        }
    }

    /* *
    * 指定したデータをすべて取得するメソッド
    * 引数: 検索用テーブル
    * */
    public function getAllQuery($table)
    {
        return $this->getModel($table);
    }

    /**
     * 検索条件作成
     * 引数1: 検索用テーブル, 引数2: 検索条件(array)
     */
    public function getWhereQuery($table, $conditions=[]) {

        foreach($conditions as $key => $value) {
            // 指定したモデルを変数に代入
            $query = $this->getModel($table);
            // dd($this->getModel($table));
            if (preg_match('/@like/', $key)) {
                // LIKE検索
                $query->where(str_replace("@like", "", $key), 'like', '%'.$value.'%');
            } else if (preg_match('/@not/', $key)) {
                // NOT検索
                $query->where(str_replace("@not", "", $key), '!=', $value);
            } else if (preg_match('/@>=/', $key)) {
                // 大なりイコール
                $query->where(str_replace("@>=", "", $key), '>=', $value);
            } else if (preg_match('/@<=/', $key)) {
                // 小なりイコール
                $query->where(str_replace("@<=", "", $key), '<=', $value);
            } else if (preg_match('/@</', $key)) {
                // 大なり
                $query->where(str_replace("@<", "", $key), '<', $value);
            } else if (preg_match('/@>/', $key)) {
                // 小なり
                $query->where(str_replace("@>", "", $key), '>', $value);
            } else if (preg_match('/@in/', $key)) {
                // IN
                $query->whereIn(str_replace("@in", "", $key), $value);
            } else if (preg_match('/@not_in/', $key)) {
                // NotIN
                $query->whereNotIn(str_replace("@not_in", "", $key), $value);
            } else if (preg_match('/@and_or/', $key)) {
                // And-OR
                // ※この場合のみ「value」部分は「value1==value2」と指定すること
                $values = explode('==', $value);
                $query->where(function($query) use($key, $values) {
                    foreach($values as $val) {
                        // ※判定値がnullの場合はWhereNullで判定
                        if ($val == "null") {
                            $query->orWhereNull(str_replace("@and_or", "", $key));
                        } else {
                            $query->orWhere(str_replace("@and_or", "", $key), $val);
                        }
                    }
                });
            } else if (preg_match('/@is_null/', $key)) {
                // Is Null
                $query->whereNull(str_replace("@is_null", "", $key), $value);
            } else if (preg_match('/@is_not_null/', $key)) {
                // Is Not Null
                $query->whereNotNull(str_replace("@is_not_null", "", $key), $value);
            } else if (preg_match('/@custom/', $key)) {
                // カスタム条件
                // ※value値にquerybuilderで成形したものを設定する
                $query = $value;
            } else if (preg_match('/@multiple/', $key)) {
                foreach($value as $data) {
                    $query->where(function($query) use($data) {
                        foreach($data as $k => $val) {
                            $query->orWhere($k, 'LIKE', '%'.$val.'%');
                        }
                    });
                }
            } else {
               // 通常検索
               $query->where($key, $value);
            }
        }
        return $query;
    }

    /**
    * 削除用メソッド
    * 引数1:テーブル名, 引数2:削除データのID
    * */
    public function destroy($table, $id)
    {
        try {
            //  対象の記事を削除
            DB::table($table)->where('id', '=', $id)->delete();
            return true;
        } catch (\Exception $e) {
            \Log::error($table.' destroy error:'.$e->getmessage());
            return false; 
        }
    }
}
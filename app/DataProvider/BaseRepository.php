<?php

namespace App\DataProvider;

use App\Model\Article;
use App\Model\ArticleImage;
use App\Model\Admin;
use App\Model\User;
use App\Model\Prefecture;

class BaseRepository
{
    protected $model;
    protected $article;
    protected $articleImage;
    protected $admin;
    protected $user;
    protected $prefecture;

    protected function model()
    {
        return $this->model;
    }

    /**
     * 特定のモデルをインスタンス化
     * 引数:テーブル名
     */
    protected function getModel($table)
    {
        // 指定したテーブルをインスタンス化して返す
        return $this->model = app()->make($table);
    }

    /* *
    * 指定したデータをすべて取得するメソッド
    * 引数: テーブル名
    * */
    public function getAllQuery($table)
    {
        return $this->getModel($table)->select($table.'.*');
    }

    /**
     * 検索条件作成
     * 引数1: テーブル名, 引数2: 検索条件(array)
     */
    public function getWhereQuery($table=null, $conditions=[]) {
        // 指定したモデルを変数に代入
        if($table) {
            $query = $this->getModel($table)->select($table.'.*');
        } else {
            $query = $this->model;
        }
        
        foreach($conditions as $key => $value) {
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
     * 指定ID検索
     * 引数1:テーブル名, 引数2:ID
     */
    public function find($model, $id) {
        return $model::query()->where('id', $id)->first();
    }


    /**
    * 保存用メソッド
    * 引数1:テーブル名, 引数2:データ, 引数3:トランザクションフラグ(同一アクションで複数テーブルを保存する場合はfalseにする)
    * */
    public function save($table=null, $data, $transaction=true)
    {
        if ($transaction) \DB::beginTransaction();

        try {
            if($table) {
                $model = $this->getModel($table);
            } else {
                $model = $this->model;
            }
            // 作成・更新日時を取得
            $now = Carbon::now();
        
            // Updateかどうか判別
            if (key_exists('id', $data) && $data['id']) {
                $model = $this->find($model, $data["id"]);
                // 更新日時を格納
                $model->updated_at = $now;
            } else {
                // 作成日時を格納
                $model->created_at = $now;
            }

            // データを保存
            $model->fill($data);
            $model->save();

            // コミット
            if ($transaction) \DB::commit();

        } catch (\Exception $e) {
            if ($transaction) \DB::rollBack();
            \Log::error('database save error:'.$e->getMessage());
            throw new \Exception($e);
        }
    }

    /**
    * 削除用メソッド
    * 引数1:テーブル名, 引数2:削除データのID
    * */
    public function destroy($table=null, $id)
    {
        try {
            //  対象の記事を削除
            if($table) {
                $this->getModel($table)->where('id', '=', $id)->delete();
            } else {
                $this->model->where('id', '=', $id)->delete();
            }
            return true;
        } catch (\Exception $e) {
            \Log::error($table.' destroy error:'.$e->getmessage());
            return false; 
        }
    }
}
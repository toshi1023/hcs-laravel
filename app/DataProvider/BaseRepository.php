<?php

namespace App\DataProvider;

use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Storage;
use Exception;

class BaseRepository
{
    protected $model;
    protected $folder;

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
    * 引数1: テーブル名, 引数2: 検索条件, 引数4: 削除フラグのON・OFF
    * */
    public function getQuery($table=null, $conditions=[], $delete_flg=true)
    {
        // 指定したモデルを変数に代入
        if($table) {
            $query = $this->getModel($table);
        } else {
            $query = $this->model;
        }
        // テーブル名の取得
        $table_name = $query->getTable();
        
        // 削除フラグがtrueの値を排除するか否か
        if($delete_flg) {
            $query = $query->addSelect($table_name.'.*')->where($table_name.'.delete_flg', '=', 0);
        } else {
            // メインテーブルのデータをすべて取得
            $query = $query->addSelect($table_name.'.*');
        }

        // 検索条件があれば絞り込み
        if($conditions) {
            $query = self::getWhereQuery(null, $conditions, $query);
        }

        return $query;
    }

    /**
     * 検索条件作成
     * 引数1: テーブル名, 引数2: 検索条件(array), 引数3: クエリ途中のデータ
     */
    public function getWhereQuery($table=null, $conditions=[], $query=null) {

        // クエリ途中のデータが無ければ、指定したモデルを変数に代入
        if(!$query) {
            if($table) {
                $query = $this->getModel($table)->select($table.'.*');
            } else {
                $query = $this->model->getTable()->select('.*');
            }
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
     * 外部キーのname取得(idを結合条件としている場合のみ適用)
     * 引数1:テーブル名, 引数2: [モデルの結合メソッド => 結合先の外部キー]
     */
    public function getNameQuery($table=null, $relation=[]) {
        // 指定したモデルを変数に代入
        if($table) {
            $query = $this->getModel($table);
        } else {
            $query = $this->model;
        }

        foreach($relation as $key => $condition) {
            // リレーション(結合先のnameは'{テーブル名}_name'に設定)
            $query = $query->with([$key.':'.$condition.',name as '.$key.'_name']);

            return $query;
        }
        return $query;
    }

    /**
     * 指定ID検索
     * 引数1:モデルのインスタンス名, 引数2:ID
     */
    public function getFind($model, $id) {
        return $model::query()->where('id', '=', $id)->first();
    }

    /**
     * 指定ID検索(boolean)
     * 引数1:テーブル名, 引数2:検索条件(配列)
     */
    public function getExist($table, $conditions) {
        return $this->getWhereQuery($table, $conditions)->exists();
    }


    /**
    * fillableに登録されているデータの保存用メソッド
    * 引数1:データ, 引数2:テーブル名, 引数3:トランザクションフラグ(同一アクションで複数テーブルを保存する場合はfalseにする)
    * */
    public function getSave($data, $table=null, $transaction=true)
    {
        if ($transaction) \DB::beginTransaction();
        try {
            if($table) {
                $model = $this->getModel($table);
            } else {
                $model = $this->model;
            }
        
            // Updateかどうか判別
            if (key_exists('id', $data) && $data['id']) {
                $model = $this->getFind($model, $data['id']);
            }
            
            // データを保存
            $model->fill($data);
            $model->save();

            // コミット
            if ($transaction) \DB::commit();
            
            // リターン
            return $model;
        } catch (Exception $e) {
            \Log::error('database save error:'.$e->getMessage());
            if ($transaction) \DB::rollBack();
            throw new Exception($e);
        }
    }

    /**
     * ファイルアップロード用メソッド
     * 第一引数:ファイル, 第二引数:フォルダ名に使用するための値, 第三引数：ファイル名
     */
    public function fileSave($file, $foldername, $filename)
    {
        if ($file){
            try {
                //s3アップロード開始
                // バケットの`aws-hcs-image/{テーブル名}/{ニックネーム名}`フォルダへアップロード
                $path = Storage::disk('s3')->putFileAs(config('const.aws_'.$this->folder.'_bucket').'/'.$foldername, $file, $filename, 'public');
                // アップロードしたファイルのURLを取得し、DBにセット
                $photo_path = Storage::disk('s3')->url($path);

                return [true, $photo_path];

            } catch (Exception $e) {
                \Log::error($this->folder.' image file save error:'.$e->getmessage());
                return [false, null];
            }
        } else {
            // アップロードファイルがなければデフォルトの画像を設定
            return [true, env('AWS_NOIMAGE')];
        }
    }

    /**
    * 削除用メソッド
    * 引数1:削除データのID, 引数2:テーブル名, 引数3:トランザクションフラグ
    * */
    public function getDestroy($id, $table=null, $transaction=true)
    {
        if ($transaction) \DB::beginTransaction();

        try {
            //  対象の記事を削除
            if(is_null($table)) {
                // メインテーブルのモデルからデータを取得
                $data = $this->getFind($this->model, $id);
            } else {
                // $tableにテーブル名の指定があれば対応したモデルからデータを取得
                $data = $this->getFind($this->getModel($table), $id);
            }

            $data->delete_flg = 1;
            $data->save();

            // テーブル名の取得
            $table_name = $data->getTable();
             // 画像パスがDBに保存されている場合は削除
            if ($data[$table_name.'_photo_path']) {
                $this->fileDelete($data[$table_name.'_photo_path']);
            }

            if ($transaction) \DB::commit();
            return true;
        } catch (Exception $e) {
            if ($transaction) \DB::rollBack();
            \Log::error($table.' destroy error:'.$e->getmessage());
            return false; 
        }
    }

    /**
     * ファイル削除用メソッド
     * 引数:ファイルパス
     */
    public function fileDelete($path)
    {
        try {
            // ファイルの削除を実行
            $file = Storage::disk('s3');
            $file->delete($path);
            return true;
        } catch (Exception $e) {
            \Log::error('image file delete error:'.$e->getmessage());
            \Log::error('image file at '.$path);
            return false;     
        }
    }
}
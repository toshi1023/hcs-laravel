<?php

namespace App\DataProvider;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository
{
    protected $model;

    /**
     * メインModel
     * @return Model
     */
    public function model()
    {
        return $this->model;
    }

    /**
     * 全件検索(論理削除されていないもの)
     * @return BaseModel[]|\Illuminate\Database\Eloquent\Collection
     */
    public function all()
    {
        return $this->model()::query()->get();
    }
    /**
     * 指定ID検索
     * @param $id
     * @return mixed
     */
    public function find($id)
    {
        return $this->model()::query()->where('id', $id)->first();
    }

    /**
     * テーブルの件数取得
     * @return int
     */
    public function count()
    {
        return $this->model()::query()->count();
    }
    /**
     * テーブルに指定IDデータが存在するかどうか
     * @param $id
     * @return mixed
     */
    public function exists($id)
    {
        return $this->model()::query()->where('id', $id)->exists();
    }
    /**
     * 指定条件で検索し、存在するかどうか
     * @param array $conditions
     * @param array $order
     * @param array $relation
     * @return mixed
     */
    public function searchExists($conditions=[], $order=[], $relation=[])
    {
        return $this->searchQuery($conditions, $order, $relation)->exists();
    }
    /**
     * 指定条件で検索し、1件取得
     * @param array $conditions
     * @param array $order
     * @param array $relation
     * @return mixed
     */
    public function searchOne($conditions=[], $order=[], $relation=[])
    {
        return $this->searchQuery($conditions, $order, $relation)->first();
    }

    /**
     * 指定条件で検索し、リストで取得
     * @param array $conditions
     * @param array $order
     * @param array $relation
     * @param int $limit
     * @param int $offset
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection
     */
    public function searchList($conditions=[], $order=[], $relation=[], $limit=0, $offset=0)
    {
        return $this->searchQuery($conditions, $order, $relation, $limit, $offset)->get();
    }

    /**
     * ページャー指定のデータ取得
     * @param array $conditions
     * @param array $order
     * @param array $relation
     * @param $count
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function searchPaginate($conditions=[], $order=[], $relation=[], $count)
    {
        return $this->searchQuery($conditions, $order, $relation, 0, 0)->paginate($count);
    }
    /**
     * 指定条件で検索し、件数を取得
     * @param array $conditions
     * @param array $order
     * @param array $relation
     * @return int
     */
    public function searchCount($conditions=[], $order=[], $relation=[])
    {
        return $this->searchQuery($conditions, $order, $relation)->count();
    }

    /**
     * 指定条件での検索(複数取得)
     * @param array $conditions(検索条件)
     *      (例)：　$conditions[] = ['key' => $value]
     *             key は条件によって、オプション付与可能
     *              (例)： 'name@like' @likeを付与し、like検索が可能
     * @param array $order(ソート条件)
     *      (例)：　$order[] = ['key' => 'desc' or 'asc']
     * @param array $relation(リレーション先名称)
     *      (例)：　$relation[] = ['store' => [], 'user' => ['del_flg' => 0]]
     *              リレーション先テーブルに条件を加える場合は、下記参照
     * @param int $limit(取得件数)
     * @param int $offset(取得開始地点)
     * @return \Illuminate\Database\Eloquent\Builder|mixed
     */
    public function searchQuery($conditions=[], $order=[], $relation=[], $limit=0, $offset=0)
    {
        $query = $this->model()::query();
        // メインテーブルSELECT
        $query->select($this->model()->getTable().".*");

        // 検索条件
        $query = self::getConditions($query, $this->model()->getTable(), $conditions);
        // リレーション条件
        foreach($relation as $key => $condition) {
            // リレーション
            $query->with($key);
            // 条件なしの場合は通常のリレーションと同じ
            if ($condition) {
                // リレーション先条件指定
                $query->whereIn($condition['owner_key'], function ($query) use($condition) {
                    $query->select($condition['foreign_key'])->from($condition['table']);
                    self::getConditions($query, $condition['table'], $condition['condition'], false);
                });
            }
        }
        // ソート条件
        foreach($order as $key => $value) {
            // カスタムオーダーの場合
            if (preg_match('/@custom/', $key)) {
                $query->orderByRaw($value);
            } else {
                $query->orderBy($key, $value);
            }
        }
        // 件数指定あれば設定
        if ($limit > 0) {
            $query->limit($limit);
        }
        // 指定位置あれば設定
        if ($offset > 0) {
            $query->offset($offset);
        }

        return $query;
    }

    /**
     * 指定データ保存
     * @param $data
     * @param bool $transaction
     * @return Model|mixed
     * @throws \Exception
     */
    public function baseSave($data, $transaction=false)
    {
        if ($transaction) \DB::beginTransaction();

        try {
            // 同じ日時変数を使用する
            $now = Carbon::now();
            if (key_exists('id', $data) && $data['id']) {
                // UPDATE
                $model = $this->find($data["id"]);
            } else {
                // INSERT
                $model = $this->newModel();
            }
            // ※fillメソッド使用時は、updated_atが必須となるため
            $model->timestamps = false;
            $model->fill($data);
            $model->save();
            if ($transaction) \DB::commit();
            return $model;
        } catch (\Exception $e) {
            if ($transaction) \DB::rollBack();
            \Log::error('database save error:'.$e->getMessage());
            throw new \Exception($e);
        }
    }

    /**
     * 指定IDデータ削除
     * @param $id
     * @param bool $transaction
     * @return mixed
     * @throws \Exception
     */
    public function remove($id, $transaction=false)
    {
        if ($transaction) \DB::beginTransaction();
        try {
            $model = $this->find($id);
            $model->delete();
            if ($transaction) \DB::commit();
            return $model;
        } catch (\Exception $e) {
            if ($transaction) \DB::rollBack();
            \Log::error('database remove error:'.$e->getMessage());
            throw new \Exception($e);
        }
    }

    /**
     * 検索条件作成
     * @param $query
     * @param $table
     * @param array $conditions
     * @param bool $del_flg
     * @return mixed
     */
    protected function getConditions($query, $table, $conditions=[], $del_flg = true)
    {
        $table = $table.".";

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
     * 全件削除　※ロールバック不可
     */
    public function truncate()
    {
        $this->model()::query()->truncate();
    }

}
<?php

namespace App\Service\Web;

use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use App\DataProvider\DatabaseInterface\UserDatabaseInterface;
use Storage;

class UserService
{

  protected $UserService;
  
  /* DBリポジトリのインスタンス化 */
  public function __construct(UserDatabaseInterface $service)
  {
    $this->UserService = $service; 
  }

  /**
   * 保存データを配列化にするメソッド
   * 引数：保存データ
   */
  public function getArray($data)
  {
    // id
    $data->id ? $data['id'] = $data->id : '';
    // name
    $data->name ? $data['name'] = $data->name : '';
    // password
    $data->password ? $data['password'] = $data->password : '';
    // email
    $data->email ? $data['email'] = $data->email : '';
    // birthday
    $data->birthday ? $data['birthday'] = $data->birthday : '';
    // gender
    $data->gender ? $data['gender'] = $data->gender : '';

    return $data;
  }

  /**
   * Indexページ用データを取得するメソッド
   * 引数：検索用テーブル
   */
  public function getIndex($table=null)
  {
    // 全ユーザデータを更新日時順にソートして取得
    // dd($this->UserService->getQuery([], ['articles' => 'user_id'])->get());
    return $this->UserService->getQuery($table)->get();

  }

  /* *
   * Showページ用データを取得するメソッド
   * 引数: ユーザID
   * */
  public function getShow($id)
  {
    return $this->UserService->getWhereQuery('users', ['id' => $id])->first();
  }

  /* *
   * createページ用データを取得するメソッド
   * 引数: 検索用テーブル
   * */
  public function getCreate($table)
  {
    return $this->UserService->getQuery($table);
  }

  /* *
   * editページ用データを取得するメソッド
   * 引数: 自身のID
   * */
  public function getEdit($id)
  {
    $data['user'] = $this->UserService->getWhereQuery('users', ['id' => $id])->first();
    $data['prefectures'] = $this->UserService->getQuery('prefectures')->get();

    return $data;
  }
  
  /* *
   * 新規ユーザ保存用メソッド
   * 第一引数:登録データ, 第二引数:ファイル名
   * */
  public function save($data, $filename)
  {
    // $data = $this->getArray($data);
    // return $this->UserService->save($data, $filename);
    return  $this->getArray($data);
  }

  /*
  ファイルアップロード用メソッド
  第一引数:ファイル, 第二引数:フォルダ名に使用するための値
  */
  public function filestore($file, $foldername)
  {
    return $this->UserService->filestore($file, $foldername);
  }

  /*
  ファイル削除用メソッド
  引数:ファイルパス
  */
  public function fileDelete($request)
  {
    return $this->UserService->fileDelete($request);
  }

  /**
   * 都道府県情報の取得
   * 引数：テーブル名
   */
  public function getPrefecturesQuery($table)
  {
    return $this->UserService->getQuery($table)->get();
  }

}

<?php

namespace App\Service;

use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use App\DataProvider\UserDatabaseInterface;
use Storage;

class UserService
{

  protected $UserService;
  
  /* DBリポジトリのインスタンス化 */
  public function __construct(UserDatabaseInterface $service)
  {
    // $this->UserService = app()->make(DatabaseInterface::class);
    $this->UserService = $service;
    
  }

  /**
   * Indexページ用データを取得するメソッド
   * 引数：検索用テーブル
   */
  public function getIndex($request)
  {
    // 全ユーザデータを更新日時順にソートして取得
    return $this->UserService->getAllQuery($request);

  }

  /* *
   * Showページ用データを取得するメソッド
   * 引数: ユーザID
   * */
  public function getShow($request)
  {
    return $this->UserService->getShow($request);
  }

  /* *
   * createページ用データを取得するメソッド
   * 引数: 検索用テーブル
   * */
  public function getCreate($request)
  {
    return $this->UserService->getAllQuery($request);
  }

  /* *
   * editページ用データを取得するメソッド
   * 引数: 自身のID
   * */
  public function getEdit($request)
  {
    return $this->UserService->getEdit($request);
  }
  
  /* *
   * ユーザ保存用メソッド
   * 第一引数:登録データ, 第二引数:ファイル名 ,第三引数:ファイルデータ
   * */
  public function save($data, $filename, $file)
  {
    return $this->UserService->save($data, $filename, $file);
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

}

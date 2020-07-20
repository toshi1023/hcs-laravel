<?php

namespace App\Service;

use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use App\DataProvider\DatabaseInterface;
use Storage;

class UserService
{

  protected $UserService;
  
  /* DBリポジトリのインスタンス化 */
  public function __construct(DatabaseInterface $service)
  {
    // $this->UserService = app()->make(DatabaseInterface::class);
    $this->UserService = $service;
    
  }

  /* Index用データ取得メソッド */
  public function getIndex()
  {
    // 全ユーザデータを更新日時順にソートして取得
    return $this->UserService->getIndex();

  }

  /* *
   * Showページ用データを取得するメソッド
   * 引数: ユーザID
   * */
  public function getShow($request)
  {

  }

  /* *
   * editページ用データを取得するメソッド
   * 引数: 自身のID
   * */
  public function getEdit($request)
  {

  }
  
  /* *
   * ユーザ保存用メソッド
   * 第一引数:登録データ, 第二引数:ファイル名 ,第三引数:ファイルデータ
   * */
  public function save($data, $filename, $file)
  {

  }

  /*
  ファイルアップロード用メソッド
  第一引数:ファイル, 第二引数:フォルダ名に使用するための値
  */
  public function filestore($file, $foldername)
  {

  }

  /*
  ファイル削除用メソッド
  引数:ファイルパス
  */
  public function fileDelete($request)
  {

  }

  

}

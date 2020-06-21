<?php

namespace App\Service;

use App\Model\User;
use Illuminate\Support\Facades\Hash;
use Storage;

class UserService
{
  // モデル操作用の変数を宣言
  protected $model;

  public function __construct(){
    // Userモデルをインスタンス化
    $this->model = new User();
  }

  /*
  ユーザ保存用メソッド
  第一引数:保存対象データ(配列形式), 第二引数:ファイル名
  */
  public function save($data, $filename){

    $image = null;

    // 画像データを変数に代入
    if($data['prof_photo']){
      $image = $data['prof_photo'];
    }


    // 画像をアップロードDBにセット
    if ($this->fileStore($image, $filename)[0]){

      $this->model->name       = $data['name'];
      $this->model->nickname   = $data['nickname'];
      $this->model->prefecture = $data['prefecture'];
      $this->model->birthday   = $data['birthday'];
      $this->model->gender     = $data['gender'];
      $this->model->email      = $data['email'];
      $this->model->password   = Hash::make($data['password']);

      $this->model->save();
      return true;

    } else {
      return false;
    }
  }

  /*
  ファイルアップロード用メソッド
  第一引数:ファイル, 第二引数:ファイル名
  */
  public function fileStore($image, $filename){

    if ($image){
      try {
        //s3アップロード開始
        // バケットの`my-rails-app-hcs-first-bucket`フォルダへアップロード
        $path = Storage::disk('s3')->putFile('my-rails-app-hcs-first-bucket', $image, 'public');
        // アップロードした画像のURLを取得し、DBにセット
        $this->model->photo_path = Storage::disk('s3')->url($path);
        $this->model->prof_photo = $filename;
      } catch (\Exception $e) {
        return [false, $e];
      }
      return [true, null];
    } else {
      // 画像がなければ処理は実行しない
      return [true, null];
    }
  }

}

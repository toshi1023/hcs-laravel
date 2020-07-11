<?php

namespace App\Service;

use App\Service\DatabaseInterface;
use App\Model\User;
use App\Model\Prefecture;
use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use Storage;

class UserService implements DatabaseInterface
{

  protected $user;
  protected $prefecture;

  /* モデルのインスタンス化 */
  public function __construct(User $user, Prefecture $prefecture)
  {
    $this->user = $user;
    $this->prefecture = $prefecture;
  }

  /* indexページ用データ取得メソッド */
  public function getIndex()
  {
    $this->user->latest('updated_at');
    
    return $this->user;
  }

  /* Showページ用データを取得するメソッド */
  public function getShow($request)
  {
    $this->user->where('id', $request);

    return $this->user;
  }

  /* Editページ用データを取得するメソッド */
  public function getEdit($request)
  {

  }

  /* データを条件つきで取得するメソッド */
  public function getWhereQuery($conditions=[])
  {
    foreach ($conditions as $key => $value) {
      $conditions[$key] = $key;
      $conditions[$value] = $value;
    }
    
    $this->user->where($conditions[$key], '=', $conditions[$value])
                  ->latest('updated_at');

    return $this->user;

  }

  /*
  ユーザ保存用メソッド
  第一引数:登録データ, 第二引数:ファイル名 ,第三引数:ファイルデータ
  */
  public function save($data, $filename, $file)
  {

    // ファイル名が設定されていなければ統一名を代入
    if (!$filename) {
      // ファイル名を変数に代入
      $filename = 'NoImage';
    }

    // 画像をアップロード
    $file_upload = $this->fileStore($file, $data['nickname']);

    // 画像をアップロードしDBにセット
    if ($file_upload[0]){

      return User::create([
        'prof_photo' => $filename,
        'photo_path' => $file_upload[1],
        'name'        => $data['name'],
        'nickname'    => $data['nickname'],
        'prefecture'  => $data['prefecture'],
        'birthday'    => $data['birthday'],
        'gender'      => $data['gender'],
        'email'       => $data['email'],
        'password'    => Hash::make($data['password']),
      ]);
    }
  } 

  /*
  ファイルアップロード用メソッド
  第一引数:ファイル, 第二引数:フォルダ名に使用するための値
  */
  public function fileStore($file, $foldername)
  {

    if ($file){
      try {
        //s3アップロード開始
        // バケットの`my-rails-app-hcs-first-bucket/{ニックネーム名}`フォルダへアップロード
        $path = Storage::disk('s3')->putFile('my-rails-app-hcs-first-bucket/'.$foldername, $file, 'public');
        // アップロードしたファイルのURLを取得し、DBにセット
        $photo_path = Storage::disk('s3')->url($path);

      } catch (\Exception $e) {
        return [false, null];
      }
      return [true, $photo_path];
    } else {
      // アップロードファイルがなければデフォルトの画像を設定
      return [true, Consts::NO_IMAGE];
    }
  }

  /*
  ファイル削除用メソッド
  引数:ファイルパス
  */
  public function fileDelete($request)
  {
    try {
      // ファイルの削除を実行
      $file = Storage::disk('s3');
      $file->delete($request);
      return true;

    } catch (\Exception $e) {
      
      return false;
      
    }
    
  }

}

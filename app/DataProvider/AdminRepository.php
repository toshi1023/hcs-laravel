<?php

namespace App\DataProvider;

use App\DataProvider\DatabaseInterface\AdminDatabaseInterface;
use App\Model\Admin;
use App\Model\Prefecture;
use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use Storage;

class AdminRepository extends BaseRepository implements AdminDatabaseInterface
{
    protected $user;
    protected $prefecture;

    public function __construct (Admin $admin, Prefecture $prefecture)
    {
        // Adminモデルをインスタンス化
        $this->admin = $admin;

        // Prefectureモデルをインスタンス化
        $this->prefecture = $prefecture;
    }

    /**
     * ユーザ保存用メソッド
     * 第一引数:登録データ, 第二引数:ファイル名, 第三引数:更新対象データ(新規保存の場合はnull)
     */
    public function save($data, $filename, $updateData = null)
    {
        try{
            // 更新対象データが空でない場合は、アップデート処理を実行
            if (!empty($updateData)) {
                if (!empty($filename)) {
                    // 画像をアップロード
                    $file_upload = $this->fileStore($data['prof_photo'], $data['nickname']);
                    $updateData->prof_photo_name = $filename;
                    $updateData->prof_photo_path = $file_upload[1];
                }
                $updateData->name       = $data['name'];
                $updateData->nickname   = $data['nickname'];
                $updateData->prefecture = $data['prefecture'];
                $updateData->birthday   = $data['birthday'];
                $updateData->gender     = $data['gender'];
                $updateData->email      = $data['email'];
                $updateData->password   = Hash::make($data['password']);
                $updateData->save();

                return true;
            }
            
            // ファイル名が設定されていなければ統一名を代入
            if (!$filename) {
            // ファイル名を変数に代入
                $filename = 'NoImage';
            }

            // 画像をアップロード
            $file_upload = $this->fileStore($data['prof_photo'], $data['nickname']);
            
            // 画像をアップロードしDBにセット
            if ($file_upload[0]){
                $this->admin->name        = $data['name'];
                $this->admin->nickname    = $data['nickname'];
                $this->admin->prefecture  = $data['prefecture'];
                $this->user->birthday    = $data['birthday'];
                $this->user->gender      = $data['gender'];
                $this->user->email       = $data['email'];
                $this->user->password    = Hash::make($data['password']);
                
                $this->user->save();
            }
            return true;
        } catch (\Exception $e) {
            \Log::error('database register error:'.$e->getMessage());
            return false;
        }
    } 
}
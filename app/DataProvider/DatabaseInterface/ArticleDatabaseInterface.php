<?php 

namespace App\DataProvider\DatabaseInterface;

/* DBに関する処理を設定 */
interface ArticleDatabaseInterface {

    // 一覧に表示するデータの取得処理を記述
    public function getBaseData();

    // ファイルをアップロードする処理を記述
    public function fileSave($file, $foldername);

    // アップロードしたファイルを削除する処理を記述
    public function fileDelete($request);
    
}
<?php 

namespace App\DataProvider\DatabaseInterface;

/* DBに関する処理を設定 */
interface ArticleDatabaseInterface {

    // DBに保存する処理を記述
    public function save($data, $filename, $file);

    // ファイルをアップロードする処理を記述
    public function filestore($file, $foldername);

    // アップロードしたファイルを削除する処理を記述
    public function fileDelete($request);
    
}
<?php 

namespace App\DataProvider;

/* DBに関する処理を設定 */
interface ArticleDatabaseInterface {

    // Index用データを取得するメソッド
    public function getIndex();

    // Showページ用データを取得するメソッド
    public function getShow($request);

    // Editページ用データを取得するメソッド
    public function getEdit($request);
    
    // DBに保存する処理を記述
    public function save($data, $filename, $file);

    // ファイルをアップロードする処理を記述
    public function filestore($file, $foldername);

    // アップロードしたファイルを削除する処理を記述
    public function fileDelete($request);
    
}
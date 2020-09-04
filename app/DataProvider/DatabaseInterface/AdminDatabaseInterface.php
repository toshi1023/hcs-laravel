<?php 

namespace App\DataProvider\DatabaseInterface;

/* DBに関する処理を設定 */
interface AdminDatabaseInterface {
    
    // DBに保存する処理を記述
    public function save($data, $filename, $file);
    
}
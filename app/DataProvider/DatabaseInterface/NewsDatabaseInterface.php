<?php 

namespace App\DataProvider\DatabaseInterface;

/* DBに関する処理を設定 */
interface NewsDatabaseInterface {
    
    // 一覧に表示するデータの取得処理を記述
    public function getBaseData($conditions);
}
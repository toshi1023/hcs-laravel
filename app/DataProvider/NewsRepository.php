<?php

namespace App\DataProvider;

use App\DataProvider\DatabaseInterface\NewsDatabaseInterface;
use App\Model\News;
use App\Consts\Consts;
use Illuminate\Support\Facades\Hash;
use Storage;

class NewsRepository extends BaseRepository implements NewsDatabaseInterface
{
    public function __construct (News $news)
    {
        // Newsモデルをインスタンス化
        $this->model = $news;
    }

    /**
     * newsページの一覧データを取得
     */
    public function getBaseData($conditions=null) {
        return $this->getQuery('news', $conditions, [], true);
    }

}
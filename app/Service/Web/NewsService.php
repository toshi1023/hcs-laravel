<?php

namespace App\Service\Web;

use App\Consts\Consts;
use App\DataProvider\DatabaseInterface\NewsDatabaseInterface;
use Storage;

class NewsService
{

  protected $MessageService;

  /* DBリポジトリのインスタンス化 */
  public function __construct(NewsDatabaseInterface $service)
  {
    $this->NewsService = $service;
  }

  /**
   * Indexページ用データ取得メソッド
   * 引数：検索条件
   */
  public function getIndex($conditions=null)
  {
    return $this->NewsService->getBaseData($conditions)->orderBy('updated_at', 'desc')->get();
  }

  /**
   * Showページ用データ取得メソッド
   * 引数：検索条件
   */
  public function getShow($conditions=null)
  {
    return $this->NewsService->getBaseData($conditions)->orderBy('updated_at', 'desc')->first();
  }
}
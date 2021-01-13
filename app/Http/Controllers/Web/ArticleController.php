<?php

namespace App\Http\Controllers\Web;

use Illuminate\Http\Request;

use App\Service\Web\ArticleService;
use Illuminate\Support\Facades\DB;

class ArticleController extends Controller
{

  protected $database;

  public function __construct(ArticleService $database)
  {
    Parent::__construct();
  }

}

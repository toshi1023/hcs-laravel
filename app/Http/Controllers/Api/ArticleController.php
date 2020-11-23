<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

use App\Service\Web\ArticleService;
use Illuminate\Support\Facades\DB;

class ArticleController extends Controller
{

  protected $database;

  public function __construct(ArticleService $database)
  {

    Parent::__construct();

    // DB操作のクラスをインスタンス化
    $this->database = $database;
  }

  /**
   * Homeページ用の記事取得メソッド
   */
  public function home(Request $request)
  {
      // 検索条件のセット
      $conditions = [];
    
      $articles = $this->database->getHome(null, $conditions);

      return response()->json([
        'articles' => $articles['articles'], 
        'free_articles' => $articles['free_articles'],
      ],200, [], JSON_UNESCAPED_UNICODE);
  }

  /**
   * 記事の取得メソッド
   */
  public function index(Request $request)
  {
      // 検索条件のセット
      $conditions = [];
      if ($request->input('queryPrefecture')) { $conditions['articles.prefecture@like'] = $request->input('queryPrefecture'); }
      if ($request->input('queryId')) { $conditions['articles.user_id'] = $request->input('queryId'); }
    
      $articles = $this->database->getIndex(null, $conditions);

      return response()->json([
        'articles' => $articles['articles'], 
        'free_articles' => $articles['free_articles'],
      ],200, [], JSON_UNESCAPED_UNICODE);
  }
  
  /**
   * 記事保存メソッド
   */
  public function store(Request $request)
  {
    DB::beginTransaction();

    $filename = null;

    if ($_FILES['article_photo']['name']){
      // ファイル名を変数に代入
      $filename = $_FILES['article_photo']['name'];
    }

    if ($this->database->articleSave($request, $filename)) {
      DB::commit();
      return redirect()->route('articles.index')->with('message', '記事を作成しました');
    } else {
      DB::rollBack();
      $this->messages->add('', '記事の作成に失敗しました。管理者に問い合わせてください');
      return redirect()->route('articles.index')->withErrors($this->messages);
    }
    
  }

  // 記事の変更を反映
  public function update(Request $request, $article)
  {
    $article = $this->database->getEdit($article)['article'];

    DB::beginTransaction();

    if ($this->database->articleSave($request, null, $article)) {
      DB::commit();
      return redirect()->route('articles.index')->with('message', '記事を保存しました');
    } else {
      DB::rollBack();
      $this->messages->add('', '記事の保存に失敗しました。管理者に問い合わせてください');
      return redirect()->route('articles.index')->withErrors($this->messages);
    }
  }

  // 記事を削除
  public function destroy($article)
  {
    DB::beginTransaction();

    if ($this->database->articleDestroy($article)) {
      DB::commit();
      return redirect()->route('articles.index')->with('message', '記事を削除しました');
    } else {
      DB::rollBack();
      $this->messages->add('', '記事の削除に失敗しました。管理者に問い合わせてください');
      return redirect()->route('articles.index')->withErrors($this->messages);
    }
  }

  /**
   * 記事のいいね数を取得
   */
  public function likes(Request $request)
  {
    // 検索条件のセット
    $conditions = [];
    if ($request->input('query')) { $conditions['user_id'] = $request->input('query'); }
    
    // 記事のいいね数を取得
    $data = $this->database->getLikes($conditions);

    return response()->json([
      'likes' => $data
    ], 200, [], JSON_UNESCAPED_UNICODE);
  }

  /**
   * 記事のいいね数を更新
   * 
   */
  public function likesUpdate(Request $request)
  {
    // 検索条件のセット
    $conditions = [];
    if ($request->input('article_id')) { $conditions['article_id'] = $request->input('article_id'); }
    if ($request->input('user_id')) { $conditions['user_id'] = $request->input('user_id'); }
    // 更新処理を実行
    $likes = $this->database->getLikesUpdate($conditions);
    // 更新に成功したとき
    if($likes['result']) {
      return response()->json([
        'likes_flg'       => $likes['like_flg'],
        'likes_counts'    => $likes['data'],
        'article_id'      => $request->input('article_id'),
      ], 200, [], JSON_UNESCAPED_UNICODE);
    }
    // 更新に失敗したとき
    return response()->json([
      'error_message' => $likes['like_flg'],
      'status'        => 500,
    ], 500, [], JSON_UNESCAPED_UNICODE);
  }

  /**
   * 記事のコメントを取得
   */
  public function comments(Request $request)
  {
    // 記事のいいね数を取得
    $data = $this->database->getComments();

    return response()->json([
      'comments'          => $data['data'],
      'comments_counts'   => $data['counts']
    ], 200, [], JSON_UNESCAPED_UNICODE);
  }
}

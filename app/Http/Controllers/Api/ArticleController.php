<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

use App\Service\Web\ArticleService;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

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
    try{
      // 検索条件のセット
      $conditions = [];
    
      $articles = $this->database->getHome(null, $conditions);

      return response()->json([
        'articles' => $articles['articles'], 
        // 'free_articles' => $articles['free_articles'],
      ],200, [], JSON_UNESCAPED_UNICODE);
    } catch (\Exception $e) {
      \Log::error('Article get Error:'.$e->getMessage());
      return response()->json([
        'error_message' => '記事の取得に失敗しました!'
      ], 500, [], JSON_UNESCAPED_UNICODE);
    }
  }

  /**
   * 記事の取得メソッド
   */
  public function index(Request $request)
  {
    try{
      // 検索条件のセット
      $conditions = [];
      if ($request->input('queryPrefecture')) { $conditions['articles.prefecture@like'] = $request->input('queryPrefecture'); }
      if ($request->input('queryId')) { $conditions['articles.user_id'] = $request->input('queryId'); }
    
      $articles = $this->database->getIndex(null, $conditions);

      return response()->json([
        'articles' => $articles, 
      ],200, [], JSON_UNESCAPED_UNICODE);
    } catch (\Exception $e) {
      \Log::error('Article get Error:'.$e->getMessage());
      return response()->json([
        'error_message' => '記事の取得に失敗しました!'
      ], 500, [], JSON_UNESCAPED_UNICODE);
    }
  }
  
  /**
   * 記事保存メソッド
   */
  public function store(Request $request)
  {
    try {
      DB::beginTransaction();
      
      // ファイル名の生成
      $filename = null;
      if ($request->file('upload_image')){
        $filename = $this->getFilename($request->file('upload_image'));
      }
      
      // 登録データを配列化
      $data = $request->input();
      $data['type'] = $request->input('type') == 'true' ? 1 : 0;
      $data['user_id'] = \Auth::user()->id;
      // 記事の保存処理
      $article = $this->database->save($data, $filename);
      
      DB::commit();
      return response()->json([
        'info_message' => '記事を投稿しました', 
        'article'      => $article,
      ],200, [], JSON_UNESCAPED_UNICODE);
      
    } catch (\Exception $e) {
      DB::rollBack();
      \Log::error('Article save Error:'.$e->getMessage());
      // 作成失敗時はエラーメッセージを返す
      return response()->json([
        'error_message' => '記事の投稿に失敗しました',
        'status'        => 500,
      ], 500, [], JSON_UNESCAPED_UNICODE);
    }
  }

  // 記事の変更を反映
  public function update(Request $request, $article)
  {
    try {
      DB::beginTransaction();

      // ファイル名の生成
      $filename = null;
      if ($request->file('upload_image')){
        $filename = $this->getFilename($request->file('upload_image'));
      }
      
      // 登録データを配列化
      $data = $request->input();
  
      // 記事の保存処理
      $article = $this->database->save($data, $filename);

      DB::commit();
      return response()->json([
        'info_message' => '記事を投稿しました', 
        'article'      => $article,
      ],200, [], JSON_UNESCAPED_UNICODE);
      
    } catch (\Exception $e) {
      DB::rollBack();
      \Log::error('Article update Error:'.$e->getMessage());
      // 作成失敗時はエラーメッセージを返す
      return new JsonResponse([
        'error_message' => '記事の投稿に失敗しました',
        'status'        => 500,
      ], 500);
    }
  }

  // 記事を削除
  public function destroy($article)
  {
    try {
      DB::beginTransaction();

      // 記事を削除
      $this->database->articleDestroy($article);

      DB::commit();
      return response()->json([
        'info_message' => '記事を削除しました',
        'id'           => $article
      ],200, [], JSON_UNESCAPED_UNICODE);

    } catch (\Exception $e) {
      DB::rollBack();
      \Log::error('Article delete Error:'.$e->getMessage());
      // 削除失敗時はエラーメッセージを返す
      return new JsonResponse([
        'error_message' => '記事の削除に失敗しました',
        'status'        => 500,
      ], 500);
    }
  }

  /**
   * 記事のいいね数を取得
   */
  public function likes(Request $request)
  {
    try {
      // 検索条件のセット
      $conditions = [];
      if ($request->input('query')) { $conditions['user_id'] = $request->input('query'); }
      
      // 記事のいいね数を取得
      $data = $this->database->getLikes($conditions);
      
      return response()->json([
        'likes' => $data
      ], 200, [], JSON_UNESCAPED_UNICODE);
    } catch (\Exception $e) {
      \Log::error('Like get Error:'.$e->getMessage());
      return response()->json([
        'error_message' => 'いいねの取得に失敗しました!'
      ], 500, [], JSON_UNESCAPED_UNICODE);
    }
  }

  /**
   * 記事のいいね数を更新
   * 
   */
  public function likesUpdate(Request $request)
  {
    try {
      // 検索条件のセット
      $conditions = [];
      if ($request->input('article_id')) { $conditions['article_id'] = $request->input('article_id'); }
      if ($request->input('user_id')) { $conditions['user_id'] = $request->input('user_id'); }
      // 更新処理を実行
      $likes = $this->database->getLikesUpdate($conditions);
      // 更新に成功したとき
      return response()->json([
        'likes_flg'       => $likes['like_flg'],
        'likes_counts'    => $likes['data'],
        'article_id'      => $request->input('article_id'),
      ], 200, [], JSON_UNESCAPED_UNICODE);
    } catch (\Exception $e) {
      // 更新に失敗したとき
      return response()->json([
        'error_message' => $likes['like_flg'],
        'status'        => 500,
      ], 500, [], JSON_UNESCAPED_UNICODE);
    }
  }

  /**
   * 記事のコメントを取得
   */
  public function comments(Request $request)
  {
    try {
      // 記事のコメントを取得
      $data = $this->database->getComments();
  
      return response()->json([
        'comments'          => $data['data'],
        'comments_counts'   => $data['counts']
      ], 200, [], JSON_UNESCAPED_UNICODE);
    } catch (\Exception $e) {
      \Log::error('Comment get Error:'.$e->getMessage());
      return response()->json([
        'error_message' => 'コメントの取得に失敗しました!'
      ], 500, [], JSON_UNESCAPED_UNICODE);
    }
  }

  /**
   * 記事のコメントを保存
   */
  public function commentsUpdate(Request $request)
  {
    // コメントが空欄だった場合
    if(!$request->input('comment')) {
      return response()->json([
        'error_message'  => 'コメントが記載されていません',
        'status'         => 200,
      ], 200, [], JSON_UNESCAPED_UNICODE);
    }

    try {
      DB::beginTransaction();
  
      // 保存データを配列化
      $data = $request->all();
      
      // 記事のコメントを保存
      $comment = $this->database->getCommentsUpdate($data);
      if($comment) {
        // コメントデータの取得
        $comment = $this->database->getComments(['id' => $comment->id]);
        
        DB::commit();
        return response()->json([
          'comment'       => $comment,
          'info_message'  => 'コメントを投稿しました'
        ], 200, [], JSON_UNESCAPED_UNICODE);
      }
    } catch (\Exception $e) {
      DB::rollback();
      return response()->json([
        'error_message'  => 'コメントの投稿に失敗しました',
        'status'         => 500,
      ], 500, [], JSON_UNESCAPED_UNICODE);
    }
  }
}

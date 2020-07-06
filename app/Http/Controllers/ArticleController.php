<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Model\Article;
use App\Model\Prefecture;
use App\Model\User;
use App\Service\DatabaseInterface;
use Illuminate\Support\Facades\DB;

class ArticleController extends Controller
{

  protected $database;

  public function __construct()
  {
    // サービスの解決
    $this->database = $this->serviceBind();
  }

  public function index()
  {
      // 記事を全て取得(Userモデルのテーブルも結合して取得！)
      $articles = $this->database->getIndex()->get();

      // 女性限定公開をされていない記事のみ取得
      $women_only_articles = $this->database->getWhereQuery(['women_only' => 1])->get();

      return view('articles/index', [
          'articles' => $articles,
          'women_only_articles' => $women_only_articles,
      ]);
  }


  //    記事登録処理
  public function create()
  {

    $prefectures = Prefecture::all();

    return view('articles/create', [
        'prefectures' => $prefectures,
    ]);

  }

  /* 記事保存メソッド */
  public function store(Request $request)
  {
    DB::beginTransaction();

    if ($this->database->save($request)) {
      DB::commit();
      return redirect()->route('articles.index')->with('message', '記事を作成しました');
    } else {
      DB::rollBack();
      return redirect()->route('articles.index')->with('errors', '記事の作成に失敗しました');
    }
    
  }

  // 記事の詳細ページを設定
  public function show(Article $article)
  {
    // 記事テーブルとユーザテーブルを結合してユーザテーブルの値も取得
    $user = Article::find($article->id)->user;

    return view('articles.show', [
      'article' => $article,
      'user' => $user,
    ]);
  }

  // 記事の編集機能を設定
  public function edit(Article $article)
  {
    $article = Article::find($article->id);

    $user = Article::find($article->id)->user;

    $prefectures = Prefecture::all();

    return view('articles.edit', [
      'article' => $article,
      'user' => $user,
      'prefectures' => $prefectures,
    ]);
  }

  // 記事の変更を反映
  public function update(Request $request, Article $article)
  {
    $article = Article::find($article->id);

    // 修正内容の代入
    $article->prefecture = $request->prefecture;
    $article->title = $request->title;
    $article->content = $request->content;
    $article->women_only = $request->women_only;
    $article->user_id = $request->user_id;

    $article->save();

    return redirect('articles/'.$article->id);
  }

  // 記事を削除
  public function destroy(Article $article)
  {
    $article->delete();
    return redirect('articles');
  }
}

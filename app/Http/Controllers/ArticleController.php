<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Model\Article;
use App\Model\Prefecture;
use App\Model\User;
use App\Service\DatabaseInterface;

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
      $articles = Article::with('user')->latest('updated_at')->get();

      // 女性限定公開をされていない記事のみ取得
      $women_only_articles = Article::with('user')->where('women_only', 0)->latest('updated_at')->get();

      $test = Article::where('women_only', 0)->get();

      $database = $this->serviceBind();
      dd($database);
      exit;

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

  public function store(Request $request)
  {
    $article = new Article();

    // 記事の内容を登録
    $article->prefecture = $request->prefecture;
    $article->title      = $request->title;
    $article->content    = $request->content;
    $article->women_only = $request->women_only;
    $article->user_id    = $request->user_id;

    $article->save();

    return redirect()->route('articles.index')->with('message', '記事を作成しました');
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

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Model\Article;
use App\Model\Prefecture;
use App\Model\User;

use App\Service\ArticleService;
use App\Service\UserService;
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

  public function index()
  {
      $articles = $this->database->getIndex();

      return view('articles/index', [
          'articles' => $articles[0],
          'women_only_articles' => $articles[1],
      ]);
  }

  /* 記事作成メソッド */
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
      $this->messages->add('', '記事の作成に失敗しました。管理者に問い合わせてください');
      return redirect()->route('articles.index')->withErrors($this->messages);
    }
    
  }

  // 記事の詳細ページを設定
  public function show($article)
  {
    // ユーザテーブルの値を取得
    $user = $this->database->getShow($article->user_id)->first();

    return view('articles.show', [
      'article' => $article,
      'user' => $user,
    ]);
  }

  // 記事の編集機能を設定
  public function edit($article)
  {
    $article = $this->database->getEdit($article)['article'];

    dd($article);
    exit;

    $user = Article::find($article)->user;

    $prefectures = $this->database->getEdit($article->id)['prefecture'];

    return view('articles.edit', [
      'article' => $article,
      'user' => $user,
      'prefectures' => $prefectures,
    ]);
  }

  // 記事の変更を反映
  public function update(Request $request, $article)
  {
    $article = Article::find($article);

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
    DB::beginTransaction();

    if ($this->database->destroy($request)) {
      DB::commit();
      return redirect()->route('articles.index')->with('message', '記事を削除しました');
    } else {
      DB::rollBack();
      $this->messages->add('', '記事の削除に失敗しました。管理者に問い合わせてください');
      return redirect()->route('articles.index')->withErrors($this->messages);
    }
  }
}

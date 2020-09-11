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

    // DB操作のクラスをインスタンス化
    $this->database = $database;
  }

  public function index()
  {
      $articles = $this->database->getIndex();
      
      return view('articles/index', [
          'articles' => $articles['articles'],
          'free_articles' => $articles['free_articles'],
      ]);
  }

  /* 記事作成メソッド */
  public function create()
  {
    $prefectures = $this->database->getCreate('prefectures');

    return view('articles/create', [
        'prefectures' => $prefectures,
    ]);
  }

  /* 記事保存メソッド */
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

  // 記事の詳細ページを設定
  public function show($article)
  {
    // 詳細ページに表示する値を取得
    $article = $this->database->getShow($article);

    return view('articles.show', [
      'article' => $article,
    ]);
  }

  // 記事の編集機能を設定
  public function edit($article)
  {
    $data = $this->database->getEdit($article);

    return view('articles.edit', [
      'article' => $data['article'],
      'prefectures' => $data['prefectures'],
    ]);
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
}

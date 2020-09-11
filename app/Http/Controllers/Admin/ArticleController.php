<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;

use App\Service\Admin\ArticleService;
use Illuminate\Support\Facades\DB;

class ArticleController extends Controller
{

  protected $database;
  // 保存対象の除外リスト
  protected $except = ['register_mode', 'map', 'delete_flg_on', 'image_flg', 'img_delete'];

  public function __construct(ArticleService $database)
  {

    Parent::__construct();

    // DB操作のクラスをインスタンス化
    $this->database = $database;
  }

  public function index()
  {
      $articles = $this->database->getIndex();
      
      return view('admin.articles.index', [
          'articles' => $articles['articles'],
          'women_only_articles' => $articles['women_only_articles'],
      ]);
  }

  /* 記事作成メソッド */
  public function create()
  {
    $prefectures = $this->database->getCreate('prefectures');

    return view('admin.articles.create', [
        'register_mode' => 'create',
        'prefectures'   => $prefectures,
    ]);
  }

  /* 記事保存メソッド */
  public function store(Request $request)
  {
    dd($request);
    DB::beginTransaction();

    $filename = null;

    // 緯度・経度を分割
    $map = explode(',', $request->map);

    // 緯度・経度を配列に追加
    $request['latitude'] = $map[0];
    $request['longitude'] = $map[1];

    if ($_FILES['upload_image']['name']){
      // ファイル名を変数に代入
      $filename = $_FILES['upload_image']['name'];
    }

    // 記事の保存
    if ($this->database->save($request, $filename)) {
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

    return view('admin.articles.edit', [
      'register_mode' => 'edit',
      'article' => $data['article'],
      'prefectures' => $data['prefectures'],
    ]);
  }

  // 記事の変更を反映
  public function update(Request $request, $article)
  {
    $article = $this->database->getEdit($article)['article'];

    DB::beginTransaction();

    // 緯度・経度を分割
    $map = explode(',', $request->map);

    // 緯度・経度を配列に追加
    $request['latitude'] = $map[0];
    $request['longitude'] = $map[1];

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

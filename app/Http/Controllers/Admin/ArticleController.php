<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;

use App\Service\Admin\ArticleService;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;

use App\Http\Requests\Admin\ArticleRegisterRequest;

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
    // dd($this->database->getIndex()->get());
      return view('admin.articles.index', []);
  }

  public function apiIndex()
    {
      // 全管理ユーザデータを更新日時順にソートして取得
      $articles = $this->database->getIndex();

      return Datatables::eloquent($articles)->make(true);

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
  public function store(ArticleRegisterRequest $request)
  {
    DB::beginTransaction();

    // 緯度・経度を分割
    $map = explode(',', $request->map);

    // 緯度・経度を配列に追加
    $request['latitude'] = $map[0];
    $request['longitude'] = $map[1];

    // アップロードファイルのファイル名を設定
    $filename = null;
    if ($_FILES['upload_image']['name']){
      $filename = $_FILES['upload_image']['name'];
    }
    
    // 記事の保存
    if ($this->database->save($request, $filename)) {
      DB::commit();
      return redirect()->route('hcs-admin.articles.index')->with('message', '記事を作成しました');
    } else {
      DB::rollBack();
      $this->messages->add('', '記事の作成に失敗しました。管理者に問い合わせてください');
      return redirect()->route('hcs-admin.articles.index')->withErrors($this->messages);
    }
    
  }

  // 記事の詳細ページを設定
  public function show($article)
  {
    // 詳細ページに表示する値を取得
    $article = $this->database->getShow($article);

    return [
      'status'  => 1,
      'article' => $article,
    ];
  }

  // 記事の編集機能を設定
  public function edit($article)
  {
    $data = $this->database->getEdit($article);

    return view('admin.articles.edit', [
      'register_mode' => 'edit',
      'data' => $data['article'],
      'prefectures' => $data['prefectures'],
    ]);
  }

  // 記事の変更を反映
  public function update(ArticleRegisterRequest $request, $article)
  {

    DB::beginTransaction();

    // 緯度・経度を分割
    $map = explode(',', $request->map);

    // 緯度・経度を配列に追加
    $request['latitude'] = $map[0];
    $request['longitude'] = $map[1];

    // 緯度・経度のバリデーション
    $this->mapValidation($request);

    // ファイル名の設定
    $filename = $_FILES['upload_image']['name'];
    
    if ($this->database->save($request, $filename)) {
      DB::commit();
      return redirect()->route('hcs-admin.articles.index')->with('message', '記事を保存しました');
    } else {
      DB::rollBack();
      $this->messages->add('', '記事の保存に失敗しました。管理者に問い合わせてください');
      return redirect()->route('hcs-admin.articles.index')->withErrors($this->messages);
    }
  }

    /**
     * 削除
     * @param $id
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function destroy(Request $request) {
      if($this->database->remove($request->id)) {
        return redirect(route('hcs-admin.articles.index'))->with('message', '記事を削除しました');
      }
      $this->messages->add('', '記事の削除に失敗しました。管理者に問い合わせてください');
      return redirect(route('hcs-admin.articles.index'))->withErrors($this->messages);
    }
}

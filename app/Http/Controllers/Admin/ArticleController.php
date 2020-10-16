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

  public function apiIndex(Request $request)
    {
      // 検索条件のセット
      $conditions = [];
      if ($request->id) { $conditions['articles.id'] = $request->id; }
      if ($request->prefecture) { $conditions['articles.prefecture@like'] = $request->prefecture; }
      if ($request->name) { $conditions['users.name@like'] = $request->name; }

      // 全管理ユーザデータを更新日時順にソートして取得
      $articles = $this->database->getIndex(null, $conditions);

      return Datatables::eloquent($articles)->make(true);

    }

  /* 記事作成メソッド */
  public function create()
  {
    $prefectures = $this->database->getCreate('prefectures');

    return view('admin.articles.register', [
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
      return redirect()->route('hcs-admin.articles.index')->with('info_message', '記事を作成しました');
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
    $data = $this->database->getShow($article);
    
    return [
      'status'    => 1,
      'article'   => $data['article'],
      'like_flg'  => $data['like_flg'],
      'like_list' => $data['like_list']
    ];
  }

  public function apiLike(Request $request, $article)
  {
    // 検索条件のセット
    $conditions = [];

    // 詳細ページに表示する値を取得
    $data = $this->database->getShow($article);

    return Datatables::eloquent($data['like_list'])->make(true);
  }

  // 記事の編集機能を設定
  public function edit($article)
  {
    $data = $this->database->getEdit($article);

    return view('admin.articles.register', [
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
      return redirect()->route('hcs-admin.articles.index')->with('info_message', '記事を保存しました');
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

    /**
     * いいねの更新
     * @param $id
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function apiLikeUpdate(Request $request) {
      // 更新処理を実行
      $update = $this->database->getLikesUpdate($request->article_id);
      // 更新に成功したとき
      if($update['result']) {
        return [
          'status'   => 1,
          'like_flg' => $update['like_flg'],
          'data'     => $update['data'],
        ];
      }
      // 更新に失敗したとき
      return -1;
    }
}

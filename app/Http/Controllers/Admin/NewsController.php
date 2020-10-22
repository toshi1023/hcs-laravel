<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\Admin\NewsRegisterRequest;

use App\Service\Admin\NewsService;

class NewsController extends Controller
{
    protected $database;

    public function __construct(NewsService $database)
    {
      Parent::__construct();
      
      // DB操作のクラスをインスタンス化
      $this->database = $database;
    }

    /**
     * 一覧ページ
     */
    public function index()
    {
      // 種別のリスト
      $type = [
        ['id' => config('const.official'),      'name' => config('const.official_name')],
        ['id' => config('const.alert'), 'name' => config('const.alert_name')],
      ];
      // 公開ステータスのリスト
      $status = [
        ['id' => config('const.private'),      'name' => config('const.private_name')],
        ['id' => config('const.public'),       'name' => config('const.public_name')],
      ];
      
      return view('admin.news.index',[
        'type_list'   => $type,
        'status_list' => $status,
      ]);
    }

    /**
     * 一覧ページ用のテーブルデータ取得
     * 引数：検索ワード
     */
    public function apiIndex(Request $request)
    {
      // 検索条件のセット
      $conditions = [];
      if ($request->id) { $conditions['news.id'] = $request->id; }
      if ($request->type) { $conditions['news.type'] = $request->type; }
      if ($request->status) { $conditions['news.status'] = $request->status; }

      // ニュースをデータを取得
      $news = $this->database->getIndex(null, $conditions);

      return Datatables::eloquent($news)->make(true);

    }

    /**
     * 作成ページ
     */
    public function create()
    {
      return view('admin.news.register', [
        'register_mode' => 'create',
      ]);
    }

    /* お知らせ保存メソッド */
    /**
     * 新規保存
     * 引数：保存データ
     */
    public function store(NewsRegisterRequest $request)
    {
      
      DB::beginTransaction();
      if ($this->database->save($request)){
        DB::commit();
        return redirect()->route('hcs-admin.news.index')->with('info_message', 'ニュースを作成しました');
      } else {
        DB::rollBack();
        $this->messages->add('', 'ニュースの作成に失敗しました。管理者に問い合わせてください');
        return redirect()->route('hcs-admin.news.index')->withErrors($this->messages);
      }
    }

    /**
     * 詳細モーダル情報の取得
     * 引数：ニュースID
     */
    public function show($news)
    {
      $news = $this->database->getShow($news);

      return [
        'status' => 1,
        'news' => $news,
      ];
    }

    /**
     * 編集
     * 引数：ニュースID
     */
    public function edit($news)
    {
      $data = $this->database->getEdit($news);

      return view('admin.news.register', [
        'register_mode' => 'edit',
        'data' => $data['news'],
      ]);
    }

    /**
     * 更新処理
     * 引数1：保存データ, 引数2：ニュースID
     */
    public function update(NewsRegisterRequest $request, $news)
    {
      DB::beginTransaction();

      if ($this->database->save($request)) {
        DB::commit();
        return redirect()->route('hcs-admin.news.index')->with('info_message', 'ニュースの変更を保存しました');
      } else {
        DB::rollBack();
        $this->messages->add('', 'ニュースの変更に失敗しました。管理者に問い合わせてください');
        
        return redirect()->route('hcs-admin.news.index')->withErrors($this->messages);
      }
    }

    /**
     * 削除
     * @param $id
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function destroy(Request $request) {
      if($this->database->remove($request->id)) {
        return redirect(route('hcs-admin.news.index'))->with('message', 'ニュースを削除しました');
      }
      $this->messages->add('', 'ニュースの削除に失敗しました。管理者に問い合わせてください');
      return redirect(route('hcs-admin.news.index'))->withErrors($this->messages);
    }
}

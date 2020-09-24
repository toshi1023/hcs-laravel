<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Yajra\DataTables\Facades\DataTables;

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
    public function apiIndex()
    {
      // 全ニュースを更新日時順にソートして取得
      $news = $this->database->getIndex();

      return Datatables::eloquent($news)->make(true);

    }

    public function create()
    {
      return view('admin.news.create', [
        'register_mode' => 'create',
      ]);
    }

    /* ユーザ保存メソッド */
    public function store(Request $request)
    {
      
      DB::beginTransaction();
      if ($this->database->save($request)){
        DB::commit();
        return redirect()->route('hcs-admin.news.index')->with('message', 'ニュースを作成しました');
      } else {
        DB::rollBack();
        $this->messages->add('', 'ニュースの作成に失敗しました。管理者に問い合わせてください');
        return redirect()->route('hcs-admin.news.index')->withErrors($this->messages);
      }
    }

    public function show($news)
    {
      $news = $this->database->getShow($news);

      return [
        'status' => 1,
        'news' => $news,
      ];
    }

    public function edit($news)
    {
      $data = $this->database->getEdit($news);

      return view('admin.news.edit', [
        'register_mode' => 'edit',
        'data' => $data['news'],
      ]);
    }

    public function update(Request $request, $admin)
    {
      DB::beginTransaction();

      if ($this->database->save($request)) {
        DB::commit();
        return redirect()->route('hcs-admin.users.index')->with('message', 'プロフィールの変更を保存しました');
      } else {
        DB::rollBack();
        $this->messages->add('', 'プロフィールの変更に失敗しました。管理者に問い合わせてください');
        
        return redirect()->route('hcs-admin.admins.index')->withErrors($this->messages);
      }
    }
}

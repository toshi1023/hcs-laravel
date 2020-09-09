<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;

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
      return view('admin.news.index',[]);
    }
    public function apiIndex()
    {
      // 全管理ユーザデータを更新日時順にソートして取得
      $users = $this->database->getIndex();

      return Datatables::eloquent($users)->make(true);

    }

    public function create()
    {
      $prefectures = $this->database->getCreate('prefectures');

      return view('admin.news.register', [
        'register_mode' => 'create',
        'prefectures'   => $prefectures,
      ]);
    }

    /* ユーザ保存メソッド */
    public function store(Request $request)
    {
      
      DB::beginTransaction();
      if ($this->database->save($request)){
        DB::commit();
        return redirect()->route('hcs-admin.admins.index')->with('message', 'ユーザ登録に成功しました。ログインページからログインしてください');
      } else {
        DB::rollBack();
        $this->messages->add('', 'ユーザ登録に失敗しました。管理者に問い合わせてください');
        return redirect()->route('hcs-admin.admins.index')->withErrors($this->messages);
      }
    }

    public function pdf()
    {
      echo "test";
      // 全ユーザデータを更新日時順にソートして取得
      $users = $this->database->getIndex()->get();
      $pdf = \PDF::loadView('/layouts/pdf_template');

      // ブラウザ上で開く
      return $pdf->inline('thisis.pdf');

      // ダウンロードする場合
      // return $pdf->download('download.pdf');
    }

    public function show($user)
    {
      $user = $this->database->getShow($user);

      return view('admin.users.show', [
        'user' => $user,
      ]);
    }

    public function edit($user)
    {
      $data = $this->database->getEdit($user);

      return view('admin.users.register', [
        'register_mode' => 'edit',
        'user' => $data['user'],
        'prefectures' => $data['prefectures'],
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

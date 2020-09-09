<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;

use App\Http\Requests\AdminCreateRequest;
use App\Service\Admin\AdminService;

class AdminController extends Controller
{

    protected $database;
    protected $service;
    // 保存対象の除外リスト
    protected $except = ['register_mode'];

    public function __construct(AdminService $database)
    {
      Parent::__construct();
      
      // DB操作のクラスをインスタンス化
      $this->database = $database;
    }

    public function index()
    {

      return view('admin.admins.index',[]);

    }
    
    public function apiIndex()
    {
      // 全管理ユーザデータを更新日時順にソートして取得
      $users = $this->database->getIndex();

      return Datatables::eloquent($users)->make(true);

    }

    public function create()
    {
      return view('admin.admins.register', [
        'register_mode' => 'create'
      ]);
    }

    /* ユーザ保存メソッド */
    public function store(AdminCreateRequest $request)
    {
      DB::beginTransaction();
      // 除外処理
      $request = $request->except($this->except);

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

      return view('admin.admins.register', [
        'register_mode' => 'edit',
        'user' => $data['user'],
        'prefectures' => $data['prefectures'],
      ]);
    }

    public function update(AdminCreateRequest $request, $admin)
    {
      DB::beginTransaction();

      // 除外処理
      $request = $request->except($this->except);

      if ($this->database->save($request)) {
        DB::commit();
        return redirect()->route('hcs-admin.admins.index')->with('message', 'プロフィールの変更を保存しました');
      } else {
        DB::rollBack();
        $this->messages->add('', 'プロフィールの変更に失敗しました。管理者に問い合わせてください');
        
        return redirect()->route('hcs-admin.admins.index')->withErrors($this->messages);
      }
    }
}

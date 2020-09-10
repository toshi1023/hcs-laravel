<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;

use App\Http\Requests\Admin\AdminCreateRequest;
use App\Http\Requests\Admin\AdminUpdateRequest;
use App\Service\Admin\AdminService;

use App\SubValidation\SubValidation;

class AdminController extends Controller
{

    protected $database;
    protected $service;
    protected $validation;
    // 保存対象の除外リスト
    protected $except = ['register_mode'];

    public function __construct(AdminService $database, SubValidation $validation)
    {
      Parent::__construct();
      
      // DB操作のクラスをインスタンス化
      $this->database = $database;

      // パスワードのバリデーションクラスをインスタンス化
      $this->validation = $validation;
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
      return view('admin.admins.create', [
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
        return redirect()->route('hcs-admin.admins.index')->with('info_message', '管理ユーザを登録しました');
      } else {
        DB::rollBack();
        $this->messages->add('error_message', 'ユーザ登録に失敗しました。管理者に問い合わせてください');
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

    public function edit($admin)
    {
      $data = $this->database->getEdit($admin);
  
      return view('admin.admins.edit', [
        'register_mode' => 'edit',
        'data' => $data,
      ]);
    }

    public function update(AdminUpdateRequest $request, $admin)
    {
      DB::beginTransaction();

      // パスワードのハッシュ処理
      if(!is_null($request['password'])) {
        // バリデーションチェック
        $request['password'] = $this->validation->passwordValidation($request);
        // ハッシュ処理
        $request['password'] = Hash::make($request['password']);
      }
      // パスワードが未入力の場合は保存対象から外す
      if (is_null($request['password'])) {
        $this->except['password'] = 'password';
      }

      // 除外処理
      $request = $request->except($this->except);

      if ($this->database->save($request)) {
        DB::commit();
        return redirect()->route('hcs-admin.admins.index')->with('info_message', '管理ユーザの変更を保存しました');
      } else {
        DB::rollBack();
        $this->messages->add('error_message', 'プロフィールの変更に失敗しました。管理者に問い合わせてください');
        
        return redirect()->route('hcs-admin.admins.index')->withErrors($this->messages);
      }
    }
}

<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;

use App\Http\Requests\Admin\AdminRegisterRequest;
use App\Service\Admin\AdminService;

class AdminController extends Controller
{

    protected $database;
    protected $service;

    public function __construct(AdminService $database)
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

      return view('admin.admins.index',[]);

    }
    
    /**
     * 一覧ページ用のテーブルデータ取得
     * 引数：検索ワード
     */
    public function apiIndex(Request $request)
    {
      // 検索条件のセット
      $conditions = [];
      if ($request->id) { $conditions['admins.id'] = $request->id; }
      if ($request->email) { $conditions['admins.email@like'] = $request->email; }

      // 管理ユーザデータを更新日時順にソートして取得
      $users = $this->database->getIndex(null, $conditions);

      return Datatables::eloquent($users)->make(true);

    }

    /**
     * 作成ページ
     */
    public function create()
    {
      return view('admin.admins.register', [
        'register_mode' => 'create'
      ]);
    }

    /**
     * 新規保存
     * 引数：保存データ
     */
    public function store(AdminRegisterRequest $request)
    {
      DB::beginTransaction();
      // パスワードをバリデーションチェック
      $this->passwordValidation($request);
      // パスワードのハッシュ処理
      $request['password'] = Hash::make($request['password']);

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

    /**
     * 詳細モーダル情報の取得
     * 引数：管理者ID
     */
    public function show($admin)
    {
      
    }

    /**
     * 編集
     * 引数：管理者ID
     */
    public function edit($admin)
    {
      $data = $this->database->getEdit($admin);
  
      return view('admin.admins.register', [
        'register_mode' => 'edit',
        'data' => $data,
      ]);
    }

    /**
     * 更新処理
     * 引数1：保存データ, 引数2：管理者ID
     */
    public function update(AdminRegisterRequest $request, $admin)
    {
      DB::beginTransaction();

      // パスワードのハッシュ処理
      if(!is_null($request['password'])) {
        // バリデーションチェック
        $this->passwordValidation($request);
        // ハッシュ処理
        $request['password'] = Hash::make($request['password']);
      }
      // パスワードが未入力の場合は保存対象から外す
      if (is_null($request['password'])) {
        unset($request['password']);
      }

      if ($this->database->save($request)) {
        DB::commit();
        return redirect()->route('hcs-admin.admins.index')->with('info_message', '管理ユーザの変更を保存しました');
      } else {
        DB::rollBack();
        $this->messages->add('error_message', 'プロフィールの変更に失敗しました。管理者に問い合わせてください');
        
        return redirect()->route('hcs-admin.admins.index')->withErrors($this->messages);
      }
    }

    /**
     * 削除
     * @param $id
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function destroy(Request $request) {
      if($this->database->remove($request->id)) {
        return redirect(route('hcs-admin.admins.index'))->with('message', '管理ユーザを削除しました');
      }
      $this->messages->add('', '管理ユーザの削除に失敗しました。管理者に問い合わせてください');
      return redirect(route('hcs-admin.admins.index'))->withErrors($this->messages);
    }
}

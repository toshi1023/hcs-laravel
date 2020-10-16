<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Yajra\DataTables\Facades\DataTables;

use App\Service\Admin\UserService;
use App\Http\Requests\UserRegisterRequest;

class UserController extends Controller
{

    protected $database;

    public function __construct(UserService $database)
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
      // dd($this->database->getFriendsQuery(1)->get());
      return view('admin.users.index',[]);
    }
    
    public function apiIndex(Request $request)
    {
      // 検索条件のセット
      $conditions = [];
      if ($request->id) { $conditions['users.id'] = $request->id; }
      if ($request->name) { $conditions['users.name@like'] = $request->name; }
      if ($request->email) { $conditions['users.email@like'] = $request->email; }

      // 全管理ユーザデータを更新日時順にソートして取得
      $users = $this->database->getIndex(null, $conditions);

      return Datatables::eloquent($users)->make(true);
    }

    /**
     * 作成ページ
     */
    public function create()
    {
      $prefectures = $this->database->getCreate('prefectures');

      return view('admin.users.register', [
        'register_mode' => 'create',
        'prefectures'   => $prefectures,
      ]);
    }

    /* ユーザ保存メソッド */
    public function store(UserRegisterRequest $request)
    {
      DB::beginTransaction();

      // パスワードをバリデーションチェック
      $this->passwordValidation($request);
      // パスワードのハッシュ処理
      $request['password'] = Hash::make($request['password']);

      // アップロードファイルのファイル名を設定
      $filename = null;
      if ($request->file('upload_image')){
        $filename = $this->getFilename($request->file('upload_image'));
      }
      
      if ($this->database->save($request, $filename)){
        DB::commit();
        return redirect()->route('hcs-admin.users.index')->with('info_message', 'ユーザ登録に成功しました。ログインページからログインしてください');
      } else {
        DB::rollBack();
        $this->messages->add('', 'ユーザ登録に失敗しました。管理者に問い合わせてください');
        return redirect()->route('hcs-admin.users.index')->withErrors($this->messages);
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
     */
    public function show($user)
    {
      $user = $this->database->getShow($user);

      return [
        'status' => 1,
        'user'   => $user,
      ];
    }

    /**
     * フレンド情報の取得
     */
    public function apiFriendsIndex($user) {
        
      // ユーザのフレンド情報を取得
      return DataTables::eloquent($this->database->getFriendsQuery($user))->make();
    }

    /**
     * 編集ページ
     */
    public function edit($user)
    {
      $data = $this->database->getEdit($user);

      return view('admin.users.register', [
        'register_mode' => 'edit',
        'data' => $data['user'],
        'prefectures' => $data['prefectures'],
      ]);
    }

    /**
     * 更新処理
     */
    public function update(UserRegisterRequest $request, $admin)
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

      // ファイル名の設定
      $filename = null;
      if ($request->file('upload_image')){
        $filename = $this->getFilename($request->file('upload_image'));
      }
      // $filename = $_FILES['upload_image']['name'];

      if ($this->database->save($request, $filename)) {
        DB::commit();
        return redirect()->route('hcs-admin.users.index')->with('info_message', 'プロフィールの変更を保存しました');
      } else {
        DB::rollBack();
        $this->messages->add('', 'プロフィールの変更に失敗しました。管理者に問い合わせてください');
        
        return redirect()->route('hcs-admin.users.index')->withErrors($this->messages);
      }
    }

    /**
     * 削除
     * @param $id
     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function destroy(Request $request) {
      if($this->database->remove($request->id)) {
        return redirect(route('hcs-admin.users.index'))->with('message', 'ユーザを削除しました');
      }
      $this->messages->add('', 'ユーザの削除に失敗しました。管理者に問い合わせてください');
      return redirect(route('hcs-admin.users.index'))->withErrors($this->messages);
    }
}

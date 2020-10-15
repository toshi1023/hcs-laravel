
<div class="modal" id="detail_modal" class="col-6 col-sm-9" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-success modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">ユーザ詳細データ</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body">

                <ul class="list-inline font-weight-bold">
                    <li class="list-inline-item">ユーザ名</li>
                    <li class="list-inline-item"><span id="detail_name" class="detail-view"></span> さん</li>
                    <li class="list-inline-item">（<span id="detail_gender" class="detail-view"></span>）</li>
                </ul>

                <ul class="nav nav-tabs" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id="item1-tab" data-toggle="tab" href="#item1" role="tab" aria-controls="item1" aria-selected="true">詳細データ</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="item2-tab" data-toggle="tab" href="#item2" role="tab" aria-controls="item2" aria-selected="true">フレンド一覧</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="item3-tab" data-toggle="tab" href="#item3" role="tab" aria-controls="item3" aria-selected="true">メッセージ一覧</a>
                    </li>
                </ul>
                <div class="tab-content">
                    <!-- タブ1つ目(ユーザー詳細)-->
                    <div class="tab-pane show active" id="item1" role="tabpanel" aria-labelledby="item1-tab">
                        <div class="row">
                            <div class="col-10 col-sm-5">
                                <dl class="row">
                                    <dt class="col-3 text-right">都道府県</dt>
                                    <dd class="col-9"><span id="detail_prefecture" class="detail-view"></span></dd>
                                </dl>
                                <dl class="row">
                                    <dt class="col-3 text-right">生年月日</dt>
                                    <dd class="col-9"><span id="detail_birthday" class="detail-view"></span></dd>
                                </dl>
                                <dl class="row">
                                    <dt class="col-3 text-right">公開ステータス</dt>
                                    <dd class="col-9"><span id="detail_status" class="detail-view"></span></dd>
                                </dl>
                                <dl class="row">
                                    <dt class="col-3 text-right">メールアドレス</dt>
                                    <dd class="col-9"><span id="detail_email" class="detail-view"></span></dd>
                                </dl>
                                <dl class="row">
                                    <dt class="col-3 text-right">登録日時</dt>
                                    <dd class="col-9"><span id="detail_created_at" class="detail-view"></span></dd>
                                </dl>
                                <dl class="row">
                                    <dt class="col-3 text-right">最終ログイン日時</dt>
                                    <dd class="col-9"><span id="detail_login_time" class="detail-view"></span></dd>
                                </dl>
                                {{-- <dl class="row">
                                    <dt class="col-4 text-right">ユーザエージェント</dt>
                                    <dd class="col-8"><span id="detail_user_agent" class="detail-view"></span></dd>
                                </dl> --}}
                                <dl class="row">
                                    <dt class="col-3 text-right">備考</dt>
                                    <dd class="col-9"><span id="detail_memo" class="detail-view"></span></dd>
                                </dl>
                            </div>
                            <div class="col-10 col-sm-7">
                                <dl class="row">
                                    <dt class="col-3 text-right">画像</dt>
                                    <div class="col-9">
                                        <img id="detail_image_file" src="" width="250" height="200" class="detail-view">
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>

                    {{-- タブ2つ目(フレンド管理) --}}
                    <div class="tab-pane" id="item2" role="tabpanel" aria-labelledby="item2-tab">
                        <table class="table table-striped table-bordered datatable table-sm" id="user_friend_list">
                            <thead class="thead-dark">
                                <tr role="row">
                                    <th>履歴ID</th>
                                    <th>プロフィール画像</th>
                                    <th>ユーザ名</th>
                                    <th>都道府県</th>
                                    <th>申請状況</th>
                                    <th>登録日時</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">閉じる</button>
            </div>
            {{-- ユーザIDの値保持に利用 --}}
            <span id="user_id" data-id=""></span>
        </div>
        <!-- /.modal-content-->
    </div>
    <!-- /.modal-dialog-->
</div>

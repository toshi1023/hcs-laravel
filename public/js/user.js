$(function(){
    // 一覧画面のみ適用(ID=main_listがある場合のみ)
    if ($('#main_list').length) {

        // DataTables初期化
        initList(false);

        // 登録場所もしくは参加コミュニティボタンをクリック
        settingDetailAjax('users/', '.btn-detail');
    }

    // 性別フラグのvalue値設定
    $('#gender_flg').change(function() {
        if($('#gender_flg').prop('checked')) {
            $('#gender').val(1);
        } else {
            $('#gender').val(0);
        }
    });

    /* 
     *   アカウント停止処理
     */
    if($('#btn_account_stop').text() == 'アカウント停止中'){
        // アカウント停止状態は備考以外の入力を受け付けない
        $("#name").prop("disabled", true);
        $("#email").prop("disabled", true);
        $("#password").prop("disabled", true);
        $("#status1").prop("disabled", true);
        $("#status2").prop("disabled", true);
        $("#status3").prop("disabled", true);
    }
    $('#btn_account_stop').on('click', function(){

        // クリックごとにvalue値を変更
        if($('#btn_account_stop').text() == 'アカウントの停止'){
            $('#status4').val(4);
            $('#btn_account_stop').text('アカウント停止中');
            $('#btn_account_stop').attr('class', 'btn btn-dark text-white width-150 float-right');
            $("#name").prop("disabled", true);
            $("#email").prop("disabled", true);
            $("#password").prop("disabled", true);
            $("#status1").prop("disabled", true);
            $("#status2").prop("disabled", true);
            $("#status3").prop("disabled", true);
            alert('アカウントの停止を確定するには"更新"ボタンを押してください');
        } else {
            // アカウント停止解除後は全項目の入力を受け付ける
            $('#status4').val(null);
            $('#status1').val(1);
            $('#btn_account_stop').text('アカウントの停止');
            $('#btn_account_stop').attr('class', 'btn btn-danger width-150 float-right');
            $("#name").prop("disabled", false);
            $("#email").prop("disabled", false);
            $("#password").prop("disabled", false);
            $("#status1").prop("disabled", false);
            $("#status2").prop("disabled", false);
            $("#status3").prop("disabled", false);
        }
    });

/* 
 *   モーダルの終了処理
 */
    // 登録情報の備考
    $(document).on('click', '#location_modal_close', function(){
        $('#user_location_modal').modal('hide');
    });
    // 登録情報の画像
    $(document).on('click', '#location_image_close', function(){
        let id = $(this).data('id');
        $(`#location_modal${id}`).modal('hide');
    });
    $(document).on('click', '.close', function(){
        let id = $(this).data('id');
        $(`#location_modal${id}`).modal('hide');
    });
    // プロフィールの画像
    $(document).on('click', '#profile_image_close', function(){
        let id = $(this).data('id');
        $(`#profile_modal${id}`).modal('hide');
    });
    $(document).on('click', '.close', function(){
        let id = $(this).data('id');
        $(`#profile_modal${id}`).modal('hide');
    });
});

/**
 * 詳細表示
 * @param data
 */
function setDetailView(data, button) {
    /* 
     *   モーダルに表示する会員情報
     */
        $('#detail_name').html(data.name);
        $('#detail_gender').html(data.gender_name);
        $('#detail_prefecture').html(data.prefecture);
        $('#detail_birthday').html(data.birthday);
        $('#detail_status').html(data.status_name);
        $('#detail_email').html(data.email);
        $('#detail_login_time').html(data.login_time);
        $('#detail_created_at').html(data.created_at);
        $('#detail_image_file').attr('src', data.prof_photo_path);
        // $('#detail_user_agent').html(data.user_agent);
        $('#detail_memo').html(data.memo);
        $('#user_id').data('id', data.id);              // 各タグで共有

        // 性別によって文字色を変更
        if(data.gender == 0) {
            $('#detail_gender').css('color','red');
        }
        if(data.gender == 1) {
            $('#detail_gender').css('color','blue');
        }
        $('#detail_modal').modal('show');
        console.log(data)

    /* 
     *   "詳細"モーダルの表示処理("登録場所"タブ)
     */
        // if(button == '.btn-detail') {
        //     // 過去に表示したテーブルのリセット
        //     if ($.fn.DataTable.isDataTable('#user_location_list')) {
        //         $('#user_location_list').DataTable().destroy();
        //     }
        //     // DataTable設定("登録場所")
        //     settingDataTables(
        //         // 取得
        //         // tableのID
        //         'user_location_list',
        //         // 取得URLおよびパラメタ
        //         '/ajax/user/detail/'+ data.id +'/location',
        //         {},
        //         // 各列ごとの表示定義
        //         [
        //             {data: 'location_id'},
        //             {data: 'marker_name'},
        //             {data: 'location_name'},
        //             {
        //                 // ロケーションイメージの画像を表示(モーダル形式)
        //                 data: function (p) {
                            
        //                     return `
        //                         <a href="" data-toggle="modal" data-target="#location_modal${p.location_id}">
        //                             <img src="${p.image_url}" id="location_image" height="45" width="65">
        //                         </a>
        
        //                         <div class="modal fade" id="location_modal${p.location_id}" tabindex="-1"
        //                             role="dialog" aria-labelledby="label1" aria-hidden="true">
        //                             <div class="modal-dialog modal-dialog-centered" role="document">
        //                                 <div class="modal-content">
        //                                     <div class="modal-header">
        //                                         <h5 class="modal-title" id="label1">ロケーションイメージ</h5>
        //                                         <button type="button" class="close" data-id="${p.location_id}" aria-label="Close">
        //                                         <span aria-hidden="true">&times;</span>
        //                                         </button>
        //                                     </div>
        //                                     <div class="modal-body">
        //                                     <img src="${p.image_url}" id="image_modal_user" height="350" width="450">
        //                                     </div>
        //                                     <div class="modal-footer">
        //                                         <button type="button" class="btn btn-danger btn-delete" data-id="${p.location_id}">強制削除</button>
        //                                         <button type="button" class="btn btn-secondary" id="location_image_close" data-id="${p.location_id}">Close</button>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     `;
        //                 }
        //             },
        //             {data: 'created_at'},
        //             // GoogleMapのリンクを埋め込み
        //             {
        //                 data: function (p) {
        //                     // ロケーション情報を埋め込んだGoogle MapのURLを変数に代入
        //                     let url = `https://www.google.com/maps?q=${p.latitude},${p.longitude}`;
        //                     // 登録場所の備考ボタン・削除ボタンの設定(備考はデータがあるときのみ表示)
        //                     return getListLink('map', p.location_id, url, 'list-button');
        //                 }
        //             },
        //             {
        //                 data: function (p) {
        //                     // 登録場所の備考ボタン・削除ボタンの設定(備考はデータがあるときのみ表示)
        //                     if(p.memo == null) {
        //                         return getListLink('remove', p.location_id, '', 'list-button');
        //                     }
        //                     return getListLink('location', p.location_id, '', 'list-button') +
        //                         getListLink('remove', p.location_id, '', 'list-button');
        //                 }
        //             }
        //         ],
        //         // 各列ごとの装飾
        //         [
        //             { targets: [0], width: '100px'},
        //             { targets: [1], width: '150px'},
        //             { targets: [2], width: '150px'},
        //             { targets: [3], orderable: false, className: 'text-center', width: '100px'},
        //             { targets: [5], orderable: false, className: 'text-center', width: '100px'},
        //             { targets: [6], orderable: false, className: 'text-center', width: '100px'},
        //         ],
        //         false
        //     );

        // /* 
        // *   "詳細"モーダルの表示処理("マーカー"タブ)
        // */
        //     if ($.fn.DataTable.isDataTable('#user_markers_list')) {
        //         $('#user_markers_list').DataTable().destroy();
        //     }
        //     setMarkerTable(data.id);

        // /* 
        // *   "詳細"モーダルの表示処理("ポイント履歴"タブ)
        // */
        //     if ($.fn.DataTable.isDataTable('#user_points_list')) {
        //         $('#user_points_list').DataTable().destroy();
        //     }
        //     setPointTable(data.id);
            
            // $('#detail_modal').modal('show');
        // }
}

/**
 * 一覧初期化
 */
function initList(search) {
    // DataTable設定
    settingDataTables(
        // 取得
        // tableのID
        'main_list',
        // 取得URLおよびパラメタ
        '/hcs-admin/ajax/users',
        {
            'id': $('#id').val(),
            'name': $('#name').val(),
            'email': $('#email').val(),
        },
        // 各列ごとの表示定義
        [
            {data: 'id'},
            {
                data: function (p) {
                    return `
                        <a href="" data-toggle="modal" data-target="#modal${p.id}">
                            <img src="${p.prof_photo_path}" height="45" width="65">
                        </a>

                        <div class="modal fade" id="modal${p.id}" tabindex="-1"
                            role="dialog" aria-labelledby="label1" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="label1">プロフィール画像</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                    <img src="${p.prof_photo_path}" id="image_modal" height="350" width="450">
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            },
            {data: 'name'},
            {data: 'email'},
            {
                data: function (p) {
                    // 文字色を性別によって切り分け
                    if (p.gender == 0) {
                        return `<span style="color: red">${p.gender_name}</span>`;
                    }
                    return `<span style="color: blue">${p.gender_name}</span>`;
                }
            },
            {data: 'updated_at'},
            // 各操作列
            {
                data: function (p) {
                    // 編集
                    return getListLink('detail', p.id ,'hcs-admin/admins/detail/'+p.id, 'list-button') + 
                           getListLink('edit', 0, 'hcs-admin/admins/edit/'+p.id, 'list-button') + 
                           getListLink('remove', p.id ,'hcs-admin/admins/detail/'+p.id, 'list-button');
                }
            }
        ],
        // 各列ごとの装飾
        // 操作列(ボタン等)や画像項目はソート不可・text-centerを付与する
        [
            { targets: [1], orderable: false, className: 'text-center', width: '150px'},
            { targets: [2], orderable: false, width: '150px'},
            { targets: [3], orderable: false, width: '100px'},
            { targets: [4], orderable: false, width: '100px'},
            { targets: [6], orderable: false, className: 'text-center', width: '150px'},
        ],
        search
    );
};

/**
 * 一覧操作列リンク作成
 * @param type
 * @param id
 * @param link
 * @returns {string}
 */
function getListLink(type, id, link, clazz) {
    if (type == "detail") {
        return '<a href="javascript:void(0)" class="btn btn-success btn-detail '+clazz+'" data-toggle="tooltip" title="詳細" data-placement="top" data-id="'+id+'"><i class="fas fa-search fa-fw"></i></a>';
    }
    if (type == "edit") {
        return '<a href="'+link+'" class="btn btn-primary '+clazz+'" data-toggle="tooltip" title="編集" data-placement="top"><i class="fas fa-edit fa-fw"></i></a>';
    }
    if (type == "remove") {
        return '<a href="javascript:void(0)" class="btn btn-danger btn-remove '+clazz+'" data-toggle="tooltip" title="削除" data-placement="top" data-id="'+id+'"><i class="fas fa-trash-alt fa-fw"></i></a>';
    }
}
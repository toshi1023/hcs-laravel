$(function(){
    // 一覧画面のみ適用(ID=main_listがある場合のみ)
    if ($('#main_list').length) {

        // DataTables初期化
        initList(false);

        // 詳細ボタンをクリック
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

    /**
     * メッセージ一覧タブの表示 & データを表示
     */
    $(document).on('click', '.btn-message-detail', function(){
        // タブの自動切換え
        $('.nav-link.active').removeClass('active');
        $('#item4-tab').addClass('active');
        $('.tab-pane.show').removeClass('show');
        $('.tab-pane.active').removeClass('active');
        $('#item4').addClass('show');
        $('#item4').addClass('active');

        // メッセージ一覧テーブルの表示
        let sender_id = $(this).data('id');
        settingMessageTables(sender_id);
    });
    $(document).on('click', '.nav-item', function(){
        $('.nav-link.active').removeClass('active');
        $('.tab-pane.show').removeClass('show');
        $('.tab-pane.active').removeClass('active');
        // クリックしたタブからインデックス番号を取得
        const index = $(this).index();
        
        // クリックしたタブと同じインデックス番号をもつコンテンツを表示
		$('.nav-link').eq(index).addClass('show');
		$('.tab-pane').eq(index).addClass('show');
		$('.tab-pane').eq(index).addClass('active');
    });

    /* 
    *   モーダルの終了処理
    */
    // 登録情報の備考
    // プロフィールの画像
    $(document).on('click', '#profile_image_close', function(){
        let id = $(this).data('id');
        $(`#profile_modal${id}`).modal('hide');
        $(`#profile_modal${id}`).on('hidden.bs.modal', function () {
            if ($('.modal').is(':visible')) $('body').addClass('modal-open');
        });
    });
    $(document).on('click', '.close', function(){
        let id = $(this).data('id');
        $(`#profile_modal${id}`).modal('hide');
    });
    // フレンドの画像
    $(document).on('click', '#friend_image_close', function(){
        let id = $(this).data('id');
        $(`#friend_modal${id}`).modal('hide');
    });
    $(document).on('click', '.close', function(){
        let id = $(this).data('id');
        $(`#friend_modal${id}`).modal('hide');
    });

    /**
     * ユーザ詳細モーダルを閉じる処理
     */
    $(document).on('click', '#user_show_close', function(){
        // 他の受信者ユーザのデータが表示されないように設定
        $('#user_message_list').hide();
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
        // 日付フォーマットの形式を調整
        let time = moment(data.user.created_at);
        let create_time = time.format("YYYY年MM月DD日 HH時mm分");
        
        $('#detail_name').html(data.user.name);
        $('#detail_gender').html(data.user.gender_name);
        $('#detail_prefecture').html(data.user.prefecture);
        $('#detail_birthday').html(data.user.birthday);
        $('#detail_status').html(data.user.status_name);
        $('#detail_email').html(data.user.email);
        $('#detail_created_at').html(create_time);
        $('#detail_image_file').attr('src', data.user.users_photo_path);
        // $('#detail_user_agent').html(data.user_agent);
        $('#detail_comment').html(data.user.comment);
        $('#detail_memo').html(data.user.memo);
        $('#user_id').data('id', data.user.id);              // 各タグで共有

        // 性別によって文字色を変更
        if(data.user.gender == 0) {
            $('#detail_gender').css('color','red');
        }
        if(data.user.gender == 1) {
            $('#detail_gender').css('color','blue');
        }
        // アカウントステータスによって文字色を変更
        if(data.user.status == 0) {
            $('#detail_status').css('color','blue');
        }
        if(data.user.status == 1) {
            $('#detail_status').css('color','red');
        }

    /* 
     *   "詳細"モーダルの表示処理("フレンド一覧"タブ)
     */
        if(button == '.btn-detail') {
            // 過去に表示したテーブルのリセット
            if ($.fn.DataTable.isDataTable('#user_friend_list')) {
                $('#user_friend_list').DataTable().destroy();
            }
            // DataTable設定("フレンド一覧")
            settingDataTables(
                // 取得
                // tableのID
                'user_friend_list',
                // 取得URLおよびパラメタ
                `/hcs-admin/ajax/users/${data.user.id}/friends`,
                {},
                // 各列ごとの表示定義
                [
                    {data: 'friend_id'},
                    {
                        // 友達のイメージ画像を表示(モーダル形式)
                        data: function (p) {
                            
                            return `
                                <a href="" data-toggle="modal" data-target="#friend_modal${p.friend_id}">
                                    <img src="${p.users_photo_path}" id="location_image" height="45" width="65">
                                </a>
        
                                <div class="modal" id="friend_modal${p.friend_id}" tabindex="-1"
                                    role="dialog" aria-labelledby="label1" aria-hidden="true">
                                    <div class="modal-dialog modal-warning modal-dialog-centered" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="label1">プロフィール画像</h5>
                                                <button type="button" class="close" data-id="${p.friend_id}" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                            <img src="${p.users_photo_path}" id="image_modal_user" height="250" width="300">
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" id="friend_image_close" data-id="${p.friend_id}">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }
                    },
                    {data: 'friend_name'},
                    {data: 'prefecture'},
                    {
                        data: function (p) {
                            // statusを分岐
                            if(p.status == 1) {
                                return `<span style="color: blue">申請中</span>`;
                            }
                            if(p.status == 2) {
                                return `<span style="color: green">承認済み</span>`;
                            }
                            if(p.status == 3) {
                                return `<span style="color: red">却下</span>`;
                            }
                        }, name: 'status'
                    },
                    {
                        data: function(p) {
                            // 日付フォーマットの形式を調整
                            let time = moment(p.updated_at);
                            return time.format("YYYY年MM月DD日 HH時mm分");
                        }, name: 'updated_at'
                    },
                    // 各操作列
                    {
                        data: function (p) {
                            // 編集
                            return getListLink('remove', p.friend_id ,`users/${p.id}/friends/${p.friend_id}`, 'list-button');
                        }
                    }
                ],
                // 各列ごとの装飾
                [
                    { targets: [1], orderable: false, className: 'text-center', width: '150px'},
                    { targets: [6], orderable: false, className: 'text-center', width: '100px'},
                ],
                false
            );
            // 送信者テーブルの表示
            settingSendersTables();

            // 詳細モーダルの表示
            $('#detail_modal').modal('show');
        }       
}

/**
 * 送信者テーブルの実装処理
 */
function settingSendersTables() {
    // ユーザID取得
    let user_id = $('#user_id').data('id')

    // 過去に表示したテーブルのリセット
    if ($.fn.DataTable.isDataTable('#user_sender_list')) {
        $('#user_sender_list').DataTable().destroy();
    }
    // DataTable設定("メッセージ一覧")
    settingDataTables(
        // 取得
        // tableのID
        'user_sender_list',
        // 取得URLおよびパラメタ
        `ajax/users/${user_id}/messages`,
        {},
        // 各列ごとの表示定義
        [
            {data: 'id'},
            {
                // 送信者のイメージ画像を表示(モーダル形式)
                data: function (p) {
                    
                    return `
                        <a href="" data-toggle="modal" data-target="#profile_modal${p.user_id_sender}">
                            <img src="${p.users_photo_path}" id="profile_image" height="45" width="65">
                        </a>

                        <div class="modal" id="profile_modal${p.user_id_sender}" tabindex="-1"
                            role="dialog" aria-labelledby="label1" aria-hidden="true">
                            <div class="modal-dialog modal-warning modal-dialog-centered" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="label1">プロフィール画像</h5>
                                        <button type="button" class="close" data-id="${p.user_id_sender}" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                    <img src="${p.users_photo_path}" id="image_modal_user" height="350" width="450">
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" id="profile_image_close" data-id="${p.user_id_sender}">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            },
            {data: 'name'},
            {data: 'message_count'},
            // {
            //     data: function(p) {
            //         // 日付フォーマットの形式を調整
            //         let time = moment(p.updated_at);
            //         return time.format("YYYY年MM月DD日 HH時mm分");
            //     }, name: 'updated_at'
            // },
            // 各操作列
            {
                data: function (p) {
                    // 編集
                    return getListLink('message_detail', p.user_id_sender ,`ajax/users/${user_id}/messages/${p.user_id_sender}`, 'list-button');
                }
            }
        ],
        // 各列ごとの装飾
        [
            { targets: [1], orderable: false, className: 'text-center', width: '150px'},
            { targets: [3], orderable: true, className: 'text-center', width: '100px'},
            { targets: [4], orderable: false, className: 'text-center', width: '100px'},
        ],
        false
    );
}


/**
 * メッセージテーブルの実装処理
 * 引数：送信者ID
 */
function settingMessageTables(sender_id) {
    // ユーザIDの取得
    let user_id = $('#user_id').data('id');

    // 過去に表示したテーブルのリセット
    if ($.fn.DataTable.isDataTable('#user_message_list')) {
        $('#user_message_list').DataTable().destroy();
    }
    // DataTable設定("メッセージ一覧")
    settingDataTables(
        // 取得
        // tableのID
        'user_message_list',
        // 取得URLおよびパラメタ
        `ajax/users/${user_id}/messages/${sender_id}`,
        {},
        // 各列ごとの表示定義
        [
            {data: 'id'},
            {
                data: function (p) {
                    if(p.user_id_sender == $('#user_id').data('id')) {
                        return `<span style="color: green">${p.name}</span>`;
                    }
                    return `<span style="color: blue">${p.name}</span>`;
                }, name: 'name'
            },
            {data: 'content'},
            {
                data: function(p) {
                    // 日付フォーマットの形式を調整
                    let time = moment(p.updated_at);
                    return time.format("YYYY年MM月DD日 HH時mm分");
                }, name: 'updated_at'
            },
            // 各操作列
            {
                data: function (p) {
                    // 編集
                    return getListLink('remove', p.id ,`ajax/users/${user_id}/messages/destroy`, 'list-button');
                }
            }
        ],
        // 各列ごとの装飾
        [
            { targets: [2], orderable: true, className: 'text-left', width: '200px'},
            { targets: [4], orderable: false, className: 'text-center', width: '100px'},
        ],
        false
    );
    // メッセージ一覧テーブルの表示
    if($('#user_message_list').hide()) {
        $('#user_message_list').show();
    }
    
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
                            <img src="${p.users_photo_path}" height="45" width="65">
                        </a>

                        <div class="modal" id="modal${p.id}" tabindex="-1"
                            role="dialog" aria-labelledby="label1" aria-hidden="true">
                            <div class="modal-dialog modal-warning modal-dialog-centered" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="label1">プロフィール画像</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                    <img src="${p.users_photo_path}" id="image_modal" height="250" width="300">
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
            {
                data: function(p) {
                    // 日付フォーマットの形式を調整
                    let time = moment(p.updated_at);
                    return time.format("YYYY年MM月DD日 HH時mm分");
                }, name: 'updated_at'
            },
            // 各操作列
            {
                data: function (p) {
                    // 編集
                    return getListLink('detail', p.id ,`users/${p.id}`, 'list-button') + 
                           getListLink('edit', 0, `users/${p.id}/edit`, 'list-button') + 
                           getListLink('remove', p.id ,`users/${p.id}`, 'list-button');
                }
            }
        ],
        // 各列ごとの装飾
        // 操作列(ボタン等)や画像項目はソート不可・text-centerを付与する
        [
            { targets: [1], orderable: false, className: 'text-center', width: '150px'},
            { targets: [2], orderable: true, width: '150px'},
            { targets: [3], orderable: true, width: '100px'},
            { targets: [4], orderable: true, width: '100px'},
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
    if (type == "message_detail") {
        return '<a href="javascript:void(0)" class="btn btn-warning text-white btn-message-detail '+clazz+'" data-toggle="tooltip" title="詳細" data-placement="top" data-id="'+id+'"><i class="fas fa-search fa-fw"></i></a>';
    }
    if (type == "edit") {
        return '<a href="'+link+'" class="btn btn-primary '+clazz+'" data-toggle="tooltip" title="編集" data-placement="top"><i class="fas fa-edit fa-fw"></i></a>';
    }
    if (type == "remove") {
        return '<a href="javascript:void(0)" class="btn btn-danger btn-remove '+clazz+'" data-toggle="tooltip" title="削除" data-placement="top" data-id="'+id+'" data-url="'+ link+ '"><i class="fas fa-trash-alt fa-fw"></i></a>';
    }
}
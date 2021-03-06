$(function(){
    // 一覧画面のみ適用(ID=main_listがある場合のみ)
    if ($('#main_list').length) {

        // DataTables初期化
        initList(false);

        // 詳細ボタンをクリック
        settingDetailAjax('articles/', '.btn-detail');
    }

    // 公開フラグのvalue値設定
    $(document).on('change', '#open_flg', function() {
        if($('#open_flg').prop('checked')) {
            $('#type').val(1);
        } else {
            $('#type').val(0);
        }
    });

    // いいねボタンクリック時
    $(document).on('click', '.btn-like', function(){
        // いいね数の更新処理
        updateLike();
    });

    /* 
    *   モーダルの終了処理
    */
    // プロフィールの画像
    $(document).on('click', '#user_image_close', function(){
        let id = $(this).data('id');
        $(`#like_modal${id}`).modal('hide');
    });
    $(document).on('click', '.close', function(){
        let id = $(this).data('id');
        $(`#like_modal${id}`).modal('hide');
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
        let time = moment(data.article.updated_at);
        let update_time = time.format("YYYY年MM月DD日 HH時mm分");

        // ロケーション情報を埋め込んだGoogle MapのURLを変数に代入
        let url = `https://www.google.com/maps?q=${data.article.latitude},${data.article.longitude}`;

        // いいね数の変数を宣言
        let likes_counts;
        
        $('#detail_title').html(data.article.title);
        $('#detail_name').html(data.article.users.name);
        $('#detail_prefecture').html(data.article.prefecture);
        $('#detail_type').html(data.article.type_name);
        $('#detail_updated_at').html(update_time);
        $('#detail_content').html(data.article.content);
        $('#detail_photo').attr('src', data.article.article_images[0].articles_photo_path);
        $('#detail_location').append(getListLink('map', data.article.id, url, 'list-button'));
        $('#detail_comment').html(data.comments_count);

        $('#article_id').data('id', data.article.id);              // 各タグで共有
        
        // いいね数の表示制御
        if(data.article.likes_counts == null) {
            likes_counts = 0;
        } else {
            likes_counts = data.article.likes_counts.likes_counts;
        }
        console.log(data.like_flg)
        // いいねのボタン制御
        if(data.like_flg) {
            $('#detail_like').append(`<button class="btn btn-danger btn-like"><i class="fas fa-fw fa-heart"></i></button><span class="badge badge-light like-badge">${likes_counts}</span>`);
        } else {
            $('#detail_like').append(`<button class="btn btn-secondary btn-like"><i class="fas fa-fw fa-heart"></i></button><span class="badge badge-light like-badge">${likes_counts}</span>`);
        }

        // 性別によって文字色を変更
        if(data.article.users.gender == 0) {
            $('#detail_name').css('color','red');
        }
        if(data.article.users.gender == 1) {
            $('#detail_name').css('color','blue');
        }
        
        $('#detail_modal').modal('show');

    /* 
     *   "詳細"モーダルの表示処理("いいね一覧"&"コメント一覧"タブ)
     */
    if(button == '.btn-detail') {
        // いいねテーブルを表示
        settingLikeTables();
        // コメントテーブルを表示
        settingCommentTables();
    }
}

/**
 * いいねテーブルの実装処理
 */
function settingLikeTables() {
    // 記事ID取得
    let article_id = $('#article_id').data('id');

    // 過去に表示したテーブルのリセット
    if ($.fn.DataTable.isDataTable('#article_like_list')) {
        $('#article_like_list').DataTable().destroy();
    }
    // DataTable設定("いいね一覧")
    settingDataTables(
        // 取得
        // tableのID
        'article_like_list',
        // 取得URLおよびパラメタ
        `ajax/articles/${article_id}/likes`,
        {},
        // 各列ごとの表示定義
        [
            {data: 'id'},
            {
                // ユーザのイメージ画像を表示(モーダル形式)
                data: function (p) {
                    
                    return `
                        <a href="" data-toggle="modal" data-target="#like_modal${p.user_id}">
                            <img src="${p.users.users_photo_path}" id="location_image" height="45" width="65">
                        </a>

                        <div class="modal" id="like_modal${p.user_id}" tabindex="-1"
                            role="dialog" aria-labelledby="label1" aria-hidden="true">
                            <div class="modal-dialog modal-warning modal-dialog-centered" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="label1">プロフィール画像</h5>
                                        <button type="button" class="close" data-id="${p.user_id}" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                    <img src="${p.users.users_photo_path}" id="image_modal_user" height="350" width="450">
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" id="user_image_close" data-id="${p.user_id}">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            },
            {
                data: function(p) {
                    // 性別ごとにユーザ名の色を区別
                    if (p.users.gender === 1) {
                        return  `<sapn style="color: blue">${p.users.name}</sapn>`
                    }
                    return `<sapn style="color: red">${p.users.name}</sapn>`
                }, name: 'users.name'
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
                    return getListLink('remove', p.id ,`ajax/articles/${article_id}/likes/destroy`, 'list-button');
                }
            }
        ],
        // 各列ごとの装飾
        [
            { targets: [1], orderable: false, className: 'text-center', width: '150px'},
            { targets: [4], orderable: false, className: 'text-center', width: '100px'},
        ],
        false
    );
}

/**
 * コメントテーブルの実装処理
 */
function settingCommentTables() {
    // 記事ID取得
    let article_id = $('#article_id').data('id');

    // 過去に表示したテーブルのリセット
    if ($.fn.DataTable.isDataTable('#article_comment_list')) {
        $('#article_comment_list').DataTable().destroy();
    }
    // DataTable設定("コメント一覧")
    settingDataTables(
        // 取得
        // tableのID
        'article_comment_list',
        // 取得URLおよびパラメタ
        `ajax/articles/${article_id}/comments`,
        {},
        // 各列ごとの表示定義
        [
            {data: 'id'},
            {
                // ユーザのイメージ画像を表示(モーダル形式)
                data: function (p) {
                    
                    return `
                        <a href="" data-toggle="modal" data-target="#like_modal${p.user_id}">
                            <img src="${p.users.users_photo_path}" id="location_image" height="45" width="65">
                        </a>

                        <div class="modal" id="like_modal${p.user_id}" tabindex="-1"
                            role="dialog" aria-labelledby="label1" aria-hidden="true">
                            <div class="modal-dialog modal-warning modal-dialog-centered" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="label1">プロフィール画像</h5>
                                        <button type="button" class="close" data-id="${p.user_id}" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                    <img src="${p.users.users_photo_path}" id="image_modal_user" height="350" width="450">
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" id="user_image_close" data-id="${p.user_id}">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            },
            {
                data: function(p) {
                    // 性別ごとにユーザ名の色を区別
                    if (p.users.gender === 1) {
                        return  `<sapn style="color: blue">${p.users.user_name}</sapn>`
                    }
                    return `<sapn style="color: red">${p.users.user_name}</sapn>`
                }, name: 'users.user_name'
            },
            {data: 'comment'},
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
                    // 削除
                    return getListLink('remove', p.id ,`ajax/articles/${article_id}/comments/destroy`, 'list-button');
                }
            }
        ],
        // 各列ごとの装飾
        [
            { targets: [1], orderable: false, className: 'text-center', width: '150px'},
            { targets: [5], orderable: false, className: 'text-center', width: '100px'},
        ],
        false
    );
}

/**
 * いいね数更新処理
 * @param {*} search 
 */
function updateLike() {
    let article_id = $('#article_id').data('id');
    $.ajax({
        url:    `ajax/articles/${article_id}/likes/update`,
        type:   'POST',
        dataType: 'json',
        headers:{'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
        data:   {
            'article_id': article_id,
        }
    }).done(function(response){
        if (response.status == 1) {
            // ボタンの再レンダー
            if(response.like_flg) {
                $('.btn-like').removeClass(`btn-secondary`);
                $('.btn-like').addClass(`btn-danger`);
                $('.like-badge').text(response.data);
            } else {
                $('.btn-like').removeClass(`btn-danger`);
                $('.btn-like').addClass(`btn-secondary`);
                $('.like-badge').text(response.data);
            }
            // いいねテーブルを再レンダー
            settingLikeTables()
        } else {
            alert('save error');
        }
    })
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
        '/hcs-admin/ajax/articles',
        {
            'id': $('#id').val(),
            'prefecture': $('#prefecture').val(),
            'name': $('#name').val(),
        },
        // 各列ごとの表示定義
        [
            {data: 'id'},
            {
                data: function (p) {
                    return `
                        <a href="" data-toggle="modal" data-target="#modal${p.id}">
                            <img src="${p.article_images[0].articles_photo_path}" height="45" width="65">
                        </a>

                        <div class="modal" id="modal${p.id}" tabindex="-1"
                            role="dialog" aria-labelledby="label1" aria-hidden="true">
                            <div class="modal-dialog modal-warning modal-dialog-centered" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="label1">HitcHike Photo</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                    <img src="${p.article_images[0].articles_photo_path}" id="image_modal" height="350" width="450">
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
            {data: 'prefecture'},
            {data: 'title'},
            {data: 'type_name', name: 'type'},
            {
                data: function(p) {
                    // 性別ごとにユーザ名の色を区別
                    if (p.users.gender === 1) {
                        return  `<sapn style="color: blue">${p.users.name}</sapn>`
                    }
                    return `<sapn style="color: red">${p.users.name}</sapn>`
                }, name: 'users.name'
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
                    return getListLink('detail', p.id ,`articles/${p.id}`, 'list-button') + 
                           getListLink('edit', 0, `articles/${p.id}/edit`, 'list-button') + 
                           getListLink('remove', p.id ,`articles/${p.id}`, 'list-button');
                }
            }
        ],
        // 各列ごとの装飾
        // 操作列(ボタン等)や画像項目はソート不可・text-centerを付与する
        [
            { targets: [1], orderable: false, className: 'text-center', width: '100px'},
            { targets: [2], orderable: true, width: '100px'},
            { targets: [3], orderable: true, width: '160px'},
            { targets: [4], orderable: true, width: '100px'},
            { targets: [5], orderable: true, width: '100px'},
            { targets: [7], orderable: false, className: 'text-center', width: '120px'},
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
        return '<a href="javascript:void(0)" class="btn btn-danger btn-remove '+clazz+'" data-toggle="tooltip" title="削除" data-placement="top" data-id="'+id+'" data-url="'+ link +'"><i class="fas fa-trash-alt fa-fw"></i></a>';
    }
    if (type == "map") {
        return '<a href="'+ link +'" target="_blank" class="btn btn-primary btn-map '+clazz+'" data-toggle="tooltip" title="Google Mapで表示" data-placement="top" data-id="'+id+'"><i class="fas fa-map-marked-alt"></i></a>';
    }
}
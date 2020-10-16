$(function(){
    // 一覧画面のみ適用(ID=main_listがある場合のみ)
    if ($('#main_list').length) {

        // DataTables初期化
        initList(false);

        // 一覧詳細ボタンクリック
        settingDetailAjax('news/', '.btn-detail');
    }

    // 公開フラグのvalue値設定
    $('#open_flg').change(function() {
        if($('#open_flg').prop('checked')) {
            $('#status').val(1);
        } else {
            $('#status').val(0);
        }
    });
    // 公開対象フラグのvalue値設定
    $('#open_member').change(function() {
        if($('#open_member').prop('checked')) {
            $('#member_flg').val(1);
        } else {
            $('#member_flg').val(0);
        }
    });
});

/**
* 画面固有チェック
* @returns {boolean}
*/
function customCheck() {
    $('#main_form').submit();
}

/**
 * 詳細表示
 * @param data
 */
function setDetailView(data, button) {
    /* 
     *   モーダルに表示する会員情報
     */
        // 日付フォーマットの形式を調整
        let time = moment(data.news.updated_at);
        let update_time = time.format("YYYY年MM月DD日 HH時mm分");

        $('#detail_type').html(data.news.type_name);
        $('#detail_title').html(data.news.title);
        $('#detail_content').html(data.news.content);
        $('#detail_status').html(data.news.status_name);
        $('#detail_updated_at').html(update_time);
        $('#detail_memo').html(data.news.memo);
        $('#news_id').data('id', data.news.id);              // 各タグで共有

        // 種別によって文字色を変更
        if(data.news.type == 1) {
            $('#detail_type').css('color','green');
        }
        if(data.news.type == 2) {
            $('#detail_type').css('color','red');
        }
        // 公開ステータスによって文字色を変更
        if(data.news.status == 0) {
            $('#detail_status').css('color','red');
        }
        if(data.news.status == 1) {
            $('#detail_status').css('color','blue');
        }

        $('#detail_modal').modal('show');
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
        'ajax/news',
        {
            'id': $('#id').val(),
            'type': $('#type').val(),
            'title': $('#title').val(),
            'status': $('#status').val(),
        },
        // 各列ごとの表示定義
        [
            {data: 'id'},
            {
                data: function (p) {
                    // 文字色を種別によって切り分け
                    if (p.type == 1) {
                        return `<span style="color: green">${p.type_name}</span>`;
                    }
                    if (p.type == 2) {
                        return `<span style="color: red">${p.type_name}</span>`;
                    }
                }
            },
            {data: 'title'},
            {
                data: function (p) {
                    // 文字色をステータスによって切り分け
                    if (p.status == 0) {
                        return `<span style="color: red">${p.status_name}</span>`;
                    }
                    return `<span style="color: blue">${p.status_name}</span>`;
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
                    return getListLink('detail', p.id ,`/hcs-admin/news/${p.id}`, 'list-button') + 
                           getListLink('edit', p.id, `/hcs-admin/news/${p.id}/edit/`, 'list-button') + 
                           getListLink('remove', p.id , `/hcs-admin/news/${p.id}`, 'list-button');
                }
            }
        ],
        // 各列ごとの装飾
        // 操作列(ボタン等)や画像項目はソート不可・text-centerを付与する
        [
            { targets: [1], orderable: false, width: '150px'},
            { targets: [2], orderable: false, width: '150px'},
            { targets: [3], orderable: false, width: '150px'},
            { targets: [5], orderable: false, className: 'text-center', width: '150px'},
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
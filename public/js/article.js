$(function(){
    // 一覧画面のみ適用(ID=main_listがある場合のみ)
    if ($('#main_list').length) {

        // DataTables初期化
        initList(false);

        // 詳細ボタンをクリック
        settingDetailAjax('articles/', '.btn-detail');
    }

    // 公開フラグのvalue値設定
    $('#open_flg').change(function() {
        if($('#open_flg').prop('checked')) {
            $('#type').val(1);
        } else {
            $('#type').val(0);
        }
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
        
        $('#detail_title').html(data.article.title);
        $('#detail_name').html(data.article.name);
        $('#detail_prefecture').html(data.article.prefecture);
        $('#detail_type').html(data.article.type_name);
        $('#detail_updated_at').html(update_time);
        $('#detail_content').html(data.article.content);
        $('#detail_photo').attr('src', data.article_photo_path);
        $('#detail_location').append(getListLink('map', data.article.id, url, 'list-button'));

        $('#article_id').data('id', data.article.id);              // 各タグで共有
        
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
                            <img src="${p.article_photo_path}" height="45" width="65">
                        </a>

                        <div class="modal fade" id="modal${p.id}" tabindex="-1"
                            role="dialog" aria-labelledby="label1" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="label1">HitcHike Photo</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                    <img src="${p.article_photo_path}" id="image_modal" height="350" width="450">
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
            {data: 'type_name'},
            {data: 'name'},
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
            { targets: [2], orderable: false, width: '100px'},
            { targets: [3], orderable: false, width: '160px'},
            { targets: [4], orderable: false, width: '100px'},
            { targets: [5], orderable: false, width: '100px'},
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
        return '<a href="javascript:void(0)" class="btn btn-danger btn-remove '+clazz+'" data-toggle="tooltip" title="削除" data-placement="top" data-id="'+id+'"><i class="fas fa-trash-alt fa-fw"></i></a>';
    }
    if (type == "map") {
        return '<a href="'+ link +'" target="_blank" class="btn btn-primary btn-map '+clazz+'" data-toggle="tooltip" title="Google Mapで表示" data-placement="top" data-id="'+id+'"><i class="fas fa-map-marked-alt"></i></a>';
    }
}
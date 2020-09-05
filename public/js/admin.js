$(function(){
    // 一覧画面のみ適用(ID=main_listがある場合のみ)
    if ($('#main_list').length) {

        // DataTables初期化
        initList(false);
    }

    // 公開フラグのvalue値設定
    $('#open_flg').change(function() {
        if($('#open_flg').prop('checked')) {
            $('#status').val(1);
        } else {
            $('#status').val(0);
        }
    });

    $(document).on('click', '#btn-cancel', function() {
        console.log('Hi');
        console.log(window.parent.screen.width);
        
      });
});

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
        '/hcs-admin/ajax/admins',
        {
            'id': $('#id').val(),
            'email': $('#email').val(),
        },
        // 各列ごとの表示定義
        [
            {data: 'id'},
            {data: 'email'},
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
            // { targets: [1], orderable: false, className: 'text-left', width: '150px'},
            // { targets: [2], orderable: false, className: 'text-center', width: '150px'},
            // { targets: [6], orderable: false, className: 'text-center', width: '100px'},
            // { targets: [7], orderable: false, className: 'text-center', width: '150px'},
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
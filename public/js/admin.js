$(function(){
    // 一覧画面のみ適用(ID=main_listがある場合のみ)
    if ($('#main_list').length) {

        // DataTables初期化
        initList(false);

        // 一覧詳細ボタンクリック
        settingDetailAjax('/community/detail/', '.btn-community');
    }

    // 公開フラグのvalue値設定
    $('#open_flg').change(function() {
        if($('#open_flg').prop('checked')) {
            $('#status').val(1);
        } else {
            $('#status').val(0);
        }
    });
});

/**
* 画面固有チェック
* @returns {boolean}
*/
function customCheck() {

    $('#main_form').submit();
        // let check = false;

        // // IDの確認アラート
        // if($('#email').val() == null){
        //     alert('メールアドレスが未入力です');
        //     return false;
        // }
        // // パスワードの確認アラート
        // if($('#password').val() == null){
        //     alert('パスワードが未入力です');
        //     return false;
        // }

        // // メールアドレスの半角英数字チェック
        // if(str.match(/^[A-Za-z0-9]*$/)){
        //     check = true;
        // }else{
        //     alert('メールアドレスは半角英数字で入力が必要です');
        //     return false;
        // }

        // if(check) {
        //     $('#main_form').submit();
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
        '/hcs-admin/ajax/admins',
        {
            'id': $('#id').val(),
            'email': $('#email').val(),
        },
        // 各列ごとの表示定義
        [
            {data: 'id'},
            {data: 'email'},
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
                    return getListLink('edit', p.id, `/hcs-admin/admins/${p.id}/edit/`, 'list-button') + 
                           getListLink('remove', p.id , '', 'list-button');
                }
            }
        ],
        // 各列ごとの装飾
        // 操作列(ボタン等)や画像項目はソート不可・text-centerを付与する
        [
            { targets: [3], orderable: false, className: 'text-center', width: '150px'},
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
    if (type == "edit") {
        return '<a href="'+link+'" class="btn btn-primary '+clazz+'" data-toggle="tooltip" title="編集" data-placement="top"><i class="fas fa-edit fa-fw"></i></a>';
    }
    if (type == "remove") {
        return '<a href="javascript:void(0)" class="btn btn-danger btn-remove '+clazz+'" data-toggle="tooltip" title="削除" data-placement="top" data-id="'+id+'"><i class="fas fa-trash-alt fa-fw"></i></a>';
    }
}
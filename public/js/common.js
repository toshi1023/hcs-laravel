/**
 * 文字カウント(バイト数考慮)
 * @returns {number}
 */
String.prototype.bytes = function () {
    var length = 0;
    for (var i = 0; i < this.length; i++) {
        var c = this.charCodeAt(i);
        if ((c >= 0x0 && c < 0x81) || (c === 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
            length += 1;
        } else {
            length += 2;
        }
    }
    return length;
};

/**
 * 現在の日時を取得する
 * @returns {string}
 */
function getNow() {
    var now = new Date();
    var year = now.getFullYear();
    var mon = ("0" + (now.getMonth()+1)).slice(-2); //１を足すこと
    var day = ("0" + now.getDate()).slice(-2);
    var hour = ("0" + now.getHours()).slice(-2);
    var min = ("0" + now.getMinutes()).slice(-2);
    var sec = ("0" + now.getSeconds()).slice(-2);

    return year + "-" + mon + "-" + day + " " + hour + ":" + min + ":" + sec;
}

$(function() {

    // ajaxトークン初期設定
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    // Datatables日本語化
    if ($.fn.dataTable) {
        $.extend( $.fn.dataTable.defaults, {
            language: {
                "sEmptyTable":     "データはありません。",
                "sProcessing":   "処理中", // 処理中のロード画面をカスタマイズ
                "sLengthMenu":   "_MENU_ 件表示",
                "sZeroRecords":  "データはありません。",
                "sInfo":         " _TOTAL_ 件中 _START_ から _END_ まで表示",
                "sInfoEmpty":    " 0 件中 0 から 0 まで表示",
                "sInfoFiltered": "（全 _MAX_ 件より抽出）",
                "sInfoPostFix":  "",
                "sSearch":       "検索:",
                "sUrl":          "",
                "oPaginate": {
                    "sFirst":    "先頭",
                    "sPrevious": "前",
                    "sNext":     "次",
                    "sLast":     "最終"
                }
            }
        });
    }

    /**
     * @1 検索処理
     */
    // 検索ボタンクリック
    $('#btn_search').on('click', function () {
        $('#main_list').DataTable().destroy();
        initList(true);
    });
    // 検索対象Class指定項目エンター検索
    $('.search-text').on('keypress', function(e){
        if (e.which == 13) {
            $('#btn_search').click();
            return false;
        }
    });
    $('.search-select').on('change', function(e){
        $('#btn_search').click();
        return false;
    });
    // 検索クリア
    $('#btn_search_clear').on('click', function(){
        $('.search-text').val("");
        $('.search-select').val("");
        $('#main_list').DataTable().destroy();
        initList(true);
    });
    /**
     * // @1 検索処理
     */

    // ツールチップ(操作欄にある各種ボタンのタイトルを浮かび上がらせる)
    $('[data-toggle="tooltip"]').tooltip();

    // Infoモーダル表示制御
    if ($('#info_modal').length > 0) {
        setTimeout(function(){
            $('#info_modal').modal('show');
        },500);
    }

    // Errorモーダル表示制御
    if ($('#error_modal').length > 0) {
        setTimeout(function(){
            $('#error_modal').modal('show');
        },500);
    }

    /**
     * @2 登録・編集画面の設定
     */
    // 登録・ログインボタンクリック
    $('#btn_register').on('click', function() {
        // 画面内必須classを持つ項目の必須チェック
        let check = true;
        // $('.error-area').remove();
        // // 逆順での処理(下の項目から、上へ)
        // $($('.required-text').get().reverse()).each(function(index, elm){
        //     // elmで指定した項目のエラーがある場合、
        //     // エラーメッセージを表示する
        //     if (!isInputValue(elm)) {
        //         $(elm).focus();
        //         $(elm).after("<p class='error-area text-danger mb-0'>"+$(elm).attr("data-title")+"は必須入力です</p>");
        //         check = false;
        //     }
        // })
        // // エラーがある場合は処理しない
        // if (!check) {
        //     return false;
        // }
        // // 数値のみチェック
        // $($('.number-only-text').get().reverse()).each(function(index, elm){
        //     if ($(elm).val() != "" && !isNumber($(elm).val())) {
        //         // if (!$.isNumeric($(elm).val())) {
        //         $(elm).focus();
        //         $(elm).after("<p class='error-area text-danger mb-0'>"+$(elm).attr("data-title")+"は数値(0以上)のみ入力可能です</p>");
        //         check = false;
        //     }
        // })
        // // 数値のみチェック(空白はOK)
        // $($('.number-check').get().reverse()).each(function(index, elm){
        //     if ($(elm).val() != "" && !isNumber($(elm).val())) {
        //         // if (!$.isNumeric($(elm).val())) {
        //         $(elm).focus();
        //         $(elm).after("<p class='error-area text-danger mb-0'>"+$(elm).attr("data-title")+"は数値(0以上)のみ入力可能です</p>");
        //         check = false;
        //     }
        // })
        // // エラーがある場合は処理しない
        // if (!check) {
        //     return false;
        // }
        // 各機能jsの固有チェック呼び出し(各テーブルごとに設定)
        customCheck();

        // customCheck側でsubmitする
        return false;
    });

    // 画像アップロード処理(新規作成・編集画面)
    $(".image-select").on("click", function(){
        $(this).next().trigger("click");
    });
    // 画像アップローダーChange(画像ファイル差し替えイベント)
    // ※ #upload_image : input type="file"タグを指す
    $('#upload_image').on('change', function(e){
        changeFileEvent(e, $(this));
    });

    // 一覧データ削除
    $(document).on('click', '.btn-remove', function(){
        // formのhiddenにIDセット
        $('#remove_id').val($(this).attr("data-id"));
        // 確認メッセージ
        $('#confirm_modal').modal('show');
    });

    // 一覧詳細ボタンクリック

    // 削除確認モーダルOKクリック
    $('#btn_remove').on('click', function(){
        $('#remove_form').submit();
    });

    // datepickerクラス設定
    if ($.datetimepicker) {
        $.datetimepicker.setLocale('ja');
        // カレンダー表示設定(時刻付き)
        $('.datetimepicker').datetimepicker({
            format:'Y-m-d H:i',
            autoclose:true,
            step:1
        });
        // カレンダー表示設定(日付のみ)
        $('.datepicker').datetimepicker({
            format:'Y-m-d',
            timepicker:false,
            autoclose:true,
        });
        // カレンダー表示設定(時刻のみ)
        $('.timepicker').datetimepicker({
            format:'H:i',
            datepicker:false,
            autoclose:true,
            step:1
        });
    }
    // カレンダーからの選択のみ有効(キー入力無効)
    $('.datetimepicker .datepicker').on('keypress', function(){
        return false;
    });

    // 残り文字数表示＆制限
    // 属性maxlength設定があるもののみ
    $('input').each(function(idx, elm){
        if($(elm).attr('maxlength') != undefined) {
            $(elm).attr('data-counter-label', "残り{remaining}文字まで入力できます");
            shortAndSweet(elm, {counterClassName: 'sweet-counter'});
            if ($(elm).hasClass('number-only-text')) {
                $(elm).parent().find('.sweet-counter').css('display', 'none');
            }
        }
    });
    $('textarea').each(function(idx, elm){
        if($(elm).attr('maxlength') != undefined) {
            $(elm).attr('data-counter-label', "残り{remaining}文字まで入力できます");
            shortAndSweet(elm, {counterClassName: 'sweet-counter'});
        }
    });
    
});
/**
 * // @2 登録・編集画面の設定
 */

 /**
 * 指定Textが入力されているかどうか
 * @param elm
 * @returns {boolean}
 */
function isInputValue(elm) {
    if ($(elm).val() == "" || $(elm).val() == null || $(elm).val() == undefined) {
        return false;
    }
    return true;
}
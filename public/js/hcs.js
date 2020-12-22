
$(function(){

  var num = 0;
  // 女性限定公開を設定
  $('#women_only').click(function(){
    $(this).data("click", ++num);
    var click = $(this).data("click");

    // クリックごとにvalue値を変更
    if(click % 2 != 0){
      $('input:hidden[name="women_only"]').val(1);
      $('#women_only').text('設定する');
    } else {
      $('input:hidden[name="women_only"]').val(0);
      $('#women_only').text('設定しない');
    }
  });

  // スマホサイズの場合はzoomのcssを排除
  checkWidth();
  $(window).resize(checkWidth);
  
});

// スマホサイズの場合はzoomのcssを排除
var checkWidth = function() {
    var width = $(window).width();
    if (width < 500) {
        $('.body').css('zoom', 1);
        $('#top_title').text('HCS Admin');
        // 検索フォーム
        $('#id').css({'margin-top': 5, 'margin-bottom': 5});
        $('#name').css({'margin-top': 5, 'margin-bottom': 5});
    }
    if (width > 500) {
        $('.body').css('zoom', 1.2);
        $('#top_title').text('HitcHike Community Space Admin');
    }
}

// $(function(){
//   // 一覧画面のみ適用(ID=main_listがある場合のみ)
//   if ($('#main_list').length) {

//       // DataTables初期化
//       initList(false);
//   }

//   // 公開フラグのvalue値設定
//   $('#open_flg').change(function() {
//       if($('#open_flg').prop('checked')) {
//           $('#status').val(1);
//       } else {
//           $('#status').val(0);
//       }
//   })
// });

// @1 ファイルドロップ
$(function () {
  // #1 クリックで画像を選択する場合
  $('#drop_area').on('click', function () {
    $('#image').click();
  });

  $('#image').on('change', function () {
    // 画像が複数選択されていた場合(files.length : ファイルの数)
    if (this.files.length > 1) {
      alert('アップロードできる画像は1つだけです');
      $('#image').val('');
      return;
    }

    handleFiles($('#image')[0].files);
  });
  // #1

  // ドラッグしている要素がドロップ領域に入ったとき・領域にある間
  $('#drop_area').on('dragenter dragover', function (event) {
      event.stopPropagation();
      event.preventDefault();
      $('#drop_area').removeClass('dashed'); // 点線の枠を設定したクラスをリセット
      $('#drop_area').addClass('solid');  // 枠を実線にする
  });

  // ドラッグしている要素がドロップ領域から外れたとき
  $('#drop_area').on('dragleave', function (event) {
      event.stopPropagation();
      event.preventDefault();
      $('#drop_area').removeClass('solid'); // 実線の枠を設定したクラスをリセット
      $('#drop_area').addClass('dashed');  // 枠を点線に戻す
  });

  // #2ドラッグしている要素がドロップされたとき
  $('#drop_area').on('drop', function (event) {
      event.preventDefault();
  
      $('#image')[0].files = event.originalEvent.dataTransfer.files;
  
      // 画像が複数選択されていた場合
      if ($('#image')[0].files.length > 1) {
          alert('アップロードできる画像は1つだけです');
          $('#image').val('');
          return;
      }

      handleFiles($('#image')[0].files);

  });
  // #2

  // 選択された画像ファイルの操作
  function handleFiles(files) {
      var file = files[0];
      var reader = new FileReader();

      // 画像ファイル以外の場合は何もしない
      // A.indexOf(B)はAにBの値を含むかを判別！含む場合は0以上の値を返し、含まない場合は-1を返す
      if(file.type.indexOf("image") < 0){
          alert('画像ファイル以外はアップロード出来ません');
          return false;
      }

      reader.onload = (function (file) {  // 読み込みが完了したら
          
          // previeクラスのdivにimgタグを以下のプロパティ付きで実装
          return function(e) {
              $('.preview').empty();
              $('.preview').append($('<img>').attr({
                  src: e.target.result, // readAsDataURLの読み込み結果がresult
                  width: "250px",
                  height: "200px",
                  class: "preview",
                  title: file.name
              }));  // previewに画像を表示
          };   
      })(file);

      reader.readAsDataURL(file); // ファイル読み込みを非同期でバックグラウンドで開始

      // 削除フラグを解除
      $('#img_delete').val(0);
  }


  // drop_area以外でファイルがドロップされた場合、ファイルが開いてしまうのを防ぐ
  $(document).on('dragenter', function (event) {
      event.stopPropagation();
      event.preventDefault();
  });
  $(document).on('dragover', function (event) {
      event.stopPropagation();
      event.preventDefault();
  });
  $(document).on('drop', function (event) {
      event.stopPropagation();
      event.preventDefault();
  });
});
// @1


// @2 プレビュー画像削除時の設定
$(function(){
  // 画像のセット
  let outImage = 'https://aws-hcs-image.s3-ap-northeast-1.amazonaws.com/no-image2.jpg';
  
  $('#delete_flg').change(function() {
      // 画像の強制削除フラグ確認
      if($('#delete_flg').prop('checked') === true) {
          outImage = 'https://aws-hcs-image.s3-ap-northeast-1.amazonaws.com/no_image.png';
          $('#delete_flg_on').val(true);
      }
      if($('#delete_flg').prop('checked') === false) {
          outImage = 'https://aws-hcs-image.s3-ap-northeast-1.amazonaws.com/no-image2.jpg';
          $('#delete_flg_on').val(false);
      }
      $preview = $(".preview");

      // 強制削除の画像以外で画像ファイルがアップロードされていないことが条件
      if($('#image').val() === "" && $('#image_flg').val() === "") {
        // 画像ファイルと既存のプレビューを削除
        $preview.empty();
        $preview.append($('<img>').attr({
            src: outImage,
            width: "250px",
            height: "200px",
            class: "preview",
        }));
      }
  })

  $('#cancel').on('click', function(){
      $preview = $(".preview");

      // 画像ファイルと既存のプレビューを削除
      $preview.empty();
      $('#image').val(null);
      if($('#image_flg').val()) {
          $('#image_flg').val(null);

          // 編集時に"強制削除フラグ"を一度もタッチしなかった場合の処理
          if($('#delete_flg_on').val() == "") {
              $('#delete_flg_on').val(false);
          }
      }

      // .prevewの領域の中にロードした画像を表示するimageタグを追加
      $preview.append($('<img>').attr({
          src: outImage,
          width: "250px",
          height: "200px",
          class: "preview",
      }));

      $('#drop_area').removeClass('solid'); // 枠を点線に戻す

      // 削除フラグを設定
      $('#img_delete').val(1);
  });
});
// @2

/**
* 画面固有チェック
* @returns {boolean}
*/
function customCheck() {

    // 公開フラグの確認アラート
    if($('#status').val() == 0){
        if(confirm('公開ステータスが非公開に設定されています。\n\nこのまま登録しても宜しいでしょうか？')) {
            $('#main_form').submit();
        }
    }else{
        $('#main_form').submit();
    }
}

/**
 * 一覧の操作ボタンClickイベント定義(モーダルの表示処理実行)
 * @param url
 */
function settingDetailAjax(url, button) {

    if(button == undefined) {
        button = '.btn-detail';
    }

    $(document).on('click', button, function() {
        // 詳細画面表示クリア
        $('.detail-view').html("");

        // 削除フォームIDをセット
        $.ajax({url: url + $(this).data('id')})
            .done(function(response){
                if (response.status == 1) {
                    // 各機能別jsで定義する
                    setDetailView(response, button);
                } else {
                    alert('no data error');
                }
            });
    });
}

/**
 * DataTable各種設定・データ取得
 * @param elm_id  　　 tableのid
 * @param url　　  　　データ取得URL(ajax/~ )
 * @param data　　　　 検索対象データ
 * @param columns　　  各列ごとの表示定義
 * @param columnDefs   各列の装飾
 * @param search
 */
function settingDataTables(elm_id, url, data, columns, columnDefs, search) {
    // DataTables設定
    let table = $('#'+elm_id).dataTable({
        "processing": true,
        "serverSide": true,
        "stateSave":  true,
        "responsive": true,
        "paginate":   true,
        "ajax": {
            type: "get",
            dataType: 'json',
            url: url,
            data: data,
            timeout: 10000,
            error: function (xhr, error, code) {
                if (xhr.status == 401) {
                    alert('ログイン情報が確認できません。ログイン画面へ戻ります');
                    location.href = "/admin";
                } else {
                    alert('データが正常に取得できませんでした');
                }
            },
        },
        "bFilter":    false,
        "columns": columns,
        "order": [],
        "columnDefs": columnDefs,
        // 読み込み完了後イベント
        "initComplete": function( ) {
            // (レスポンシブが利かなくなるので、再定義)
            $(this).css('width', '100%');
            // ツールチップ設定
            $(this).find('[data-toggle="tooltip"]').tooltip();
            document.body.style.cursor = 'auto';

        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            // 色変更フラグが正の行データの背景色変更
            if (aData.change_row_color) {
                $('td', nRow).css('background-color', aData.change_row_color );
            }
        },
    });
    // 検索処理の場合、ページング初期化
    if (search) {
        table.fnPageChange(0);
    }
}

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
}

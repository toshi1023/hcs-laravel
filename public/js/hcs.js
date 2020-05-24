// @1 女性限定公開を設定
$(function(){

  var num = 0;

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

});
// @1

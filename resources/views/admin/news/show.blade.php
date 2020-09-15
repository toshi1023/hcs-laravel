
<div class="modal" id="detail_modal" class="col-6 col-sm-9" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-success modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">ニュース詳細データ</h5>
                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body">

                <ul class="nav nav-tabs" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id="item1-tab" data-toggle="tab" href="#item1" role="tab" aria-controls="item1" aria-selected="true">詳細データ</a>
                    </li>
                   
                </ul>
                <div class="tab-content">
                    <!-- タブ1つ目(ユーザー詳細)-->
                    <div class="tab-pane show active" id="item1" role="tabpanel" aria-labelledby="item1-tab">
                        <div class="row">
                            <div class="col-10 col-sm-5">
                                <dl class="row">
                                    <dt class="col-3 text-right">種別</dt>
                                    <dd class="col-9"><span id="detail_type" class="detail-view"></span></dd>
                                </dl>
                                <dl class="row">
                                    <dt class="col-3 text-right">タイトル</dt>
                                    <dd class="col-9"><span id="detail_title" class="detail-view"></span></dd>
                                </dl>
                                <dl class="row">
                                    <dt class="col-3 text-right">公開ステータス</dt>
                                    <dd class="col-9"><span id="detail_status" class="detail-view"></span></dd>
                                </dl>
                                <dl class="row">
                                    <dt class="col-3 text-right">更新日</dt>
                                    <dd class="col-9"><span id="detail_updated_at" class="detail-view"></span></dd>
                                </dl>
                                <dl class="row">
                                    <dt class="col-3 text-right">備考</dt>
                                    <dd class="col-9"><span id="detail_memo" class="detail-view"></span></dd>
                                </dl>
                            </div>
                            <div class="col-10 col-sm-7">
                                <dl class="row">
                                    <dt class="col-3 text-right">内容</dt>
                                    <dd class="col-9"><span id="detail_content" class="detail-view"></span></dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">閉じる</button>
            </div>
            {{-- ニュースIDの値保持に利用 --}}
            <span id="news_id" data-id=""></span>
        </div>
        <!-- /.modal-content-->
    </div>
    <!-- /.modal-dialog-->
</div>

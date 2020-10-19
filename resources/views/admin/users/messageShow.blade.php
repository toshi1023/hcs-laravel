
<div class="modal" id="detail_message_modal" class="col-6 col-sm-9" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-warning modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">メッセージ詳細データ</h5>
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
                    <!-- タブ(メッセージ詳細)-->
                    <div class="tab-pane show active" id="item1" role="tabpanel" aria-labelledby="item1-tab">
                        <table class="table table-striped table-bordered datatable table-sm" id="user_message_list">
                            <thead class="thead-dark">
                                <tr role="row">
                                    <th>履歴ID</th>
                                    <th>送信者名</th>
                                    <th>内容</th>
                                    <th>更新日時</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">閉じる</button>
            </div>
        </div>
        <!-- /.modal-content-->
    </div>
    <!-- /.modal-dialog-->
</div>

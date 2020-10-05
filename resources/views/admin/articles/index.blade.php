@extends('admin.layouts.app')

@section('title')
    <h1><span class="badge badge-pill badge-info text-white">記事一覧</span></h1>
@endsection

@section('content')
<div class="row">
    <div class="col-12 offset-md-1 col-md-10 offset-md-1">
        <div class="card">
            <div class="card-body">
                <div class="row mb-3 d-flex">
                    <div class="col-8 col-lg-2">
                        <input type="text" class="form-control search-text" value="" name="id" id="id" placeholder="ID">
                    </div>
                    <div class="col-lg-2">
                        <input type="text" class="form-control search-text" value="" name="prefecture" id="prefecture" placeholder="都道府県">
                    </div>
                    <div class="col-lg-2">
                        <input type="text" class="form-control search-text" value="" name="name" id="name" placeholder="投稿者">
                    </div>
                    <div class="col-lg-4">
                        @include('admin.layouts.components.button.search')
                        @include('admin.layouts.components.button.clear')
                    </div>
                </div>
                <hr>
                <div class="create_btn">
                    @include('admin.layouts.components.button.create', ['url' => "/hcs-admin/articles/create"])
                </div>
                <table class="table table-striped table-bordered datatable table-sm" id="main_list">
                    <thead class="thead-dark">
                        <tr role="row">
                            <th>ID</th>
                            <th>フォト</th>
                            <th>都道府県</th>
                            <th>タイトル</th>
                            <th>公開フラグ</th>
                            <th>投稿者</th>
                            <th>更新日</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    </div>
</div>
{{-- 詳細Modal読み込み --}}
@include('admin.articles.show')

{{-- 削除確認Modal読み込み --}}
@include('admin.layouts.components.remove', [
    'title' => '削除確認', 'message' => '対象データを削除します。よろしいですか？', 'btn_id' => 'btn_remove'
])
@endsection
@section('scripts')
    <script src="{{ asset('js/article.js') }}"></script>
@endsection
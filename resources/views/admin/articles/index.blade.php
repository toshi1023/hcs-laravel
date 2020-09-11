@extends('admin.layouts.app')

@section('title')
    記事一覧
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
                        <input type="text" class="form-control search-text" value="" name="name" id="name" placeholder="都道府県">
                    </div>
                    <div class="col-lg-2">
                        <input type="text" class="form-control search-text" value="" name="email" id="email" placeholder="タイトル">
                    </div>
                    <div class="col-lg-4">
                        @include('admin.layouts.components.button.search')
                        @include('admin.layouts.components.button.clear')
                    </div>
                </div>
                <hr>
                <table class="table table-striped table-bordered datatable table-sm" id="main_list">
                    <thead>
                        <tr role="row">
                            <th>ID</th>
                            <th>都道府県</th>
                            <th>タイトル</th>
                            <th>内容</th>
                            <th>公開フラグ</th>
                            <th>更新日</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection
@section('scripts')
    <script src="{{ asset('js/user.js') }}"></script>
@endsection
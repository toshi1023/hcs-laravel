@extends('admin.layouts.app')

@section('content')
<div class="container card-container">
    <div class="row justify-content-md-center">
        <div class="col-12 col-md-10">
            <div class="card">  
                <h1 class="card-header card-title">
                    <div class="row">
                        <div class="col-7 col-md-6">
                            {{ $register_mode === 'create' ? 'News Create' : 'News Edit' }}
                        </div>
                    </div>
                </h1>
                    
                <div class="card-body">
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <div class="alert alert-info content_explanation" role="alert">
                                    ニュースの{{ $register_mode === 'create' ? '作成' : '編集' }}を実行します<span class="text-danger">※は必須入力</span>
                                </div>
                                    <div class="card-body">
                                        <form class="form-horizontal" action="{{ route('hcs-admin.news.store') }}" method="post" id="main_form" enctype='multipart/form-data'>
                                            {{ csrf_field() }}
                                            <div class="row">
                                                <div class="col-sm-10 col-md-6">
                                                    <div class="form-group row">
                                                        <label class="col-md-4 col-form-label" for="title">タイトル<span class="text-danger">※</span></label>
                                                        <div class="col-md-8">
                                                            <input class="form-control required-text" type="text" id="title" name="title" maxlength="50" placeholder="タイトル" value="{{ $register_mode === 'create' ? old('title') : $data->title }}">
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label class="col-md-4 col-form-label" for="content">内容</label>
                                                        <div class="col-md-8">
                                                            <textarea class="form-control" name="content" id="content" maxlength="500" rows="5" placeholder="内容">{{ $register_mode === 'create' ? old('content') : $data->content }}</textarea>
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label class="col-md-4 col-form-label">公開フラグ<span class="text-danger">※</span></label>
                                                        <div class="col-md-8 form-inline" id="gender_checked">
                                                            {{-- <input type="checkbox" id="open_flg" data-toggle="toggle" data-on="{{ config('const.open_name') }}" data-off="{{ config('const.private_name') }}" {{ $data->status ? 'checked' : '' }}> --}}
                                                            <input type="checkbox" id="open_flg" data-toggle="toggle" data-on="{{ config('const.public_name') }}" data-off="{{ config('const.private_name') }}" data-onstyle="primary" data-offstyle="secondary">
                                                            <input type="hidden" id="status" name="status" value="{{ $register_mode === 'create' ? old('status') : $data->status }}">
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label class="col-md-4 col-form-label">公開対象<span class="text-danger">※</span></label>
                                                        <div class="col-md-8 form-inline" id="gender_checked">
                                                            {{-- <input type="checkbox" id="open_flg" data-toggle="toggle" data-on="{{ config('const.open_name') }}" data-off="{{ config('const.private_name') }}" {{ $data->status ? 'checked' : '' }}> --}}
                                                            <input type="checkbox" id="open_flg" data-toggle="toggle" data-on="{{ config('const.member_name') }}" data-off="{{ config('const.all_name') }}" data-onstyle="primary" data-offstyle="secondary">
                                                            <input type="hidden" id="type" name="type" value="{{ $register_mode === 'create' ? old('type') : $data->type }}">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <input type="hidden" name="id" id="id" value="{{ $register_mode === 'edit' ? $data->id : null }}" />
                                                    {{-- <input type="hidden" id="register_mode" name="register_mode" value="{{ $register_mode }}" /> --}}
                                                    @include('admin.layouts.components.button.register', ['register_mode' => $register_mode])
                                                    @include('admin.layouts.components.button.cancel', ['url' => "{{ route('hcs-admin.articles.index') }}"])
                                                </div>
                                            </div>
                                        </form>
                    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
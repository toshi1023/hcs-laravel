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
                                        <form class="form-horizontal" action="{{ $register_mode === 'create' ? route('hcs-admin.news.store') : route('hcs-admin.news.update', ['news' => $data->id])}}" method="post" id="main_form" enctype='multipart/form-data'>
                                            @if ($register_mode === 'create')
                                                @csrf
                                            @else
                                                @method('PUT')
                                                @csrf
                                            @endif
                                            <div class="row">
                                                <div class="col-sm-10 col-md-6">
                                                    <div class="form-group row">
                                                        <label class="col-md-4 col-form-label">種別<span class="text-danger">※</span></label>
                                                        <div class="col-md-8 form-inline" id="type_checked">
                                                            <div class="custom-control custom-radio cursor-pointer mr-3">
                                                                <input type="radio" class="custom-control-input" id="type1" name="type" value="{{ config('const.official') }}" data-type="{{ config('const.official_name') }}" 
                                                                {{ $register_mode === 'create' ? (old('type') == config('const.alert') ? '' : 'checked') : ($data->type == config('const.official') || old('type') == config('const.official') ? 'checked' : '') }}>
                    
                                                                <label class="custom-control-label cursor-pointer" for="type1">{{ config('const.official_name') }}</label>
                                                            </div>
                                                            <div class="custom-control custom-radio cursor-pointer mr-3">
                                                                <input type="radio" class="custom-control-input" id="type2" name="type" value="{{ config('const.alert') }}" data-type="{{ config('const.alert_name') }}" 
                                                                {{ $register_mode === 'create' ? (old('type') == config('const.alert') ? 'checked' : '') : ($data->type == config('const.alert') || old('type') == config('const.alert') ? 'checked' : '') }}>
                    
                                                                <label class="custom-control-label cursor-pointer" for="type2">{{ config('const.alert_name') }}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label class="col-md-4 col-form-label" for="title">タイトル<span class="text-danger">※</span></label>
                                                        <div class="col-md-8">
                                                            <input class="form-control required-text" type="text" id="title" name="title" maxlength="50" placeholder="タイトル" value="{{ $register_mode === 'create' ? old('title') : $data->title }}">
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label class="col-md-4 col-form-label" for="content">内容<span class="text-danger">※</span></label>
                                                        <div class="col-md-8">
                                                            <textarea class="form-control" name="content" id="content" maxlength="500" rows="5" placeholder="内容">{{ $register_mode === 'create' ? old('content') : $data->content }}</textarea>
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label class="col-md-4 col-form-label">公開フラグ<span class="text-danger">※</span></label>
                                                        <div class="col-md-8 form-inline" id="gender_checked">
                                                            {{-- <input type="checkbox" id="open_flg" data-toggle="toggle" data-on="{{ config('const.open_name') }}" data-off="{{ config('const.private_name') }}" {{ $data->status ? 'checked' : '' }}> --}}
                                                            <input type="checkbox" id="open_flg" data-toggle="toggle" data-on="{{ config('const.public_name') }}" data-off="{{ config('const.private_name') }}" data-onstyle="primary" data-offstyle="secondary">
                                                            <input type="hidden" id="status" name="status" value="{{ $register_mode === 'create' ? (old('status') ? old('status') : 0) : $data->status }}">
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label class="col-md-4 col-form-label">公開対象<span class="text-danger">※</span></label>
                                                        <div class="col-md-8 form-inline" id="gender_checked">
                                                            {{-- <input type="checkbox" id="open_flg" data-toggle="toggle" data-on="{{ config('const.open_name') }}" data-off="{{ config('const.private_name') }}" {{ $data->status ? 'checked' : '' }}> --}}
                                                            <input type="checkbox" id="open_member" data-toggle="toggle" data-on="{{ config('const.member_name') }}" data-off="{{ config('const.all_name') }}" data-onstyle="primary" data-offstyle="secondary">
                                                            <input type="hidden" id="member_flg" name="member_flg" value="{{ $register_mode === 'create' ? (old('member_flg') ? old('member_flg') : 0) : $data->member_flg }}">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <input type="hidden" name="id" id="id" value="{{ $register_mode === 'edit' ? $data->id : null }}" />
                                                    <input type="hidden" name="admin_id" id="admin_id" value="{{ \Auth::user()->id }}" />
                                                    @include('admin.layouts.components.button.register', ['register_mode' => $register_mode])
                                                    @include('admin.layouts.components.button.cancel', ['url' => "/hcs-admin/news"])
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

@section('scripts')
    <script src="{{ asset('js/news.js') }}"></script>
@endsection
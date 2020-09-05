@extends('admin.layouts.app')

@section('content')
<div class="container card-container">
    <form method="POST" action="{{ route('hcs-admin.admins.store') }}">
        @csrf
        <div class="row justify-content-md-center">
            <div class="col-12 col-md-10">
                <div class="card">  
                    <h1 class="card-header card-title">
                        <div class="row">
                            <div class="col-7 col-md-6">
                                {{ $register_mode === 'create' ? 'User Create' : 'User Edit' }}
                            </div>
                        </div>
                    </h1>
                        
                    <div class="card-body">
                        <div class="container">
                            <div class="row">
                                <div class="col-12">
                                    <div class="alert alert-info content_explanation" role="alert">
                                        ユーザの{{ $register_mode === 'create' ? '作成' : '編集' }}を実行します<span class="text-danger">※は必須入力</span>
                                    </div>
                                        <div class="card-body">
                                            <form class="form-horizontal" action="{{ route('hcs-admin.admins.store') }}" method="post" id="main_form" enctype='multipart/form-data'>
                                                {{ csrf_field() }}
                                                <div class="row">
                                                    <div class="col-sm-10 col-md-6">
                                                        <div class="form-group row">
                                                            <label class="col-md-4 col-form-label" for="name">ニックネーム<span class="text-danger">※</span></label>
                                                            <div class="col-md-8">
                                                                <input class="form-control required-text" type="text" id="name" name="name" maxlength="50" placeholder="ニックネーム" value="{{ $register_mode === 'create' ? old('name') : $data->name }}">
                                                            </div>
                                                        </div>
                                                        <div class="form-group row">
                                                            <label class="col-md-4 col-form-label" for="prefecture">都道府県<span class="text-danger">※</span></label>
                                                            <div class="col-md-8">
                                                                <input class="form-control required-text" type="text" id="prefecture" name="prefecture" maxlength="50" placeholder="都道府県" value="{{ $register_mode === 'create' ? old('prefecture') : $data->prefecture }}">
                                                            </div>
                                                        </div>
                                                        <div class="form-group row">
                                                            <label class="col-md-4 col-form-label" for="birthday">誕生日<span class="text-danger">※</span></label>
                                                            <div class="col-md-8">
                                                                <input class="form-control required-text" type="text" id="birthday" name="birthday" maxlength="50" placeholder="誕生日" value="{{ $register_mode === 'create' ? old('birthday') : $data->birthday }}">
                                                            </div>
                                                        </div>
                                                        <div class="form-group row">
                                                            <label class="col-md-4 col-form-label">性別<span class="text-danger">※</span></label>
                                                            <div class="col-md-8 form-inline" id="gender_checked">
                                                                {{-- <input type="checkbox" id="open_flg" data-toggle="toggle" data-on="{{ config('const.open_name') }}" data-off="{{ config('const.private_name') }}" {{ $data->status ? 'checked' : '' }}> --}}
                                                                <input type="checkbox" id="open_flg" data-toggle="toggle" data-on="{{ config('const.man_name') }}" data-off="{{ config('const.women_name') }}" data-onstyle="primary" data-offstyle="danger">
                                                                <input type="hidden" id="gender" name="gender" value="{{ $register_mode === 'create' ? old('gender') : $data->gender }}">
                                                            </div>
                                                        </div>
                                                        <div class="form-group row">
                                                            <label class="col-md-4 col-form-label" for="email">メールアドレス<span class="text-danger">※</span></label>
                                                            <div class="col-md-8">
                                                                <input class="form-control required-text" type="text" id="email" name="email" maxlength="50" placeholder="メールアドレス" value="{{ $register_mode === 'create' ? old('email') : $data->email }}">
                                                            </div>
                                                        </div>
                                                        <div class="form-group row">
                                                            <label class="col-md-4 col-form-label" for="name">パスワード<span class="text-danger">※</span></label>
                                                            <div class="col-md-8">
                                                                <input class="form-control required-text" type="password" id="password" name="password" maxlength="50" placeholder="名前" value="{{ $register_mode === 'create' ? old('password') : $data->password }}">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-10 col-md-6">
                                                        <div class="form-group row">
                                                            <label class="col-md-4 col-form-label" for="marker_image">プロフィール画像</label>
                                                            <div class="col-md-8 user-icon-dnd-wrapper">
                                                                <div id="drop_area" class="drop_area">
                                                                    <div class="preview">
                                                                        <img id="preview" 
                                                                             {{-- src="{{ $data->image_file ? Storage::url("images/".$data->image_file) : asset('images/noImage/no_image.png') }}"  --}}
                                                                             src=""
                                                                             width="250" 
                                                                             height="200"
                                                                        >
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="form-group row">
                                                            <label class="col-md-3 col-form-label">強制削除フラグ</label>
                                                            <div class="col-md-9 form-inline">
                                                                <input type="file" id="image" name="upload_image" class="form-control-file" style="display: none">
                                                                {{-- <input type="checkbox" id="delete_flg" data-toggle="toggle" data-on="{{ __('ON') }}" data-off="{{ __('OFF') }}" data-onstyle="danger" {{ $data->image_file === config('const.out_image') ? 'checked' : '' }}> --}}
                                                                <input type="checkbox" id="delete_flg" data-toggle="toggle" data-on="{{ __('ON') }}" data-off="{{ __('OFF') }}" data-onstyle="danger">
                                                                <input type="hidden" id="delete_flg_on" name="delete_flg_on">
                                                                <input type="hidden" id="image_flg" name="image_flg" value="{{ $register_mode === 'create' ? old('') : $data->image_file }}">
                                                            </div>
                                                        </div>
                                                        <div class="form-group row">
                                                            <div id="image_delete" class="offset-md-3 col-md-9">
                                                                <input type="button" id="cancel" class="btn btn-danger" value="画像を消去">
                                                                <input type="hidden" id="img_delete" name="img_delete" value=0>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <input type="hidden" name="id" id="id" value="{{ $register_mode === 'edit' ? $data->id : null }}" />
                                                        {{-- <input type="hidden" id="register_mode" name="register_mode" value="{{ $register_mode }}" /> --}}
                                                        @include('admin.layouts.components.button.register', ['register_mode' => $register_mode])
                                                        @include('admin.layouts.components.button.cancel', ['url' => "/hcs-admin/admins/index"])
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
    </form>
</div>
@endsection
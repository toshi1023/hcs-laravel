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
                                Admin User Create
                            </div>
                        </div>
                    </h1>
                        
                    <div class="card-body">
                        <div class="container">
                            {{-- <div class="row">
                                <div class="col-md-6">

                                    <div class="form-group-lg row form-list">
                                        <label for="nickname" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('ID') }}</label>
                            
                                        <div class="col-10 col-md-8">
                                            <input id="nickname" type="nickname" class="form-control @error('nickname') is-invalid @enderror" name="nickname" value="{{ old('nickname') }}" required autocomplete="nickname" autofocus>
                                        </div>
                                    </div>
                            
                                    <br>
                                    <div class="form-group-lg row form-list">
                                        <label for="password" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('パスワード') }}</label>
                            
                                        <div class="col-10 col-md-8">
                                            <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group-lg row form-list">
                                        <label for="nickname" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('') }}</label>
                            
                                        <div class="col-10 col-md-8">
                                            <input id="nickname" type="nickname" class="form-control @error('nickname') is-invalid @enderror" name="nickname" value="{{ old('nickname') }}" required autocomplete="nickname" autofocus>
                                        </div>
                                    </div>
                            
                                    <br>
                                    <div class="form-group-lg row form-list">
                                        <label for="password" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('パスワード') }}</label>
                            
                                        <div class="col-10 col-md-8">
                                            <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">
                                        </div>
                                    </div>
                                </div>
                            </div> --}}
                            <div class="row">
                                <div class="col-12">
                                    <div class="card">
                                        <div class="card-header">
                                            管理ユーザの作成<span class="text-danger">※は必須入力</span>
                                        </div>
                                        <div class="card-body">
                                            <form class="form-horizontal" action="{{ route('hcs-admin.admins.store') }}" method="post" id="main_form" enctype='multipart/form-data'>
                                                {{ csrf_field() }}
                                                <div class="row">
                                                    <div class="col-sm-6">
                                                        <div class="form-group row">
                                                            <label class="col-md-3 col-form-label" for="name">ID<span class="text-danger">※</span></label>
                                                            <div class="col-md-9">
                                                                <input class="form-control required-text" type="text" id="email" name="email" maxlength="50" placeholder="メールアドレス" value="{{ $data->name }}" data-title="email">
                                                            </div>
                                                        </div>
                                                        <div class="form-group row">
                                                            <label class="col-md-3 col-form-label" for="name">パスワード<span class="text-danger">※</span></label>
                                                            <div class="col-md-9">
                                                                <input class="form-control required-text" type="password" id="password" name="password" maxlength="50" placeholder="名前" value="{{ $data->name }}" data-title="パスワード">
                                                            </div>
                                                        </div>
                                                        <div class="form-group row">
                                                            <label class="col-md-3 col-form-label" for="description">備考</label>
                                                            <div class="col-md-9">
                                                                <textarea class="form-control" name="description" id="description" maxlength="500" rows="10" placeholder="備考">{{ $data->memo }}</textarea>
                                                            </div>
                                                        </div>
                                                        <div class="form-group row">
                                                            <label class="col-md-3 col-form-label">公開ステータス<span class="text-danger">※</span></label>
                                                            <div class="col-md-9 form-inline" id="status_checked">
                                                                {{-- <input type="checkbox" id="open_flg" data-toggle="toggle" data-on="{{ config('const.open_name') }}" data-off="{{ config('const.private_name') }}" {{ $data->status ? 'checked' : '' }}> --}}
                                                                <input type="checkbox" id="open_flg" data-toggle="toggle">
                                                                <input type="hidden" id="status" name="status" value="{{ $data->status ? $data->status : 0}}">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-6">
                                                        <div class="form-group row">
                                                            <label class="col-md-3 col-form-label" for="marker_image">プロフィール画像</label>
                                                            <div class="col-md-9 user-icon-dnd-wrapper">
                                                                <div id="drop_area" class="drop_area">
                                                                    <div class="preview">
                                                                        <img id="preview" 
                                                                             {{-- src="{{ $data->image_file ? Storage::url("images/".$data->image_file) : asset('images/noImage/no_image.png') }}"  --}}
                                                                             src=""
                                                                             width="350" 
                                                                             height="250"
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
                                                                <input type="hidden" id="image_flg" name="image_flg" value="{{ $data->image_file ? $data->image_file : '' }}">
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
                                                        <input type="hidden" name="id" id="id" value="{{ $data->id }}" />
                                                        {{-- <input type="hidden" id="register_mode" name="register_mode" value="{{ $register_mode }}" />
                                                        @include('admin.layouts.components.button.register', ['register_mode' => $register_mode]) --}}
                                                        @include('admin.layouts.components.button.cancel', ['url' => "/hcs-admin/admins/index"])
                                                    </div>
                                                </div>
                                            </form>
                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                            
                        <div class="form-group row form-list">
                            <div class="col-form-label  col-md-10 offset-md-2">
                                <button type="submit" class="btn btn-primary login-button" style="font-size: large">
                                    {{ __('新規作成') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection
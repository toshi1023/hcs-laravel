@extends('admin.layouts.app')

@section('content')
<div class="container card-container">
    <div class="row justify-content-md-center">
        <div class="col-12 col-md-10">
            <div class="card">  
                <h1 class="card-header card-title">
                    <div class="row">
                        <div class="col-7 col-md-6">
                            {{ $register_mode === 'create' ? 'Article Create' : 'Article Edit' }}
                        </div>
                    </div>
                </h1>
                    
                <div class="card-body">
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <div class="alert alert-info content_explanation" role="alert">
                                    記事の{{ $register_mode === 'create' ? '作成' : '編集' }}を実行します<span class="text-danger">※は必須入力</span>
                                </div>
                                    <div class="card-body">
                                        <form class="form-horizontal" action="{{ $register_mode === 'create' ? route('hcs-admin.articles.store') : route('hcs-admin.articles.update', ['article' => $data->id])}}" method="post" id="main_form" enctype='multipart/form-data'>
                                            @if ($register_mode === 'create')
                                                @csrf
                                            @else
                                                @method('PUT')
                                                @csrf
                                            @endif
                                            <div class="row">
                                                <div class="col-sm-10 col-md-6">
                                                    <div class="form-group row">
                                                        <label class="col-md-4 col-form-label" for="prefecture">都道府県<span class="text-danger">※</span></label>
                                                        <div class="col-6 col-md-6">
                                                            <select id="prefecture" class="form-control" name="prefecture">
                                                                <option disabled {{ $register_mode === 'create' ? (old('prefecture') ? '' : 'selected') : ($data->prefecture ? '' : 'selected') }} >都道府県を選択してください</option>
                                                                @foreach ($prefectures as $prefecture)
                                                                    @if ($register_mode === 'create')
                                                                        <option 
                                                                            value="{{ $prefecture->name == old('prefecture') ? old('prefecture') : $prefecture->name }}" 
                                                                            {{ $prefecture->name == old('prefecture') ? 'selected' : '' }}
                                                                        >
                                                                            {{ $prefecture->name == old('prefecture') ? old('prefecture') : $prefecture->name }}
                                                                        </option>
                                                                    @endif
                                                                    @if ($register_mode === 'edit')
                                                                        <option 
                                                                            value="{{ old('prefecture') ? ($prefecture->name == old('prefecture') ? old('prefecture') : $prefecture->name) : ($prefecture->name == $data->prefecture ? $data->prefecture : $prefecture->name) }}" 
                                                                            {{ $prefecture->name == old('prefecture') || $prefecture->name == $data->prefecture ? 'selected' : '' }}
                                                                        >
                                                                            {{ old('prefecture') ? ($prefecture->name == old('prefecture') ? old('prefecture') : $prefecture->name) : ($prefecture->name == $data->prefecture ? $data->prefecture : $prefecture->name) }}
                                                                        </option>
                                                                    @endif
                                                                @endforeach
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label class="col-md-4 col-form-label" for="map">緯度・経度<span class="text-danger">※</span></label>
                                                        <div class="col-md-5">
                                                            <input class="form-control required-text" type="text" id="map" name="map" maxlength="50" placeholder="緯度・経度" value="{{ $register_mode === 'create' ? old('map') : $map }}" data-title="緯度・経度">
                                                        </div>
                                                        <div class="col-md-2">
                                                            <a href="{{ config('const.bing_url') }}" type="button" class="btn btn-primary" target="_blank" data-toggle="tooltip" title="Mapを参照" width="100"><i class="fas fa-map-marked-alt"></i></a>
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
                                                            <textarea class="form-control" name="content" id="content" maxlength="1000" rows="5" placeholder="内容">{{ $register_mode === 'create' ? old('content') : $data->content }}</textarea>
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label class="col-md-4 col-form-label">公開対象<span class="text-danger">※</span></label>
                                                        <div class="col-md-8 form-inline" id="gender_checked">
                                                            {{-- <input type="checkbox" id="open_flg" data-toggle="toggle" data-on="{{ config('const.open_name') }}" data-off="{{ config('const.private_name') }}" {{ $data->status ? 'checked' : '' }}> --}}
                                                            <input type="checkbox" id="open_flg" data-toggle="toggle" data-on="{{ config('const.member_name') }}" data-off="{{ config('const.all_name') }}" 
                                                                   data-onstyle="primary" data-offstyle="secondary" {{ $register_mode === 'create' ? (old('type') ? 'checked' : '') : ($data->type ? 'checked' : '') }}
                                                            >
                                                            <input type="hidden" id="type" name="type" value="{{ $register_mode === 'create' ? (old('type') ? old('type') : config('const.all')) : (old('type') ? old('type') : $data->type) }}">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-sm-10 col-md-6">
                                                    <div class="form-group row">
                                                        <label class="col-md-3 col-form-label" for="marker_image">投稿画像</label>
                                                        <div class="col-md-9 user-icon-dnd-wrapper">
                                                            <div id="drop_area" class="drop_area">
                                                                <div class="preview">
                                                                    <img id="preview" 
                                                                         src="{{ $register_mode === 'create' ? env('AWS_NOIMAGE') : $data->article_photo_path }}" 
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
                                                    <input type="hidden" name="image_id" id="image_id" value="{{ $register_mode === 'edit' && $data->image_id ? $data->image_id : null }}" />
                                                    <input type="hidden" name="user_id" id="user_id" value="{{ $register_mode === 'edit' ? $data->user_id : Auth::user()->id }}" />
                                                    <input type="hidden" id="register_mode" name="register_mode" value="{{ $register_mode }}" />
                                                    @include('admin.layouts.components.button.register', ['register_mode' => $register_mode])
                                                    @include('admin.layouts.components.button.cancel', ['url' => "/hcs-admin/articles"])
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
    <script type="text/javascript" src="{{ asset('js/article.js') }}"></script>
@endsection
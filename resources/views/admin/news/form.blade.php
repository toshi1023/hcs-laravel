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
<div class="row">
    <div class="col-sm-6">
        <div class="form-group row">
            <label class="col-md-4 col-form-label" for="email">メールアドレス<span class="text-danger">※</span></label>
            <div class="col-md-8">
                <input class="form-control required-text" type="text" id="email" name="email" maxlength="50" placeholder="メールアドレス" value="{{ $register_mode === 'create' ? old('email') : $data->email }}">
            </div>
        </div>
        <div class="form-group row">
            <label class="col-md-4 col-form-label" for="password">パスワード<span class="text-danger">※</span></label>
            <div class="col-md-8">
                <input class="form-control required-text" type="password" id="password" name="password" maxlength="50" placeholder="パスワード" value="{{ old('password') }}">
            </div>
        </div>
        <div class="form-group row">
            <label class="col-md-4 col-form-label" for="password_confirmation">パスワード(確認用)<span class="text-danger">※</span></label>
            <div class="col-md-8">
                <input class="form-control required-text" type="password" id="password_confirmation" name="password_confirmation" maxlength="50" placeholder="パスワード" value="">
            </div>
        </div>
    </div>
</div>
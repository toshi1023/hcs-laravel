@extends('layout')

@section('content')
<div class="container">
  <div class="menu_title">
      <p>ログイン</p>
  </div>
  <!-- 新規会員登録ボタンのフォーム -->
  <a href="{{ route('register') }}" class="btn btn-primary" style="font-size: large">新規会員登録</a>
  <br>
  <br>
</div>
<div class="container">
    <form method="POST" action="{{ route('login') }}">
        @csrf
        <div class="form-group-lg row">
            <label for="nickname" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('ニックネーム') }}</label>

            <div class="col-md-6">
                <input id="nickname" type="nickname" class="form-control @error('nickname') is-invalid @enderror" name="nickname" value="{{ old('nickname') }}" required autocomplete="nickname" autofocus>

                @error('nickname')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
            </div>
        </div>

        <br>
        <div class="form-group-lg row">
            <label for="password" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('パスワード') }}</label>

            <div class="col-md-6">
                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">

                @error('password')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
            </div>
        </div>

        <br>
        <div class="form-group row">
            <div class="col-md-6 offset-md-4">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>

                    <label class="form-check-label" for="remember">
                        {{ __('Remember Me') }}
                    </label>
                </div>
            </div>
        </div>

        <div class="form-group row mb-0">
            <div class="col-md-8 offset-md-4">
                <button type="submit" class="btn btn-primary" style="font-size: large">
                    {{ __('ログイン') }}
                </button>

                @if (Route::has('password.request'))
                    <a class="btn btn-link" href="{{ route('password.request') }}">
                        {{ __('パスワードを忘れました?') }}
                    </a>
                @endif
            </div>
        </div>
    </form>
</div>
@endsection

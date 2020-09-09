@extends('layouts.app')

@section('content')
<div class="container">
  <div class="menu_title">
      <p>ログイン</p>
  </div>
  <!-- 新規会員登録ボタンのフォーム -->
  <a href="{{ route('users.create') }}" class="btn btn-primary" style="font-size: large">新規会員登録</a>
  <br>
  <br>
</div>
<div class="container">
    <form method="POST" action="{{ route('login') }}">
        @csrf
        <div class="form-group-lg row">
            <label for="name" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('ニックネーム') }}</label>

            <div class="col-md-6">
                <input id="name" type="nickname" class="form-control @error('nickname') is-invalid @enderror" name="name" value="{{ old('name') }}" required autocomplete="name" autofocus>
            </div>
        </div>

        <br>
        <div class="form-group-lg row">
            <label for="password" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('パスワード') }}</label>

            <div class="col-md-6">
                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">
            </div>
        </div>
        <br>
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

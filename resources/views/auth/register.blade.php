@extends('layout')

@section('content')
<div class="container">
  <div class="menu_title">
      <p>新規会員登録</p>
  </div>
  <!-- ログインへリダイレクト -->
  <a href="{{ route('login') }}" class="btn btn-primary" style="font-size: large">戻る</a>
  <br>
  <br>
</div>
<div class="container">
    <form method="POST" action="{{ route('register') }}">
        @csrf
        {{-- 氏名登録フォームデザイン --}}
        <div class="form-group-lg row">
            <label for="name" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('氏名') }}</label>

            <div class="col-md-6">
                <input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="name" value="{{ old('name') }}" required autocomplete="name" autofocus>

                @error('name')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
            </div>
        </div>

        <br>
        {{-- ニックネーム登録フォームデザイン --}}
        <div class="form-group-lg row">
            <label for="nickname" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('ニックネーム') }}</label>

            <div class="col-md-6">
                <input id="nickname" type="text" class="form-control @error('nickname') is-invalid @enderror" name="nickname" value="{{ old('nickname') }}" required autocomplete="nickname" autofocus>

                @error('nickname')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
            </div>
        </div>

        <br>
        {{-- 生年月日登録フォームデザイン --}}
        @php
            $today = \Carbon\Carbon::now();
        @endphp
        <div class="form-group-lg row">
            <label for="birthday" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('生年月日') }}</label>

            <div class="col-md-6">
                <input id="birthday" type="text" class="form-control @error('birthday') is-invalid @enderror" name="birthday" value="{{ old('birthday') }}" required autocomplete="birthday" autofocus>

                @error('birthday')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
            </div>
        </div>

        <br>
        {{-- 性別登録フォームデザイン --}}
        <div class="form-group-lg row">
            <label for="gender" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('性別') }}</label>

            <div class="col-md-6">
                <input id="gender" type="text" class="form-control @error('gender') is-invalid @enderror" name="gender" value="{{ old('gender') }}" required autocomplete="gender" autofocus>

                @error('gender')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
            </div>
        </div>

        <br>
        {{-- メールアドレス登録フォームデザイン --}}
        <div class="form-group-lg row">
            <label for="email" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('メールアドレス') }}</label>

            <div class="col-md-6">
                <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email">

                @error('email')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
            </div>
        </div>

        <br>
        {{-- パスワード登録フォームデザイン --}}
        <div class="form-group-lg row">
            <label for="password" class="col-md-4 col-form-label text-md-right"  style="font-size: large">{{ __('パスワード') }}</label>

            <div class="col-md-6">
                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">

                @error('password')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
            </div>
        </div>

        <br>
        {{-- 確認用パスワード登録フォームデザイン --}}
        <div class="form-group-lg row">
            <label for="password-confirm" class="col-md-4 col-form-label text-md-right label_size" style="font-size: large">{{ __('（確認用）パスワード') }}</label>

            <div class="col-md-6">
                <input id="password-confirm" type="password" class="form-control" name="password_confirmation" required autocomplete="new-password">
            </div>
        </div>

        <br>
        <div class="form-group-lg row mb-0">
            <div class="col-md-6 offset-md-4">
                <button type="submit" class="btn btn-primary" style="font-size: large">
                    {{ __('登録') }}
                </button>
            </div>
        </div>
    </form>
    <br>
</div>
@endsection

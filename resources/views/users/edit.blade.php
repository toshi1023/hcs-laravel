@extends('layout')

@section('content')
<div class="container">
  <div class="menu_title">
      <p>会員情報を編集</p>
  </div>
  <a href="{{ route('users.index') }}" class="btn color btn-success" style="font-size: large">戻る</a>
  <br>
  <div class="container">
      <form method="POST" action="{{ route('users.update', ['user' => $user->id]) }}">
          @csrf
          @method('PUT')
          {{-- 氏名登録フォームデザイン --}}
          <div class="form-group-lg row">
              <label for="name" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('氏名') }}</label>

              <div class="col-md-6">
                  <input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="name" value="{{ old('name') ?? $user->name }} " required autocomplete="name" autofocus>
              </div>
          </div>

          <br>
          {{-- ニックネーム登録フォームデザイン --}}
          <div class="form-group-lg row">
              <label for="nickname" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('ニックネーム') }}</label>

              <div class="col-md-6">
                  <input id="nickname" type="text" class="form-control @error('nickname') is-invalid @enderror" name="nickname" value="{{ old('nickname') ?? $user->nickname }}" required autocomplete="nickname" autofocus>
              </div>
          </div>

          <br>
          {{-- 都道府県登録フォームデザイン --}}
          <div class="form-group-lg row">
              <label for="prefecture" class="col-md-4 col-form-label text-md-right" style="font-size: large">
                {{ __('都道府県') }}
              </label>

              <div class="col-md-6">
                  <select id="prefecture" class="form-control" name="prefecture">
                    <option value="{{ old('prefecture') ?? $user->prefecture }}" selected>
                      {{ old('prefecture') ?? $user->prefecture }}
                    </option>
                    <option>都道府県を選択してください</option>
                    @foreach ($prefectures as $prefecture)
                      <option value="{{ $prefecture->name }}">{{ $prefecture->name }}</option>
                    @endforeach
                  </select>
              </div>
          </div>

          <br>
          {{-- 生年月日登録フォームデザイン --}}
          <div class="form-group-lg row">
              <label for="birthday" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('生年月日') }}</label>

              <div class="col-md-6">
                  <input id="birthday" type="text" class="form-control @error('birthday') is-invalid @enderror" name="birthday" value="{{ old('birthday') ?? $user->birthday }}" required autocomplete="birthday" autofocus>
              </div>
          </div>

          <br>
          {{-- 性別登録フォームデザイン --}}
          <div class="form-group-lg row">
              <label for="gender" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('性別') }}</label>

              <div class="col-md-6">
                  <input id="gender-m" type="radio" class="@error('gender') is-invalid @enderror" name="gender" value=0 required autocomplete="gender" autofocus>
                  <label for="gender-m" style="font-size: large">男性</label>　
                  <input id="gender-f" type="radio" class="@error('gender') is-invalid @enderror" name="gender" value=1 required autocomplete="gender" autofocus>
                  <label for="gender-f" style="font-size: large">女性</label>
              </div>
          </div>

          <br>
          {{-- メールアドレス登録フォームデザイン --}}
          <div class="form-group-lg row">
              <label for="email" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('メールアドレス') }}</label>

              <div class="col-md-6">
                  <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') ?? $user->email }}" required autocomplete="email">
              </div>
          </div>

          <br>
          {{-- パスワード登録フォームデザイン --}}
          <div class="form-group-lg row">
              <label for="password" class="col-md-4 col-form-label text-md-right"  style="font-size: large">{{ __('パスワード') }}</label>

              <div class="col-md-6">
                  <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password">
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

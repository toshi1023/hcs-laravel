@extends('layout')

@section('content')
  <div class="container">
    <div class="menu_title">
        <p>記事の作成</p>
    </div>
    <!-- ログインへリダイレクト -->
    <a href="{{ route('articles.index') }}" class="btn btn-primary" style="font-size: large">戻る</a>
    <br>
    <br>
  </div>
  <div class="container">
      <form method="POST" action="{{ route('articles.create') }}">
          @csrf
          {{-- 都道府県登録フォームデザイン --}}
          <div class="form-group-lg row">
            <label for="prefecture" class="col-md-4 col-form-label text-md-right" style="font-size: large">
              都道府県
            </label>
            <div class="col-md-6">
              <select id="prefecture" class="form-control">
                <option selected >都道府県を選択してください</option>
                <option value="{{ old('prefecture') }}">{{ old('prefecture') }}</option>
              </select>
            </div>
          </div>

          <br>
          {{-- タイトル登録フォームデザイン --}}
          <div class="form-group-lg row">
              <label for="title" class="col-md-4 col-form-label text-md-right" style="font-size: large">タイトル</label>
              <div class="col-md-6">
                <input type="text" class="form-control" name="title" id="title" value="{{ old('title') }}" />
              </div>
          </div>

          <br>
          {{-- 内容登録フォームデザイン --}}
          <div class="form-group-lg row">
              <label for="content" class="col-md-4 col-form-label text-md-right" style="font-size: large">内容</label>
              <div class="col-md-6">
                <textarea class="form-control" rows="10" cols="60" name="content" id="content" value="{{ old('content') }}"></textarea>
              </div>
          </div>
          <br>
          <div class="form-group row mb-0">
              <div class="col-md-8 offset-md-4">
                <button type="submit" class="btn btn-primary" style="font-size: large">内容登録</button>
              </div>
          </div>
          <br>
      </form>
  </div>
@endsection

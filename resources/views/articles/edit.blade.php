@extends('layouts.app')

@section('content')
<div class="container">
  <div class="menu_title">
      <p>{{ $article->user->nickname }}さんの記事を編集</p>
  </div>
  <a href="{{ route('articles.show', ['article' => $article->id]) }}" class="btn btn-success" style="font-size: large">戻る</a>
  <br>
  <br>
  <div class="container">
      <!-- 編集(update)の時はform actionの値の変更を忘れないように！ -->
      <!-- form methodのところを直接PUTにしても値の変更が反映されない事象が起きるため、 -->
      <!-- @method('PUT')を徹底する -->
      <form method="POST" action="{{ route('articles.update', ['article' => $article->id]) }}">
          @csrf
          <!-- これも編集(update)のときは忘れないように！ -->
          @method('PUT')
          {{-- 作成者登録フォームデザイン（隠しフォーム） --}}
          <input type="hidden" name="user_id" value="{{ old('user_id') ?? Auth::user()->id }}">
          {{-- 都道府県登録フォームデザイン --}}
          <div class="form-group-lg row">
            <label for="prefecture" class="col-md-4 col-form-label text-md-right" style="font-size: large">
              都道府県
            </label>
            <div class="col-md-6">
              <!-- name属性を設定しないと、Requestクラスオブジェクトで選択値を受け取ることが出来ない -->
              <select id="prefecture" class="form-control" name="prefecture">
                <option value="{{ old('prefecture') ?? $article->prefecture }}" selected>
                  {{ old('prefecture') ?? $article->prefecture }}
                </option>
                <option>都道府県を選択してください</option>
                @foreach ($prefectures as $prefecture)
                  <option value="{{ $prefecture->name }}">{{ $prefecture->name }}</option>
                @endforeach
              </select>
            </div>
          </div>

          <br>
          {{-- タイトル登録フォームデザイン --}}
          <div class="form-group-lg row">
              <label for="title" class="col-md-4 col-form-label text-md-right" style="font-size: large">タイトル</label>
              <div class="col-md-6">
                <input type="text" class="form-control" name="title" id="title" value="{{ old('title') ?? $article->title }}" />
              </div>
          </div>

          <br>
          {{-- 内容登録フォームデザイン --}}
          <div class="form-group-lg row">
              <label for="content" class="col-md-4 col-form-label text-md-right" style="font-size: large">内容</label>
              <div class="col-md-6">
                <!-- テキストエリアのvalue値は設定できない -->
                <textarea class="form-control" rows="10" cols="60" name="content" id="content">{{ old('content') ?? $article->content }}</textarea>
              </div>
          </div>
          <br>
          <!-- 女性限定公開オプションのデザイン -->
          <div class="form-group-lg row">
              <label for="women_only" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('女性に限定して公開') }}</label>
              <div class="col-md-6">
                <button type="button" class="btn btn-outline-danger" name="women_only" id="women_only" data-toggle="button" aria-pressed="false" style="font-size: large">
                  設定しない
                </button>
                <input type="hidden" name="women_only" id="women_only" value="{{ old('women_only') ?? $article->women_only }}">
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
</div>
@endsection

@extends('layouts.app')

@section('content')
  <div class="container">
    <div class="menu_title">
        <p>{{ $article->user->nickname }}さんの記事</p>
    </div>
    <a href="{{ route('articles.index') }}" class="btn color btn-success" style="font-size: large">戻る</a>　
    <!-- 非会員もしくは記事作成者以外には表示しない -->
    @if(Auth::check())
      @if($article->user_id === Auth::user()->id)
        <a href="{{ route('articles.edit', ['article' => $article->id]) }}" class="btn btn-primary" style="font-size: large">
          記事の編集
        </a>
      @endif
    @endif
    <br>
    <br>
    <div class="row">
        <div class="col-sm-12">
            <table class="table">
              <thead class="thead-dark list_theme">
                      <th scope="col">都道府県</th>
                      <td class="list_background">{{ $article->prefecture }}</td>
              </thead>
              <thead class="thead-dark list_theme">
                    <th scope="col">タイトル</th>
                    <td class="list_background">{{ $article->title }}</td>
              </thead>
              <thead class="thead-dark list_theme">
                    <th scope="col">内容</th>
                    <td class="list_background">{{ $article->content }}</td>
              </thead>
              <thead class="thead-dark list_theme">
                    <th scope="col">作成日時</th>
                    <td class="list_background">{{ $article->updated_at }}</th>
              </thead>
              <thead class="thead-dark list_theme">
                      <th scope="col">リンク</th>
                      <td class="list_background">
                        @if(Auth::check())
                          <a href="{{ route('users.show', [ 'user' => $article->user_id]) }}">
                            {{ $article->user->nickname }}さんのページへ行く
                          </a>
                        @else
                          {{ $article->user->nickname }}さんのページへ行く
                        @endif
                      </td>
              </thead>
            </table>
        </div>
      </div>
      <br>
      <!-- 非会員もしくは記事作成者以外には表示しない -->
      @if(Auth::check())
        @if($article->user_id === Auth::user()->id)
          <form method="post" action="{{ route('articles.destroy', ['article' => $article->id]) }}">
            @csrf
            @method('DELETE')
            <button type="submit" class="btn btn-danger" style="font-size: large">
              記事の削除
            </button>
          </form>
        @endif
      @endif
  </div>
@endsection

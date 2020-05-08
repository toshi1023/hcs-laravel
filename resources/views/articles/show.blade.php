@extends('layout')

@section('content')
  <div class="container">
    <div class="menu_title">
        <p>{{ $user->nickname }}さんの記事</p>
    </div>
    <a href="{{ route('articles.index') }}" class="btn btn-primary" style="font-size: large">戻る</a>
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
                        <a href="{{ route('users.show', [ 'user' => $user->id]) }}">
                          {{ $user->nickname }}さんのページへ行く
                        </a>
                      </td>
              </thead>
            </table>
        </div>
      </div>
  </div>
@endsection

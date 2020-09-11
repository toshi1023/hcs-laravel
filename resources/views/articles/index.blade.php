@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="menu_title">
            <p>みんなの記事</p>
        </div>
        @if(Auth::check())
          <a href="{{ route('articles.create') }}" class="btn btn-primary" style="font-size: large">新規作成</a>
        @else
          <div class="top_text">
            <p style="color: rgb(156, 4, 5);">記事の作成にはログインが必須です！</p>
          </div>
        @endif
        <br>
        <br>
          <div class="row">
              <div class="col-sm-12">
                  <table class="table">
                      <thead class="thead-dark list_theme">
                          <tr>
                              <th scope="col">日時</th>
                              <th scope="col">都道府県</th>
                              <th scope="col">名前</th>
                              <th scope="col">タイトル</th>
                              <th scope="col">操作</th>
                          </tr>
                      </thead>
                      <tbody>
                        <!-- 女性限定公開フラグがある場合は女性しか記事が見られないように設定 -->
                        @if(Auth::check() && Auth::user()->gender === 1)
                          @foreach ($articles as $article)
                            <tr class="list_background">
                                <th scope="row">{{ $article->updated_at }}</th>
                                <td>{{ $article->prefecture }}</td>
                                <!-- 性別によって名前の色表示を切り替え -->
                                @if($article->user->gender === 0)
                                  <td style="color: rgb(3, 32, 173);">{{ $article->user->name }}</td>
                                @else
                                  <td style="color: red;">{{ $article->user->name }}</td>
                                @endif
                                <td>{{ $article->title }}</td>
                                <td><a href="{{ route('articles.show', [ 'article' => $article->id]) }}">詳細</a></td>
                            </tr>
                          @endforeach
                        @else
                          @foreach ($free_articles as $free_article)
                            <tr class="list_background">
                                <th scope="row">{{ $free_article->updated_at }}</th>
                                <td>{{ $free_article->prefecture }}</td>
                                <!-- 性別によって名前の色表示を切り替え -->
                                @if($free_article->user->gender === 0)
                                  <td style="color: rgb(3, 32, 173);">{{ $free_article->user->name }}</td>
                                @else
                                  <td style="color: red;">{{ $free_article->user->name }}</td>
                                @endif
                                <td>{{ $free_article->title }}</td>
                                <td><a href="{{ route('articles.show', [ 'article' => $free_article->id]) }}">詳細</a></td>
                            </tr>
                          @endforeach
                        @endif
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
@endsection

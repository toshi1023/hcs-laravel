@extends('layout')

@section('content')
    <div class="container">
        <div class="menu_title">
            <p>みんなの記事</p>
        </div>
        <a href="{{ route('articles.create') }}" class="btn btn-primary" style="font-size: large">新規作成</a>
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
                        <tr class="list_background">
                          @foreach ($articles as $article)
                            <th scope="row">{{ $article->updated_at }}</th>
                            <td>{{ $article->prefecture }}</td>
                            <td>aaa</td>
                            <td>{{ $article->title }}</td>
                            <td><a href="#">詳細</a></td>
                          @endforeach
                        </tr>
                        <tr class="list_background">
                            <th scope="row">2020年5月1日</th>
                            <td>大阪府</td>
                            <td>aaa</td>
                            <td>初めての投稿</td>
                            <td><a href="#">詳細</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
@endsection

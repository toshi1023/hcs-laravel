@extends('layouts.app')

@section('content')
<div class="container">
    <div class="menu_title">
        <p>{{ $user->nickname }}さんのページ</p>
    </div>
    <a href="{{ route('users.index') }}" class="btn btn-success" style="font-size: large">戻る</a>　
    @if($user->id === Auth::user()->id)
      <a href="{{ route('users.edit', ['user' => $user->id]) }}" class="btn btn-primary" style="font-size: large">会員情報を編集</a>
    @endif
    <br>
    <br>
    <div class="row">
        <div class="col-sm-12">
            <table class="table">
              <thead class="thead-dark list_theme">
                <th scope="col">プロフィール画像</th>
                <td class="list_background"><img src="{{ $user->prof_photo_path }}" width="200" height="120"></td>
              </thead>
              <thead class="thead-dark list_theme">
                    <th scope="col">ニックネーム</th>
                    <td class="list_background">{{ $user->nickname }}</td>
              </thead>
              <thead class="thead-dark list_theme">
                      <th scope="col">都道府県</th>
                      <td class="list_background">{{ $user->prefecture }}</td>
              </thead>
              <thead class="thead-dark list_theme">
                    <th scope="col">生年月日</th>
                    <td class="list_background">{{ $user->birthday }}</td>
              </thead>
              <thead class="thead-dark list_theme">
                <th scope="col">性別</th>
                    @if( $user->gender === 0 )
                        <td class="list_background">男性</td>
                    @else
                        <td class="list_background">女性</td>
                    @endif
              </thead>

              <thead class="thead-dark list_theme">
                    <th scope="col">メールアドレス</th>
                    <td class="list_background">{{ $user->email }}</th>
              </thead>
              <thead class="thead-dark list_theme">
                    <th scope="col">情報更新日</th>
                    <td class="list_background">{{ $user->updated_at }}</th>
              </thead>
            </table>
          </div>
        </div>
@endsection

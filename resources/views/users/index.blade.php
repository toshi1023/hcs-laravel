@extends('layouts.app')

@section('content')
  <div class="container">
    <div class="menu_title">
        <p>会員一覧</p>
    </div>
    <!-- 非会員には会員一覧を表示しないように制限 -->
    @if(Auth::check())
      <a href="users/pdf" class="btn btn-success" style="font-size: large">PDF出力</a>
      <br>
      <br>
      <div class="row">
          <div class="col-sm-12">
              <table class="table">
                  <thead class="thead-dark list_theme">
                      <tr>
                          <th scope="col">ニックネーム</th>
                          <th scope="col">都道府県</th>
                          <th scope="col">生年月日</th>
                          <th scope="col">性別</th>
                          <th scope="col">操作</th>
                      </tr>
                  </thead>
                  <tbody>
                    @foreach ($users as $user)
                      <tr class="list_background">
                          <td>{{ $user->nickname }}</td>
                          <td>{{ $user->prefecture }}</td>
                          <td>{{ $user->birthday }}</td>
                          @if( $user->gender === 0 )
                              <td class="list_background" style="color: rgb(3, 32, 173);">男性</td>
                          @else
                              <td class="list_background" style="color: red;">女性</td>
                          @endif
                          <td><a href="{{ route('users.show', [ 'user' => $user->id]) }}">詳細</a></td>
                      </tr>
                    @endforeach
                  </tbody>
              </table>
          </div>
      </div>
    @else
      <div class="top_text">
        <p style="color: rgb(156, 4, 5);">会員の閲覧にはログインが必須です！</p>
      </div>
    @endif
  </div>
@endsection

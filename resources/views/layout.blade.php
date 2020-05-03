<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HitcHike Community Space</title>
    <!-- cssの呼び出し -->
    <link href="{{ asset('css/styles.css') }}" rel="stylesheet">
    {{-- bootstrapの呼び出し --}}
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
</head>
<body>
  <header>
    <div class="container">
      <div class="title">
          <h1>HitcHike Community Space</h1>
      </div>
    </div>
    <div class="container">
      <!-- ログインしているかをチェック -->
      @if(Auth::check())
        <nav class="menubar">
            <ul>
                <li><a href="/">TOP</a></li>
                <li><a href="{{ route('articles.index') }}">記事一覧</a></li>
                <li><a href="#">友達検索</a></li>
                <li><a href="#">マイページ</a></li>
                <li><a href="#" id="logout">ログアウト</a></li>
                <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                  @csrf
                </form>
            </ul>
        </nav>
      @else
        <nav class="menubar">
            <ul>
                <li><a href="/">TOP</a></li>
                <li><a href="{{ route('articles.index') }}">記事一覧</a></li>
                <li><a href="#">友達検索</a></li>
                <li><a href="{{ route('login') }}">ログイン</a></li>
            </ul>
        </nav>
      @endif
    </div>
  </header>
  <main>
    @yield('content')
  </main>
  @yield('scripts')
  <!-- bootstrapの呼び出し -->
  <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
  <!-- ログアウト処理 -->
  @if(Auth::check())
    <script>
      document.getElementById('logout').addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('logout-form').submit();
      });
    </script>
  @endif
</body>
</html>

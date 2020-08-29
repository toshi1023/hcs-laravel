<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HitcHike Community Space</title>
    <!-- cssの呼び出し -->
    <link href="{{ asset('css/styles.css') }}" rel="stylesheet">
    <link href="{{ asset('css/admin-style.css') }}" rel="stylesheet">
    {{-- bootstrapの呼び出し --}}
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <!-- Title -->
    <link href="https://fonts.googleapis.com/css2?family=Cabin+Sketch:wght@400;700&display=swap" rel="stylesheet">
  </head>
<body class="body">
  <header>
    {{-- <div id="app"></div> --}}
    {{-- <div class="container">
      <!-- ログインしているかをチェック -->
      @if(Auth::check())
        <nav class="menubar">
            <ul>
                <li><a href="/">TOP</a></li>
                <li><a href="{{ route('articles.index') }}">記事一覧</a></li>
                <li><a href="{{ route('users.index') }}">友達検索</a></li>
                <li><a href="{{ route('users.show', [ 'user' => Auth::user()->id]) }}">マイページ</a></li>
                <li><a href="#" id="logout">ログアウト</a></li>
                <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                  @csrf
                </form>
                <div class="right">
                  <p>Welcome {{ Auth::user()->name }} さん!</p>
                </div>
            </ul>
        </nav>
      @else
        <nav class="menubar">
            <ul>
                <li><a href="/">TOP</a></li>
                <li><a href="{{ route('articles.index') }}">記事一覧</a></li>
                <li><a href="{{ route('users.index') }}">友達検索</a></li>
                <li><a href="{{ route('login') }}">ログイン</a></li>
            </ul>
        </nav>
      @endif
    </>
    <div class="container">
      <!-- フラッシュメッセージ -->
      @if (session('message'))
          <div class="alert alert-success" style="font-size: large">{{ session('message') }}</div>
      @endif
    </div>
    <div class="container">
      @if($errors->any())
        <div class="alert alert-danger">
          @foreach($errors->all() as $message)
            <li style="font-size: large">{{ $message }}</li>
          @endforeach
        </div>
      @endif
    </div> --}}

  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" style="font-size: 25px; font-family: 'Cabin Sketch', cursive;" href="/hcs-admin">HitcHike Community Space Admin</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
      <ul class="navbar-nav">
        {{-- @if(Auth::check()) --}}
          <li class="nav-item active">
            <a class="nav-link menu-list" href="#">Home <span class="sr-only">(current)</span></a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link menu-list dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              管理ユーザ
            </a>
            <div class="dropdown">
              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a class="dropdown-item menu-list" href="#">管理ユーザ一覧</a>
                <a class="dropdown-item menu-list" href="#">管理ユーザ作成</a>
              </div>
            </div>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link menu-list dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              ユーザ
            </a>
            <div class="dropdown">
              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a class="dropdown-item menu-list" href="#">ユーザ一覧</a>
                <a class="dropdown-item menu-list" href="#">ユーザ作成</a>
                <a class="dropdown-item menu-list" href="#">フレンド履歴</a>
              </div>
            </div>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link menu-list dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              記事
            </a>
            <div class="dropdown">
              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a class="dropdown-item menu-list" href="#">記事一覧</a>
                <a class="dropdown-item menu-list" href="#">記事作成</a>
              </div>
            </div> 
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link menu-list dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              メッセージ
            </a>
            <div class="dropdown">
              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a class="dropdown-item menu-list" href="#">メッセージ履歴</a>
                <a class="dropdown-item menu-list" href="#">メッセージ設定</a>
              </div>
            </div> 
          </li>
          {{-- <li class="nav-item dropdown">
            <a class="nav-link menu-list" href="#" id="logout">ログアウト</a>
          </li>
          <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
            @csrf
          </form> --}}
        {{-- @endif --}}
        <li class="nav-item">
          <a class="nav-link menu-list" href="{{ route('hcs-admin.login') }}">ログイン</a>
        </li>
      </ul>
    </div>
  </nav>
  </header>
  <main>
    @yield('content')
  </main>
  <!-- bootstrapの呼び出し -->
  <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>

  {{-- トグルメニューの閉じる操作(リンク押下後) --}}
  <script>
    $(document).on('click','.navbar-collapse',function(e) {
        if( $(e.target).is('a') ) {
            $(this).collapse('hide');
        }
    });
  </script>

  <!-- ログアウト処理 -->
  @if(Auth::check())
    <script>
      document.getElementById('logout').addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('logout-form').submit();
      });
    </script>
  @endif

  <!-- Scripts -->
  <script src="{{ asset('js/hcs.js') }}"></script>
  @yield('scripts')
</body>
</html>

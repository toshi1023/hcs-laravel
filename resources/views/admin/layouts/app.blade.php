<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>HitcHike Community Space</title>
    <!-- cssの呼び出し -->
    <link href="{{ asset('css/styles.css') }}" rel="stylesheet">
    <link href="{{ asset('css/admin-style.css') }}" rel="stylesheet">
    {{-- bootstrapの呼び出し --}}
    {{-- <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"> --}}
    {{-- <link href="https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css" rel="stylesheet"> --}}
    <!-- TitleのCSSデザイン -->
    <link href="https://fonts.googleapis.com/css2?family=Cabin+Sketch:wght@400;700&display=swap" rel="stylesheet">
    {{-- DataTables --}}
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.10.18/css/dataTables.bootstrap4.min.css">
    <link href="https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/css/bootstrap4-toggle.min.css" rel="stylesheet">
    {{-- CoreUI --}}
    {{-- <link rel="stylesheet" href="https://unpkg.com/@coreui/coreui/dist/css/coreui.min.css"> --}}
    <link rel="stylesheet" href="{{ asset('css/coreui.min.css')}}">
</head>
<body class="body">
  <div class="col-12">
    <header>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" id="top_title" style="font-size: 25px; font-family: 'Cabin Sketch', cursive;" href="{{ route('hcs-admin.home') }}"></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
          <ul class="navbar-nav">
            @if(Auth::check('admin'))
              <li class="nav-item active">
                <a class="nav-link menu-list" href="{{ route('hcs-admin.home') }}">Home</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link menu-list dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  ユーザ
                </a>
                <div class="dropdown">
                  <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item menu-list" href="{{ route('hcs-admin.users.index') }}">ユーザ一覧</a>
                    <a class="dropdown-item menu-list" href="{{ route('hcs-admin.users.create') }}">ユーザ作成</a>
                  </div>
                </div>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link menu-list dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  記事
                </a>
                <div class="dropdown">
                  <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item menu-list" href="{{ route('hcs-admin.articles.index') }}">記事一覧</a>
                    <a class="dropdown-item menu-list" href="{{ route('hcs-admin.articles.create') }}">記事作成</a>
                  </div>
                </div> 
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link menu-list dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  ニュース
                </a>
                <div class="dropdown">
                  <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item menu-list" href="{{ route('hcs-admin.news.index') }}">ニュース一覧</a>
                    <a class="dropdown-item menu-list" href="{{ route('hcs-admin.news.create') }}">ニュース作成</a>
                  </div>
                </div> 
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link menu-list" href="#" id="logout">ログアウト</a>
              </li>
              <form id="logout-form" action="{{ route('hcs-admin.logout') }}" method="POST" style="display: none;">
                @csrf
              </form>
            @else
              <li class="nav-item">
                <a class="nav-link menu-list" href="{{ route('hcs-admin.login') }}">ログイン</a>
              </li>
            @endif
          </ul>
        </div>
      </nav>
      </header>
    
    <main>
      <div class="row justify-content-md-center">
        <div class="col align-self-center col-md-7">
          {{-- エラーメッセージ --}}
          @if ($errors->any())
          <div class="alert alert-danger">
          <ul>
              @foreach ($errors->all() as $error)
                  <li class="error_message">{{ $error }}</li>
              @endforeach
          </ul>
          </div>
          @endif
          <!-- フラッシュメッセージ -->
          @if (session('info_message'))
            <div class="alert alert-success" style="font-size: large">{{ session('info_message') }}</div>
          @endif
        </div>
      </div>
      
      <div class="row">
        <div class="col-12 offset-md-1 col-md-10 offset-md-1">
          <span class="title-text">
            @yield('title')
          </span>
        </div>
      </div>

      @yield('content')
    </div>
  </main>
  <!-- bootstrapの呼び出し -->
  {{-- <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
   --}}
   <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
   <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
  {{-- <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script> --}}
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/js/bootstrap4-toggle.min.js"></script>
  {{-- <script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script> --}}

  {{-- DataTables --}}
  <script src="https://cdn.datatables.net/1.10.18/js/jquery.dataTables.min.js"></script>
  <script src="https://cdn.datatables.net/1.10.18/js/dataTables.bootstrap4.min.js"></script>
  {{-- ajax --}}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
  {{-- CoreUI --}}
  <script src="https://unpkg.com/@coreui/coreui/dist/js/coreui.bundle.min.js"></script>
  {{-- 日付フォーマットのライブラリ --}}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/locale/ja.js"></script>

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
  <script src="{{ asset('js/vendor/short-and-sweet.min.js') }}" ></script>
  <script type="text/javascript" src="{{ asset('js/hcs.js') }}"></script>
  <script type="text/javascript" src="{{ asset('js/common.js') }}"></script>
  @yield('scripts')

</body>
</html>

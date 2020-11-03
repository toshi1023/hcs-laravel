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
    <!-- TitleのCSSデザイン -->
    <link href="https://fonts.googleapis.com/css2?family=Cabin+Sketch:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
  <header>
    <div id="app"></div>
  </header>
  <main>
    @yield('content')
  </main>
  <script src="{{ asset('js/app.js') }}" defer></script>
  @yield('scripts')
</body>
</html>

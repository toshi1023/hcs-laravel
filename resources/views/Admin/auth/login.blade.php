@extends('Admin.layouts.app')

@section('content')
<div class="container">
    <form method="POST" action="{{ route('login') }}">
        @csrf
        <div class="row justify-content-md-center">
            <div class="col-md-6">
                <div class="card">  
                    <h1 class="card-header card-title">
                        <div class="row">
                            <div class="col-4 col-md-3">
                                Login
                            </div>
                            <div class="col-3 offset-5 col-md-3 offset-md-6">
                                <a href="{{ route('users.create') }}" class="btn btn-info" style="font-size: large">新規登録</a>
                            </div>
                        </div>
                    </h1>
                        
                    <div class="card-body">
                        <div class="form-group-lg row">
                            <label for="nickname" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('ニックネーム') }}</label>
                
                            <div class="col-10 col-md-6">
                                <input id="nickname" type="nickname" class="form-control @error('nickname') is-invalid @enderror" name="nickname" value="{{ old('nickname') }}" required autocomplete="nickname" autofocus>
                            </div>
                        </div>
                
                        <br>
                        <div class="form-group-lg row">
                            <label for="password" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('パスワード') }}</label>
                
                            <div class="col-10 col-md-6">
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">
                            </div>
                        </div>
                        <br>
                        <div class="form-group row mb-0">
                            <div class="col-md-8 offset-md-4">
                                <button type="submit" class="btn btn-primary" style="font-size: large">
                                    {{ __('ログイン') }}
                                </button>
                
                                @if (Route::has('password.request'))
                                    <a class="btn btn-link" href="{{ route('password.request') }}">
                                        {{ __('パスワードを忘れました?') }}
                                    </a>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

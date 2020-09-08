@extends('admin.layouts.app')

@section('content')
<div class="container card-container">
    <form method="POST" action="{{ route('hcs-admin.login') }}">
        @csrf
        <div class="row justify-content-md-center">
            <div class="col-md-6">
                <div class="card">  
                    <h1 class="card-header card-title">
                        <div class="row">
                            <div class="col-4 col-md-3">
                                Login
                            </div>
                        </div>
                    </h1>
                        
                    <div class="card-body">
                        <div class="form-group row">
                            <label for="nickname" class="col-4 col-md-4 col-form-label text-md-right login-text">{{ __('メールアドレス') }}</label>
                
                            <div class="col-6 col-md-6">
                                <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="nickname" autofocus>
                            </div>
                        </div>
                
                        <br>
                        <div class="form-group row">
                            <label for="password" class="col-4 col-md-4 col-form-label text-md-right login-text">{{ __('パスワード') }}</label>
                
                            <div class="col-6 col-md-6">
                                <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">
                            </div>
                        </div>
                        <br>
                        <div class="form-group row mb-0">
                            <div class="col-md-8 offset-md-4">
                                <button type="submit" class="btn btn-primary">
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

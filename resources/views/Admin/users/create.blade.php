@extends('Admin.layouts.app')

@section('content')
<div class="container card-container">
    <form method="POST" action="{{ route('hcs-admin.admins.store') }}">
        @csrf
        <div class="row justify-content-md-center">
            <div class="col-12 col-md-10">
                <div class="card">  
                    <h1 class="card-header card-title">
                        <div class="row">
                            <div class="col-7 col-md-6">
                                Admin User Create
                            </div>
                        </div>
                    </h1>
                        
                    <div class="card-body">
                        <div class="container">
                            <div class="row">
                                <div class="col-md-6">

                                    <div class="form-group-lg row form-list">
                                        <label for="nickname" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('ID') }}</label>
                            
                                        <div class="col-10 col-md-8">
                                            <input id="nickname" type="nickname" class="form-control @error('nickname') is-invalid @enderror" name="nickname" value="{{ old('nickname') }}" required autocomplete="nickname" autofocus>
                                        </div>
                                    </div>
                            
                                    <br>
                                    <div class="form-group-lg row form-list">
                                        <label for="password" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('パスワード') }}</label>
                            
                                        <div class="col-10 col-md-8">
                                            <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group-lg row form-list">
                                        <label for="nickname" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('ID') }}</label>
                            
                                        <div class="col-10 col-md-8">
                                            <input id="nickname" type="nickname" class="form-control @error('nickname') is-invalid @enderror" name="nickname" value="{{ old('nickname') }}" required autocomplete="nickname" autofocus>
                                        </div>
                                    </div>
                            
                                    <br>
                                    <div class="form-group-lg row form-list">
                                        <label for="password" class="col-md-4 col-form-label text-md-right" style="font-size: large">{{ __('パスワード') }}</label>
                            
                                        <div class="col-10 col-md-8">
                                            <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                            
                        <div class="form-group row form-list">
                            <div class="col-form-label  col-md-10 offset-md-2">
                                <button type="submit" class="btn btn-primary login-button" style="font-size: large">
                                    {{ __('新規作成') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@endsection
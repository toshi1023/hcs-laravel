@extends('admin.layouts.app')

@section('content')
<div class="container card-container">
    <div class="row justify-content-md-center">
        <div class="col-12 col-md-10">
            <div class="card">  
                <h1 class="card-header card-title">
                    <div class="row">
                        <div class="col-7 col-md-6">
                            {{ $register_mode === 'create' ? 'User Create' : 'User Edit' }}
                        </div>
                    </div>
                </h1>
                    
                <div class="card-body">
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <div class="alert alert-info content_explanation" role="alert">
                                    ユーザの{{ $register_mode === 'create' ? '作成' : '編集' }}を実行します<span class="text-danger">※は必須入力</span>
                                </div>
                                    <div class="card-body">
                                        <form class="form-horizontal" action="{{ route('hcs-admin.users.store') }}" method="post" id="main_form" enctype='multipart/form-data'>
                                            @method('PUT')
                                            @csrf
                                            @include('admin.users.form', ['register_mode' => $register_mode, 'data' => $data])
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <input type="hidden" name="id" id="id" value="{{ $register_mode === 'edit' ? $data->id : null }}" />
                                                    {{-- <input type="hidden" id="register_mode" name="register_mode" value="{{ $register_mode }}" /> --}}
                                                    @include('admin.layouts.components.button.register', ['register_mode' => $register_mode])
                                                    @include('admin.layouts.components.button.cancel', ['url' => "/hcs-admin/users"])
                                                </div>
                                            </div>
                                        </form>
                    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
    <script type="text/javascript" src="{{ asset('js/user.js') }}"></script>
@endsection
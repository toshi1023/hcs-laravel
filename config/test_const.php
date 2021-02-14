<?php

// 共通する値をキー&バリューで管理
return [
    /**
     * 値リスト
     */
    // URL
    'login_url'         => '/hcs-admin/login',
    'home_url'          => '/hcs-admin/home',

    // element
    'email'             => 'email',
    'password'          => 'password',

    // DBのカラム名
    'db_column_status'         => 'status',

    // DBの値
    'db_value_password_error'   => 'test1234',
    'db_value_password_success' => 'root1234',

    
    /**
     * メッセージリスト
     */
    // メッセージ
    'admin_login_message'             => '管理者ページです',

    // エラーメッセージ
    'admin_login_error_message'       => 'ニックネームまたはパスワードに誤りがあります。',

];
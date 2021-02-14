<?php

// 共通する値をキー&バリューで管理
return [

    /**
     * 値リスト
     */
    // 性別
    'women'         => 0,
    'man'           => 1,
    'women_name'    => '女性',
    'man_name'      => '男性',

    // 公開フラグ
    'public'         => 0,
    'private'        => 1,
    'public_name'    => '公開',
    'private_name'   => '非公開',

    // アカウントステータス
    'app_member'            => 1,               // (一般)会員ユーザー
    'app_unsubscribe'       => 2,               // (一般)退会済み
    'app_admin'             => 3,               // (管理者)運営管理者
    'app_account_stop'      => 4,               // (一般)アカウント停止
    'app_member_name'       => '会員',          // (一般)会員ユーザー
    'app_unsubscribe_name'  => '退会済み',       // (一般)退会済み
    'app_admin_name'        => '運営管理者',     // (管理者)運営管理者
    'app_account_stop_name' => 'アカウント停止', // (一般)アカウント停止
    
    // 対象フラグ
    'all'           => 0,
    'member'        => 1,
    'all_name'      => '全員',
    'member_name'   => '会員限定',

    // フレンドの申請フラグ
    'apply'             => 1,
    'approval'          => 2,
    'reject'            => 3,
    'apply_name'        => '申請中',
    'approval_name'     => '承認済み',
    'reject_name'       => '却下',

    // ニュースの種別フラグ
    'official'          => 1,
    'alert'             => 2,
    'official_name'     => '公式情報',
    'alert_name'        => '警告',

    // 画像差し替えフラグ
    'no_image'       => 'NoImage',
    'out_image'      => 'OutImage',
    'no_image_path'  => '',
    'out_image_path' => '',

    // BingMapのURL
    'bing_url'              => 'https://www.bing.com/maps',

    // AWSのS3パス
    'aws_articles_bucket'    => 'Articles',
    'aws_users_bucket'       => 'Users',

    
    
    /**
     * メッセージリスト
     */
    'email_error'           => 'このメールアドレスはすでに使用されています',
    'name_error'            => 'このニックネームはすでに使用されています',
    'password_error'        => 'パスワードは半角英数字及び「_@!?#%&」の記号のみで入力してください',

];
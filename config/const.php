<?php

// 共通する値をキー&バリューで管理
return [

    // 性別
    'women'         => 0,
    'man'           => 1,
    'women_name'    => '女性',
    'man_name'      => '男性',

    // 公開フラグ
    'private'        => 0,
    'public'         => 1,
    'private_name'   => '非公開',
    'public_name'    => '公開',

    // アカウント停止フラグ
    'available'         => 0,
    'unavailable'       => 1,
    'available_name'    => '有効',
    'unavailable_name'  => '停止中',
    
    // 対象フラグ
    'all'           => 0,
    'member'        => 1,
    'all_name'      => '全員',
    'member_name'   => '会員限定',

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
    'aws_article_bucket'    => 'Article/',
    'aws_user_bucket'       => 'User/',

];
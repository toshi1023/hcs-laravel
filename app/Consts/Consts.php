<?php 

namespace App\Consts;

class Consts
{

    // URLの一部をセット(DB登録の分岐に活用)
    const ARTICLE_URL  = 'article';
    const USER_URL     = 'users';
    const REGISTER_URL = 'register';
    const LOGIN_URL = 'login';

    // 登録無しのプロフィール画像URL
    const NO_IMAGE = 'https://aws-hcs-image.s3-ap-northeast-1.amazonaws.com/User/no_image.png';
}
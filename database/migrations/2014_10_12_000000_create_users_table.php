<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('prof_photo_name')->nullable();
            $table->string('prof_photo_path')->nullable();
            $table->string('name')->unique();
            $table->string('prefecture');                               // お気に入り都道府県
            $table->date('birthday');
            $table->boolean('gender')->default(false);                  // 0: 女性, 1: 男性
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->boolean('status')->default(false);                  // アカウント停止フラグ
            $table->boolean('delete_flg')->default(false);  // 0: noフラグ, 1: 削除
            $table->timestamp('login_time')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}

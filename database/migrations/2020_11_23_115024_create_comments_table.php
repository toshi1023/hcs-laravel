<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommentsTable extends Migration
{
    /**
     * 記事専用のコメントを格納するテーブル
     * ※Json形式で格納予定
     */
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->bigIncrements('id')->comment('ID');
            $table->integer('article_id')->unsigned()->comment('記事ID');
            $table->integer('user_id')->unsigned()->comment('ユーザID');
            $table->string('comment')->comment('コメント');
            $table->boolean('delete_flg')->default(false)->comment('削除フラグ');      // 0: noフラグ, 1: 削除

            // 外部キー制約
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('article_id')->references('id')->on('articles')->onDelete('cascade');

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
        Schema::dropIfExists('comments');
    }
}

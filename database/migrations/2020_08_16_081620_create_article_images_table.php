<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateArticleImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /**
         * 記事専用の画像を格納するテーブル
         * ※Json形式で格納予定
         */
        Schema::create('article_images', function (Blueprint $table) {
            $table->increments('id');
            $table->string('article_photo')->nullable();  // 画像名
            $table->string('photo_path')->nullable();    // 画像パス
            $table->integer('article_id')->unsigned();
            $table->integer('user_id')->unsigned();

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
        Schema::dropIfExists('article_images');
    }
}

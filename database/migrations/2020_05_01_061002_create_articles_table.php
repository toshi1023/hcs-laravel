<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateArticlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->increments('id');
            $table->string('prefecture');
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->string('title', 40);
            $table->text('content');
            $table->boolean('type')->unsigned()->default(false);        // 0: 全員, 1: 会員
            $table->boolean('delete_flg')->unsigned()->default(0);      // 0: noフラグ, 1: 削除
            // $table->integer('likes_count');
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
        Schema::dropIfExists('articles');
    }
}

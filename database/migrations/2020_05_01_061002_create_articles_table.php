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
            $table->increments('id')->comment('ID');
            $table->string('prefecture')->comment('都道府県');
            $table->string('latitude', 50)->nullable()->comment('緯度');
            $table->string('longitude', 50)->nullable()->comment('経度');
            $table->string('title', 40)->comment('タイトル');
            $table->text('content')->comment('内容');
            $table->boolean('type')->unsigned()->default(false)->comment('公開タイプ');        // 0: 全員, 1: 会員
            $table->boolean('delete_flg')->unsigned()->default(0)->comment('削除フラグ');      // 0: noフラグ, 1: 削除
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

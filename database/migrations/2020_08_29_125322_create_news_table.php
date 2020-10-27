<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNewsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('news', function (Blueprint $table) {
            $table->increments('id')->comment('ID');
            $table->tinyInteger('type')->unsigned()->default(1)->comment('種別');                   // 1:公式情報, 2:警告
            $table->string('title', 40)->comment('タイトル');
            $table->string('content')->comment('内容');
            $table->boolean('status')->default(false)->comment('公開フラグ');                       // 0:非公開, 1:公開
            $table->boolean('member_flg')->unsigned()->default(false)->comment('公開タイプ');       // 0:全員, 1:会員
            $table->integer('admin_id')->unsigned()->comment('管理者ID');
            $table->text('memo')->nullable()->comment('備考');
            $table->boolean('delete_flg')->default(false)->comment('削除フラグ');                  // 0: noフラグ, 1: 削除
            $table->timestamps();

            // 外部キー制約
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('news');
    }
}

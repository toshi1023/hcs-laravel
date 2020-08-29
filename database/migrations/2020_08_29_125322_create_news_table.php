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
            $table->increments('id');
            $table->string('title', 40);
            $table->string('content');
            $table->boolean('status')->default(false);                       // 0:非公開, 1:公開
            $table->tinyInteger('type')->unsigned()->default(0);             // 0:全員, 1:会員
            $table->integer('admin_id')->unsigned();
            $table->tinyInteger('delete_flg')->unsigned()->default(0);;      // 0: noフラグ, 1: 削除
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

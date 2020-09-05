<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id_sender')->unsigned();                  // 発信者
            $table->integer('user_id_receiver')->unsigned();                // 受信者
            $table->string('content');
            $table->tinyInteger('delete_flg')->unsigned()->default(0);      // 0: noフラグ, 1: 削除
            $table->timestamps();

            // 外部キー制約
            $table->foreign('user_id_sender')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('messages');
    }
}